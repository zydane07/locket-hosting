import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventRepository } from 'src/repository/event.repository';
import { ParticipantRepository } from 'src/repository/participant.repository';
import { UserRepository } from 'src/repository/user.repository';
import { EventOrganizerRepository } from 'src/repository/event_organizer.repository';
import { EventOrganizerPreconditionRepository } from 'src/repository/event_organizer_precondition.repository';
import { Res } from 'src/helper/response';
import { SUCCESS, ERROR } from 'src/helper/constant';
import { sendMail } from 'src/service/mail';
import { valNotifyEO } from 'src/helper/validation';
import { pagination } from 'src/helper/pagination';

export class AdminController {
  prisma: PrismaClient;
  userRepository: UserRepository;
  participantRepository: ParticipantRepository;
  eventOrganizerRepository: EventOrganizerRepository;
  eventRepository: EventRepository;
  eventOrganizerPreconditionRepository: EventOrganizerPreconditionRepository;
  constructor(
    prisma: PrismaClient,
    userRepository: UserRepository,
    participantRepository: ParticipantRepository,
    eventOrganizerRepository: EventOrganizerRepository,
    eventRepository: EventRepository,
    eventOrganizerPreconditionRepository: EventOrganizerPreconditionRepository,
  ) {
    this.prisma = prisma;
    this.userRepository = userRepository;
    this.participantRepository = participantRepository;
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.eventRepository = eventRepository;
    this.eventOrganizerPreconditionRepository =
      eventOrganizerPreconditionRepository;
    this.findEventOrganizerPrecondition =
      this.findEventOrganizerPrecondition.bind(this);
    this.findNotVerifiedEventOrganizer =
      this.findNotVerifiedEventOrganizer.bind(this);
    this.verifyEventOrganizer = this.verifyEventOrganizer.bind(this);
    this.verifyEvent = this.verifyEvent.bind(this);
    this.findUnverifiedEvents = this.findUnverifiedEvents.bind(this);
    this.notifyEO = this.notifyEO.bind(this);
  }

  async findNotVerifiedEventOrganizer(req: Request, res: Response) {
    try {
      const findNotVerifiedEO =
        await this.eventOrganizerRepository.findAllWithCondition({
          where: {
            is_verified: false,
          },
        });
      if (!findNotVerifiedEO) {
        return Res.error(res, ERROR.DataEmpty);
      }
      return Res.success(res, SUCCESS.GetAllEO, findNotVerifiedEO);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async verifyEventOrganizer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findEO = await this.eventOrganizerRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }
      if (findEO.is_verified) {
        return Res.error(res, ERROR.EOIsVerified);
      }

      const findEOPrecondition =
        await this.eventOrganizerPreconditionRepository.find({
          where: {
            event_organizer_id: findEO.id,
          },
        });
      if (!findEOPrecondition) {
        return Res.error(res, ERROR.EOPreconditionNotFound);
      }

      await this.prisma.$transaction(async (tx) => {
        const verifyEO =
          await this.eventOrganizerRepository.updateWithTransaction(tx, {
            where: {
              id: findEO.id,
            },
            data: {
              is_verified: true,
            },
          });
        if (!verifyEO) {
          throw new Error('Transaction failed');
        }

        const deletePrecondition =
          await this.eventOrganizerPreconditionRepository.deleteWithTransaction(
            tx,
            {
              where: {
                id: findEOPrecondition.id,
              },
            },
          );
        if (!deletePrecondition) {
          throw new Error('Transaction failed');
        }
      });

      return Res.success(res, SUCCESS.VerifyEO, {});
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findEventOrganizerPrecondition(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findEO = await this.eventOrganizerRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findEOPrecondition =
        await this.eventOrganizerPreconditionRepository.find({
          where: {
            event_organizer_id: findEO.id,
          },
        });
      if (!findEOPrecondition) {
        return Res.error(res, ERROR.EOPreconditionNotFound);
      }
      return Res.success(res, SUCCESS.GetEOPrecondition, findEOPrecondition);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findUnverifiedEvents(req: Request, res: Response) {
    try {
      const { per_page, page, eligibility_id, category_id, search } = req.query;
      let eligibility = Number(eligibility_id) || undefined;
      let category = Number(category_id) || undefined;
      const events = await this.eventRepository.findAll({
        ...pagination({ per_page, page }),
        where: {
          is_verified: false,
          eligibility_id: eligibility,
          category_id: category,
          name: {
            contains: search,
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });
      return Res.success(res, SUCCESS.GetAllEvents, events);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async verifyEvent(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findEvent = await this.eventRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }
      if (findEvent.is_verified) {
        return Res.error(res, ERROR.EventIsVerified);
      }

      const verifyEvent = await this.eventRepository.update({
        where: {
          id: findEvent.id,
        },
        data: {
          is_verified: true,
        },
      });
      if (!verifyEvent) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.VerifyEvent, verifyEvent);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async notifyEO(req: Request, res: Response) {
    try {
      const { event_organizer_id, report_message } = req.body;
      const validate = valNotifyEO.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      const findEO = await this.eventOrganizerRepository.find({
        where: {
          id: event_organizer_id,
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findUser = await this.userRepository.find({
        where: {
          id: findEO.user_id,
        },
      });
      if (!findUser) {
        return Res.error(res, ERROR.UserNotFound);
      }

      if (process.env.SEND_MAIL) {
        const subjectEmail = 'Notification Warning';
        const message = `
        <h1>Notification from admin</h1>
        <p>${report_message}</p>`;

        switch (process.env.NODE_ENV) {
          case 'development':
            await sendMail(
              <string>process.env.TEST_EMAIL,
              subjectEmail,
              message,
            );
            break;
          default:
            await sendMail(findUser.email, subjectEmail, message);
        }
      }
      return Res.success(res, SUCCESS.SendReport, report_message);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
