import { Request, Response } from 'express';
import { ERROR, SUCCESS } from 'src/helper/constant';
import { Res } from 'src/helper/response';
import {
  valCreateEventPrecondDesc,
  valUpdateEventPrecondDesc,
} from 'src/helper/validation';
import { generateID } from 'src/helper/vegenerate';
import { EventRepository } from 'src/repository/event.repository';
import { EventOrganizerRepository } from 'src/repository/event_organizer.repository';
import { EventPreconditionDescriptionRepository } from 'src/repository/event_precondition_description.repository';

export class EventPreconditionDescriptionController {
  eventOrganizerRepository: EventOrganizerRepository;
  eventRepository: EventRepository;
  eventPreconditionDescriptionRepository: EventPreconditionDescriptionRepository;
  constructor(
    eventOrganizerRepository: EventOrganizerRepository,
    eventRepository: EventRepository,
    eventPreconditionDescriptionRepository: EventPreconditionDescriptionRepository,
  ) {
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.eventRepository = eventRepository;
    this.eventPreconditionDescriptionRepository =
      eventPreconditionDescriptionRepository;
    this.createEventPreconditionDescription =
      this.createEventPreconditionDescription.bind(this);
    this.findAllEventPrecondDescByEventID =
      this.findAllEventPrecondDescByEventID.bind(this);
    this.findEventPrecondDescByID = this.findEventPrecondDescByID.bind(this);
    this.updateEventPreconditionDesc =
      this.updateEventPreconditionDesc.bind(this);
    this.deleteEventPreconditionDesc =
      this.deleteEventPreconditionDesc.bind(this);
  }

  async createEventPreconditionDescription(req: Request, res: Response) {
    try {
      const { event_id, name } = req.body;
      const validate = valCreateEventPrecondDesc.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      const findEO = await this.eventOrganizerRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findEventID = await this.eventRepository.find({
        where: {
          id: Number(event_id),
        },
      });
      if (!findEventID) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }
      if (findEventID.event_organizer_id !== findEO.id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const checkTotalPrecondition =
        await this.eventPreconditionDescriptionRepository.countAll({
          where: {
            event_id: findEventID.id,
          },
        });
      if (
        checkTotalPrecondition === Number(process.env.MAX_EVENT_PRECONDITION)
      ) {
        return Res.error(res, ERROR.MaxEventPrecondition);
      }

      const createEventPrecondDesc =
        await this.eventPreconditionDescriptionRepository.store({
          data: {
            id: generateID(),
            name,
            event_id: findEventID.id,
          },
        });
      if (!createEventPrecondDesc) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(
        res,
        SUCCESS.CreateEventPrecondDesc,
        createEventPrecondDesc,
      );
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAllEventPrecondDescByEventID(req: Request, res: Response) {
    try {
      const { event_id } = req.params;
      const findEventID = await this.eventRepository.find({
        where: {
          id: Number(event_id),
        },
      });
      if (!findEventID) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }
      const findAllEventPrecondDesc =
        await this.eventPreconditionDescriptionRepository.findAll({
          where: {
            event_id: findEventID.id,
          },
        });
      return Res.success(
        res,
        SUCCESS.GetAllEventPrecondDesc,
        findAllEventPrecondDesc,
      );
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findEventPrecondDescByID(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findEventPrecondDesc =
        await this.eventPreconditionDescriptionRepository.find({
          where: {
            id: Number(id),
          },
        });
      if (!findEventPrecondDesc) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findEventPrecondDesc.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      return Res.success(
        res,
        SUCCESS.GetEventPrecondDesc,
        findEventPrecondDesc,
      );
    } catch (err) {}
  }

  async updateEventPreconditionDesc(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { name } = req.body;
      const validate = valUpdateEventPrecondDesc.validate({ id, name });
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      const findEO = await this.eventOrganizerRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findPrecondDesc =
        await this.eventPreconditionDescriptionRepository.find({
          where: {
            id: Number(id),
          },
        });
      if (!findPrecondDesc) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findPrecondDesc.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }
      if (findEvent.event_organizer_id !== findEO.id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const updatePrecondDesc =
        await this.eventPreconditionDescriptionRepository.update({
          where: {
            id: findPrecondDesc.id,
          },
          data: {
            name,
          },
        });
      if (!updatePrecondDesc) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.UpdateData, updatePrecondDesc);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async deleteEventPreconditionDesc(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const findEO = await this.eventOrganizerRepository.find({
        where: {
          user_id: req.user?.id,
        },
      });
      if (!findEO) {
        return Res.error(res, ERROR.UserNotFound);
      }

      const findPrecondDesc =
        await this.eventPreconditionDescriptionRepository.find({
          where: {
            id: Number(id),
          },
        });
      if (!findPrecondDesc) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findPrecondDesc.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }
      if (findEvent.event_organizer_id !== findEO.id) {
        return Res.error(res, ERROR.NotAllowed);
      }

      const deleteEventPrecondDesc =
        await this.eventPreconditionDescriptionRepository.delete({
          where: {
            id: findPrecondDesc.id,
          },
        });
      if (!deleteEventPrecondDesc) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.DeleteData, deleteEventPrecondDesc);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
