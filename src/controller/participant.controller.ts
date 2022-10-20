import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ParticipantRepository } from '../repository/participant.repository';
import { TokenRepository } from '../repository/token.repository';
import { UserRepository } from '../repository/user.repository';
import { EventOrganizerRepository } from 'src/repository/event_organizer.repository';
import { SubscribeEORepository } from 'src/repository/subscribe_eo.repository';
import { valRegisParticipant } from '../helper/validation';
import { Res } from '../helper/response';
import { ERROR, SUCCESS } from '../helper/constant';
import { createToken } from '../helper/token';
import { generateID, expiredDate } from '../helper/vegenerate';
import { sendMail } from '../service/mail';
import { Event_Organizer } from '@prisma/client';

export class ParticipantController {
  participantRepository: ParticipantRepository;
  userRepository: UserRepository;
  tokenRepository: TokenRepository;
  eventOrganizerRepository: EventOrganizerRepository;
  subscribeEORepository: SubscribeEORepository;
  constructor(
    participantRepository: ParticipantRepository,
    userRepository: UserRepository,
    tokenRepository: TokenRepository,
    eventOrganizerRepository: EventOrganizerRepository,
    subscribeEORepository: SubscribeEORepository,
  ) {
    this.participantRepository = participantRepository;
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.subscribeEORepository = subscribeEORepository;
    this.register = this.register.bind(this);
    this.findSubscribedEO = this.findSubscribedEO.bind(this);
  }

  async register(req: Request, res: Response) {
    try {
      const { email, name, phoneNumber, password, repassword } = req.body;

      const validate = valRegisParticipant.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      if (password != repassword) {
        return Res.error(res, ERROR.PasswordNotMatch);
      }

      const findEmailUser = await this.userRepository.find({
        where: {
          email: email,
        },
      });
      if (findEmailUser) {
        return Res.error(res, ERROR.EmailRegistered);
      }

      const findPhoneParticipant = await this.participantRepository.find({
        where: {
          phone_number: phoneNumber,
        },
      });
      if (findPhoneParticipant) {
        return Res.error(res, ERROR.PhoneNumberRegistered);
      }

      const hashPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT),
      );

      const token = createToken(
        {
          email,
          name,
          password: hashPassword,
          phoneNumber,
        },
        <jwt.Secret>process.env.VERIFY_KEY,
        <string | number>process.env.ACCESS_TOKEN_EXPIRES,
      );
      const ID: number = generateID();
      const ExpDate = expiredDate(30);

      const newToken = await this.tokenRepository.store({
        data: {
          id: ID,
          email: email,
          token: token,
          expired_at: ExpDate,
        },
      });
      if (!newToken) {
        return Res.error(res, ERROR.InternalServer);
      }

      if (process.env.SEND_MAIL) {
        const subjectEmail = 'Register Participant';
        const message = `
        <h1>Registrasi berhasil!</h1>
        <p>Silahkan melakukan verifikasi melalui link berikut:</p>
        <p style="font-size: 24px;">Link verification: <strong>${process.env.LINK_VERIFICATION}${newToken.token}</strong></p>
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
      return Res.success(res, SUCCESS.Register, newToken);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findSubscribedEO(req: Request, res: Response) {
    try {
      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findAllSubscribedEO = await this.subscribeEORepository.findAll({
        where: {
          participant_id: findParticipant.id,
        },
      });

      const eos = await Promise.all(
        findAllSubscribedEO.map(async (eo) => {
          const getEO = await this.eventOrganizerRepository.find({
            where: {
              id: eo.event_organizer_id,
            },
            include: {
              user: {
                select: {
                  name: true,
                },
              },
              image: {
                select: {
                  secure_url: true,
                },
              },
            },
          });
          return getEO;
        }),
      );

      return Res.success(res, SUCCESS.GetAllEO, eos);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
