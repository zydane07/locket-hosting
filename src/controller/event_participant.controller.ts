import { Request, Response } from 'express';
import { ParticipantRepository } from 'src/repository/participant.repository';
import { EventRepository } from 'src/repository/event.repository';
import { ImageRepository } from 'src/repository/image.repository';
import { EventParticipantRepository } from 'src/repository/event_participant.repository';
import { Res } from '../helper/response';
import { generateID } from '../helper/vegenerate';
import { ERROR, SUCCESS, ROLE } from '../helper/constant';

export class EventParticipantController {
  participantRepository: ParticipantRepository;
  eventRepository: EventRepository;
  eventParticipantRepository: EventParticipantRepository;
  constructor(
    participantRepository: ParticipantRepository,
    eventRepository: EventRepository,
    eventParticipantRepository: EventParticipantRepository,
  ) {
    this.participantRepository = participantRepository;
    this.eventRepository = eventRepository;
    this.eventParticipantRepository = eventParticipantRepository;
    this.registerEvent = this.registerEvent.bind(this);
    this.findAllRegisteredEvent = this.findAllRegisteredEvent.bind(this);
  }

  async registerEvent(req: Request, res: Response) {
    try {
      const { event_id } = req.body;

      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }
      const findEvent = await this.eventRepository.find({
        where: {
          id: event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }
      if (!findEvent.is_verified) {
        return Res.error(res, ERROR.EventNotVerified);
      }

      const storeEventParticipant = await this.eventParticipantRepository.store(
        {
          data: {
            id: generateID(),
            participant_id: findParticipant.id,
            event_id: Number(event_id),
          },
        },
      );
      if (!storeEventParticipant) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.RegisterEvent, storeEventParticipant);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAllRegisteredEvent(req: Request, res: Response) {
    try {
      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findAll = await this.eventParticipantRepository.findAll({
        where: {
          participant_id: findParticipant.id,
        },
      });
      return Res.success(res, SUCCESS.GetAllEvents, findAll);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
