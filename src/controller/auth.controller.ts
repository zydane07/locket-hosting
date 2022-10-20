import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

import { UserRepository } from '../repository/user.repository';
import { SessionRepository } from '../repository/session.repository';
import { EventOrganizerRepository } from '../repository/event_organizer.repository';
import { TokenRepository } from '../repository/token.repository';
import {
  valLogin,
  valForgotPassword,
  valResetPassword,
} from '../helper/validation';
import { Res } from '../helper/response';
import { ERROR, SUCCESS, ROLE } from '../helper/constant';
import { createToken } from '../helper/token';
import { expiredDate, generateID, isTokenExpired } from '../helper/vegenerate';
import { sendMail } from '../service/mail';

export class AuthController {
  prisma: PrismaClient;
  userRepository: UserRepository;
  sessionRepository: SessionRepository;
  eventOrganizerRepository: EventOrganizerRepository;
  tokenRepository: TokenRepository;
  constructor(
    prisma: PrismaClient,
    userRepository: UserRepository,
    sessionRepository: SessionRepository,
    eventOrganizerRepository: EventOrganizerRepository,
    tokenRepository: TokenRepository,
  ) {
    this.prisma = prisma;
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.tokenRepository = tokenRepository;
    this.login = this.login.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = valLogin.validate(req.body);
      if (result.error) {
        return Res.error(res, result.error.details[0].message);
      }

      const findUser = await this.userRepository.find({
        where: {
          email,
        },
      });
      if (!findUser) {
        return Res.error(res, ERROR.WrongEmailorPassword);
      }

      // Check IF user is EO and is not VERIFIED
      if (findUser.role_id === ROLE.EVENT_ORGANIZER) {
        const checkEO = await this.eventOrganizerRepository.find({
          where: {
            user_id: findUser.id,
          },
        });
        if (!checkEO) {
          return Res.error(res, ERROR.WrongEmailorPassword);
        }
      }

      const comparePassword = await bcrypt.compare(password, findUser.password);
      if (!comparePassword) {
        return Res.error(res, ERROR.WrongEmailorPassword);
      }

      const payload = {
        email: findUser.email,
        role_id: findUser.role_id,
      };

      const accessToken = createToken(
        payload,
        <jwt.Secret>process.env.VERIFY_KEY,
        <string | number>process.env.ACCESS_TOKEN_EXPIRES,
      );
      const refreshToken = createToken(
        payload,
        <jwt.Secret>process.env.VERIFY_KEY_REFRESH,
        <string | number>process.env.REFRESH_TOKEN_EXPIRES,
      );

      const expDate = expiredDate(4320);
      const newSession = await this.sessionRepository.store({
        data: {
          id: generateID(),
          access_token: accessToken,
          refresh_token: refreshToken,
          refresh_token_expired_at: expDate,
          user_id: findUser.id,
        },
      });

      if (!newSession) {
        return Res.error(res, ERROR.InternalServer);
      }
      return Res.success(res, SUCCESS.Login, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const result = valForgotPassword.validate({ email });
      if (result.error) {
        return Res.error(res, result.error.details[0].message);
      }

      const findUser = await this.userRepository.find({
        where: {
          email,
        },
      });
      if (!findUser) {
        return Res.error(res, ERROR.EmailDoesNotExist);
      }

      const findIfTokenExist = await this.tokenRepository.find({
        where: {
          email: findUser.email,
        },
      });
      if (findIfTokenExist) {
        return Res.error(res, ERROR.AlreadySendResetPasswordRequest);
      }

      const payload = {
        email: findUser.email,
      };

      const token = createToken(
        payload,
        <jwt.Secret>process.env.VERIFY_KEY,
        <string | number>process.env.ACCESS_TOKEN_EXPIRES,
      );
      const expDate = expiredDate(10);

      const tokenForgotPassword = await this.tokenRepository.store({
        data: {
          id: generateID(),
          email: email,
          token: token,
          expired_at: expDate,
        },
      });

      if (process.env.SEND_MAIL) {
        const subjectEmail = 'Forgot Password';
        const message = `
        <h1>Reset your password!</h1>
        <p>Silahkan melakukan reset password melalui link berikut:</p>
        <p style="font-size: 24px;">Link verification: <strong>${process.env.LINK_RESET_PASSWORD}${tokenForgotPassword.token}</strong></p>
    `;

        switch (process.env.NODE_ENV) {
          case 'development':
            await sendMail(
              <string>process.env.TEST_EMAIL,
              subjectEmail,
              message,
            );
            break;
          default:
            await sendMail(email, subjectEmail, message);
        }
      }
      return Res.success(res, SUCCESS.ForgotPassword, {});
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async resetPassword(req: Request, res: Response) {
    try {
      const { token } = req.params;
      const { password, repassword } = req.body;

      const validate = valResetPassword.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      if (password !== repassword) {
        return Res.error(res, ERROR.PasswordNotMatch);
      }

      const findToken = await this.tokenRepository.find({
        where: {
          token,
        },
      });
      if (!findToken) {
        return Res.error(res, ERROR.TokenNotExist);
      }

      const checkExpiredToken = isTokenExpired(findToken.expired_at);
      if (checkExpiredToken) {
        return Res.error(res, ERROR.TokenExpired);
      }

      const findUser = await this.userRepository.find({
        where: {
          email: findToken.email,
        },
      });
      if (!findUser) {
        return Res.error(res, ERROR.EmailDoesNotExist);
      }

      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT),
      );

      await this.prisma.$transaction(async (tx) => {
        const updateUser = await this.userRepository.updateWithTransaction(tx, {
          where: {
            id: findUser.id,
          },
          data: {
            password: hashPassword,
          },
        });
        if (!updateUser) {
          throw new Error('Transaction failed');
        }

        const deleteToken = await this.tokenRepository.deleteWithTransaction(
          tx,
          {
            where: {
              id: findToken.id,
            },
          },
        );
        if (!deleteToken) {
          throw new Error('Transaction failed');
        }

        return Res.success(res, SUCCESS.ResetPassword, {});
      });
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
