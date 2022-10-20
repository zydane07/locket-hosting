import { Request, Response } from 'express';
import { ERROR, SUCCESS } from 'src/helper/constant';
import { Res } from 'src/helper/response';
import {
  valCreateEventPrecond,
  valUpdateEventPrecond,
} from 'src/helper/validation';
import { generateID } from 'src/helper/vegenerate';
import { EventRepository } from 'src/repository/event.repository';
import { EventOrganizerRepository } from 'src/repository/event_organizer.repository';
import { EventParticipantRepository } from 'src/repository/event_participant.repository';
import { EventPreconditionRepository } from 'src/repository/event_precondition.repository';
import { EventPreconditionDescriptionRepository } from 'src/repository/event_precondition_description.repository';
import { ImageRepository } from 'src/repository/image.repository';
import { ParticipantRepository } from 'src/repository/participant.repository';

export class EventPreconditionController {
  participantRepository: ParticipantRepository;
  eventOrganizerRepository: EventOrganizerRepository;
  eventRepository: EventRepository;
  eventParticipantRepository: EventParticipantRepository;
  eventPreconditionRepository: EventPreconditionRepository;
  eventPreconditionDescriptionRepository: EventPreconditionDescriptionRepository;
  imageRepository: ImageRepository;
  constructor(
    participantRepository: ParticipantRepository,
    eventOrganizerRepository: EventOrganizerRepository,
    eventRepository: EventRepository,
    eventParticipantRepository: EventParticipantRepository,
    eventPreconditionRepository: EventPreconditionRepository,
    eventPreconditionDescriptionRepository: EventPreconditionDescriptionRepository,
    imageRepository: ImageRepository,
  ) {
    this.participantRepository = participantRepository;
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.eventRepository = eventRepository;
    this.eventParticipantRepository = eventParticipantRepository;
    this.eventPreconditionRepository = eventPreconditionRepository;
    this.eventPreconditionDescriptionRepository =
      eventPreconditionDescriptionRepository;
    this.imageRepository = imageRepository;
    this.storeEventPrecondition = this.storeEventPrecondition.bind(this);
    this.findParticipantEventPreconditions =
      this.findParticipantEventPreconditions.bind(this);
    this.findEventPrecondByID = this.findEventPrecondByID.bind(this);
    this.updateEventPrecondition = this.updateEventPrecondition.bind(this);
    this.deleteEventPrecondition = this.deleteEventPrecondition.bind(this);
    this.findAllParticipantEventPrecondition =
      this.findAllParticipantEventPrecondition.bind(this);
    this.findParticipantEventPrecondByID =
      this.findParticipantEventPrecondByID.bind(this);
  }

