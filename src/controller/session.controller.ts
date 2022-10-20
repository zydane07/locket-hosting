import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repository/user.repository';
import { SessionRepository } from '../repository/session.repository';
import { Res } from '../helper/response';
import { ERROR, SUCCESS } from '../helper/constant';
import { createToken } from '../helper/token';
import { expiredDate } from '../helper/vegenerate';

export class SessionController {
  userRepository: UserRepository;
  sessionRepository: SessionRepository;
  constructor(
    userRepository: UserRepository,
    sessionRepository: SessionRepository,
  ) {
    this.userRepository = userRepository;
    this.sessionRepository = sessionRepository;
    this.refreshToken = this.refreshToken.bind(this);
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const { refresh_token } = req.body;
      const findSession = await this.sessionRepository.find({
        where: {
          refresh_token,
        },
      });
      if (!findSession) {
        return Res.error(res, ERROR.RefreshTokenNotFound);
      }

      const findUser = await this.userRepository.find({
        where: {
          id: findSession.user_id,
        },
      });
      if (!findUser) {
        return Res.error(res, ERROR.UserNotFound);
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
      const updateSession = await this.sessionRepository.update({
        where: {
          id: findSession.id,
        },
        data: {
          access_token: accessToken,
          refresh_token: refreshToken,
          refresh_token_expired_at: expDate,
        },
      });
      if (!updateSession) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.RefreshToken, {
        access_token: accessToken,
        refresh_token: refreshToken,
      });
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
