import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { EventCommentRepository } from 'src/repository/event_comment.repository';
import { EventRepository } from 'src/repository/event.repository';
import { UserRepository } from 'src/repository/user.repository';
import { Res } from '../helper/response';
import { ERROR, SUCCESS } from '../helper/constant';
import { valCreateComment, valUpdateComment } from '../helper/validation';
import { generateID } from '../helper/vegenerate';

export class EventCommentController {
  prisma: PrismaClient;
  eventCommentRepository: EventCommentRepository;
  eventRepository: EventRepository;
  userRepository: UserRepository;
  constructor(
    prisma: PrismaClient,
    eventCommentRepository: EventCommentRepository,
    eventRepository: EventRepository,
    userRepository: UserRepository,
  ) {
    this.prisma = prisma;
    this.eventCommentRepository = eventCommentRepository;
    this.eventRepository = eventRepository;
    this.userRepository = userRepository;
    this.create = this.create.bind(this);
    this.findAllParentCommentsByEventID =
      this.findAllParentCommentsByEventID.bind(this);
    this.findAllChildCommentsByParentCommentID =
      this.findAllChildCommentsByParentCommentID.bind(this);
    this.findByID = this.findByID.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { comment, event_id, parent_id, mentioned_user } = req.body;
      const validate = valCreateComment.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
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

      if (parent_id) {
        const findParentComment = await this.eventCommentRepository.find({
          where: {
            id: parent_id,
          },
        });
        if (!findParentComment) {
          return Res.error(res, ERROR.NotFound);
        }
        if (findParentComment.parent_id) {
          return Res.error(res, ERROR.IsChildComment);
        }
      }

      if (mentioned_user) {
        const findUser = await this.userRepository.find({
          where: {
            id: mentioned_user,
          },
        });
        if (!findUser) {
          return Res.error(res, ERROR.UserNotFound);
        }
      }

      const createComment = await this.eventCommentRepository.store({
        data: {
          id: generateID(),
          user_id: req.user?.id,
          event_id: findEvent.id,
          comment,
          parent_id,
          mentioned_user,
        },
      });
      if (!createComment) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.CreateComment, createComment);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAllParentCommentsByEventID(req: Request, res: Response) {
    try {
      const { event_id } = req.params;
      const findEvent = await this.eventRepository.find({
        where: {
          id: Number(event_id),
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      const findParentComments =
        await this.eventCommentRepository.findAllWithCondition({
          where: {
            event_id: findEvent.id,
            parent_id: null,
          },
        });
      return Res.success(res, SUCCESS.GetAllComment, findParentComments);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAllChildCommentsByParentCommentID(req: Request, res: Response) {
    try {
      const { parent_comment_id } = req.params;
      const findParentComment = await this.eventCommentRepository.find({
        where: {
          id: Number(parent_comment_id),
        },
      });
      if (!findParentComment) {
        return Res.error(res, ERROR.NotFound);
      }
      const findEvent = await this.eventRepository.find({
        where: {
          id: findParentComment.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      const findChildComments =
        await this.eventCommentRepository.findAllWithCondition({
          where: {
            event_id: findEvent.id,
            parent_id: findParentComment.id,
          },
        });
      return Res.success(res, SUCCESS.GetAllComment, findChildComments);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findByID(req: Request, res: Response) {
    try {
      const { comment_id } = req.params;
      const findComment = await this.eventCommentRepository.find({
        where: {
          id: Number(comment_id),
        },
      });
      if (!findComment) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findComment.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      return Res.success(res, SUCCESS.GetComment, findComment);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async updateComment(req: Request, res: Response) {
    try {
      const { comment_id, comment, mentioned_user } = req.body;
      const validate = valUpdateComment.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }

      const findComment = await this.eventCommentRepository.find({
        where: {
          id: comment_id,
          user_id: req.user?.id,
        },
      });
      if (!findComment) {
        return Res.error(res, ERROR.NotFound);
      }

      const findEvent = await this.eventRepository.find({
        where: {
          id: findComment.event_id,
        },
      });
      if (!findEvent) {
        return Res.error(res, ERROR.EventDoesNotExist);
      }

      if (mentioned_user) {
        const findUser = await this.userRepository.find({
          where: {
            id: mentioned_user,
          },
        });
        if (!findUser) {
          return Res.error(res, ERROR.UserNotFound);
        }
      }

      const updateComment = await this.eventCommentRepository.update({
        where: {
          id: findComment.id,
        },
        data: {
          comment,
          mentioned_user,
        },
      });
      if (!updateComment) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.UpdateComment, updateComment);
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async deleteComment(req: Request, res: Response) {
    try {
      const { comment_id } = req.params;
      const findComment = await this.eventCommentRepository.find({
        where: {
          id: Number(comment_id),
          user_id: req.user?.id,
        },
      });
      if (!findComment) {
        return Res.error(res, ERROR.NotFound);
      }

      if (findComment.parent_id) {
        const deleteByID = await this.eventCommentRepository.delete({
          where: {
            id: findComment.id,
          },
        });
        if (!deleteByID) {
          return Res.error(res, ERROR.InternalServer);
        }
      } else {
        await this.prisma.$transaction(async (tx) => {
          const deleteAllChildComment =
            await this.eventCommentRepository.deleteManyWithTransaction(tx, {
              where: {
                parent_id: findComment.id,
              },
            });
          if (!deleteAllChildComment) {
            throw new Error('Transaction failed');
          }

          const deleteParentComment =
            await this.eventCommentRepository.deleteWithTransaction(tx, {
              where: {
                id: findComment.id,
              },
            });
          if (!deleteParentComment) {
            throw new Error('Transaction failed');
          }
        });
      }
      return Res.success(res, SUCCESS.DeleteData, {});
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