  async storeEventPrecondition(req: Request, res: Response) {
    try {
      const { event_precondition_description_id, image_id } = req.body;
      const validate = valCreateEventPrecond.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findEventPrecondDesc =
        await this.eventPreconditionDescriptionRepository.find({
          where: {
            id: event_precondition_description_id,
          },
        });
      if (!findEventPrecondDesc) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEventParticipant = await this.eventParticipantRepository.find({
        where: {
          participant_id: findParticipant.id,
          event_id: findEventPrecondDesc.event_id,
        },
      });
      if (!findEventParticipant) {
        return Res.error(res, ERROR.HaveNotRegisterEventYet);
      }
      if (findEventPrecondDesc.event_id !== findEventParticipant.event_id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findEventParticipant.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      const alreadyStorePrecond = await this.eventPreconditionRepository.find({
        where: {
          event_participant_id: findEventParticipant.id,
          event_precondition_description_id: findEventPrecondDesc.id,
        },
      });
      if (alreadyStorePrecond) {
        return Res.error(res, ERROR.AlreadyHaPrecondition);
      }

      const findImage = await this.imageRepository.find({
        where: {
          id: image_id,
        },
      });
      if (!findImage) {
        return Res.error(res, ERROR.ImageNotFound);
      }

      const storePrecondition = await this.eventPreconditionRepository.store({
        data: {
          id: generateID(),
          event_participant_id: findEventParticipant.id,
          image_id: findImage.id,
          event_precondition_description_id: findEventPrecondDesc.id,
        },
      });
      if (!storePrecondition) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.UploadFile, storePrecondition);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findParticipantEventPreconditions(req: Request, res: Response) {
    try {
      const { event_id } = req.params;

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
          id: Number(event_id),
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      const participantEvent = await this.eventParticipantRepository.find({
        where: {
          participant_id: findParticipant.id,
          event_id: findEvent.id,
        },
      });
      if (!participantEvent) {
        return Res.error(res, ERROR.HaveNotRegisterEventYet);
      }

      const findAllUserEventPrecond =
        await this.eventPreconditionRepository.findAll({
          where: {
            event_participant_id: participantEvent.id,
          },
        });

      return Res.success(res, SUCCESS.GetAllPrecond, findAllUserEventPrecond);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findEventPrecondByID(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }
      const findEventPrecond = await this.eventPreconditionRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!findEventPrecond) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEventParticipant = await this.eventParticipantRepository.find({
        where: {
          id: findEventPrecond.event_participant_id,
        },
      });
      if (!findEventParticipant) {
        return Res.error(res, ERROR.NotFound);
      }
      if (findParticipant.id !== findEventParticipant.participant_id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findEventParticipant.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      return Res.success(res, SUCCESS.GetParticipantPrecond, findEventPrecond);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async updateEventPrecondition(req: Request, res: Response) {
    try {
      const { id, image_id } = req.body;
      const validate = valUpdateEventPrecond.validate({ id, image_id });
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findEventPrecond = await this.eventPreconditionRepository.find({
        where: {
          id,
        },
      });
      if (!findEventPrecond) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEventParticipant = await this.eventParticipantRepository.find({
        where: {
          id: findEventPrecond.event_participant_id,
        },
      });
      if (!findEventParticipant) {
        return Res.error(res, ERROR.NotFound);
      }
      if (findEventParticipant.participant_id !== findParticipant.id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const updateEventPrecond = await this.eventPreconditionRepository.update({
        where: {
          id: findEventPrecond.id,
        },
        data: {
          image_id,
        },
      });
      if (!updateEventPrecond) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.UpdateData, updateEventPrecond);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async deleteEventPrecondition(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findParticipant = await this.participantRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findParticipant) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findEventPrecond = await this.eventPreconditionRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!findEventPrecond) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEventParticipant = await this.eventParticipantRepository.find({
        where: {
          id: findEventPrecond.event_participant_id,
        },
      });
      if (!findEventParticipant) {
        return Res.error(res, ERROR.NotFound);
      }
      if (findParticipant.id !== findEventParticipant.participant_id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findEventParticipant.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      const deleteEventPrecond = await this.eventPreconditionRepository.delete({
        where: {
          id: findEventPrecond.id,
        },
      });
      if (!deleteEventPrecond) {
        return Res.error(res, ERROR.InternalServer);
      }
      return Res.success(res, SUCCESS.DeleteData, deleteEventPrecond);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAllParticipantEventPrecondition(req: Request, res: Response) {
    try {
      const { event_id } = req.params;
      const findEO = await this.eventOrganizerRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: Number(event_id),
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      const findAllParticipantPrecond =
        await this.eventParticipantRepository.findAll({
          where: {
            event_id: findEvent.id,
          },
          include: {
            EventPrecondition: true,
          },
        });
      return Res.success(res, SUCCESS.GetAllPrecond, findAllParticipantPrecond);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findParticipantEventPrecondByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findEventPrecondByID = await this.eventPreconditionRepository.find({
        where: {
          id: Number(id),
        },
      });
      if (!findEventPrecondByID) {
        return Res.error(res, ERROR.NotFound);
      }
      return Res.success(
        res,
        SUCCESS.GetParticipantPrecond,
        findEventPrecondByID,
      );
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
