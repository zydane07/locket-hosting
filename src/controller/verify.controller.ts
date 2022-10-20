import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repository/user.repository';
import { ParticipantRepository } from '../repository/participant.repository';
import { EventOrganizerRepository } from '../repository/event_organizer.repository';
import { TokenRepository } from '../repository/token.repository';
import { Res } from '../helper/response';
import { SUCCESS, ERROR, ROLE } from '../helper/constant';
import { generateID, isTokenExpired } from '../helper/vegenerate';
import { decodeToken } from '../helper/token';

export class VerifyController {
  prisma: PrismaClient;
  userRepository: UserRepository;
  participantRepository: ParticipantRepository;
  eventOrganizerRepository: EventOrganizerRepository;
  tokenRepository: TokenRepository;
  constructor(
    prisma: PrismaClient,
    userRepository: UserRepository,
    participantRepository: ParticipantRepository,
    eventOrganizerRepository: EventOrganizerRepository,
    tokenRepository: TokenRepository,
  ) {
    this.prisma = prisma;
    this.userRepository = userRepository;
    this.participantRepository = participantRepository;
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.tokenRepository = tokenRepository;
    this.verifyEmailParticipant = this.verifyEmailParticipant.bind(this);
    this.verifyEmailEventOrganizer = this.verifyEmailEventOrganizer.bind(this);
  }

  async verifyEmailParticipant(req: Request, res: Response) {
    try {
      const { token } = req.body;
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

      const decode: any = await decodeToken(
        token,
        <jwt.Secret>process.env.VERIFY_KEY,
      );

      const checkToken = await this.tokenRepository.find({
        where: {
          email: decode.email,
        },
      });
      if (!checkToken) {
        return Res.error(res, ERROR.TokenNotExist);
      }
      await this.prisma.$transaction(async (tx) => {
        const newUser = await this.userRepository.storeWithTransaction(tx, {
          data: {
            id: generateID(),
            email: decode.email,
            name: decode.name,
            password: decode.password,
            role_id: ROLE.PARTICIPANT,
          },
        });
        if (!newUser) {
          throw new Error('Transaction failed');
        }

        const newParticipant =
          await this.participantRepository.storeWithTransaction(tx, {
            data: {
              id: generateID(),
              user_id: newUser.id,
              phone_number: decode.phoneNumber,
              image_id: 1,
            },
          });

        if (!newParticipant) {
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
      });

      return Res.success(res, SUCCESS.Verification, {});
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async verifyEmailEventOrganizer(req: Request, res: Response) {
    try {
      const { token } = req.body;
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

      const decode: any = await decodeToken(
        token,
        <jwt.Secret>process.env.VERIFY_KEY,
      );

      const checkToken = await this.tokenRepository.find({
        where: {
          email: decode.email,
        },
      });
      if (!checkToken) {
        return Res.error(res, ERROR.TokenNotExist);
      }

      await this.prisma.$transaction(async (tx) => {
        const newUser = await this.userRepository.storeWithTransaction(tx, {
          data: {
            id: generateID(),
            email: decode.email,
            name: decode.name,
            password: decode.password,
            role_id: ROLE.EVENT_ORGANIZER,
          },
        });
        if (!newUser) {
          throw new Error('Transaction failed');
        }

        const newEventOrganizer =
          await this.eventOrganizerRepository.storeWithTransaction(tx, {
            data: {
              id: generateID(),
              user_id: newUser.id,
              is_verified: false,
              image_id: 1,
            },
          });

        if (!newEventOrganizer) {
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
      });

      return Res.success(res, SUCCESS.Verification, {});
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
