import { Request, Response } from 'express';
import { UserRepository } from 'src/repository/user.repository';
import { ParticipantRepository } from 'src/repository/participant.repository';
import { EventOrganizerRepository } from 'src/repository/event_organizer.repository';
import { Res } from 'src/helper/response';
import { ERROR, ROLE, SUCCESS } from 'src/helper/constant';

export class UserController {
  userRepository: UserRepository;
  participantRepository: ParticipantRepository;
  eventOrganizerRepository: EventOrganizerRepository;
  constructor(
    userRepository: UserRepository,
    participantRepository: ParticipantRepository,
    eventOrganizerRepository: EventOrganizerRepository,
  ) {
    this.userRepository = userRepository;
    this.participantRepository = participantRepository;
    this.eventOrganizerRepository = eventOrganizerRepository;
    this.profile = this.profile.bind(this);
  }

  async profile(req: Request, res: Response) {
    try {
      const { user } = req;
      if (!user) {
        return Res.error(res, ERROR.UserNotFound);
      }

      let profile;
      switch (user.role_id) {
        case ROLE.PARTICIPANT:
          profile = await this.participantRepository.find({
            where: {
              user_id: user.id,
            },
          });
          break;
        case ROLE.EVENT_ORGANIZER:
          profile = await this.eventOrganizerRepository.find({
            where: {
              user_id: user.id,
            },
          });
          break;
        case ROLE.ADMIN:
          profile = null;
      }
      return Res.success(res, SUCCESS.Profile, {
        id: user.id,
        email: user.email,
        name: user.name,
        role_id: user.role_id,
        ...profile,
      });
    } catch (err) {
      return Res.error(res, ERROR.InternalServer);
    }
  }
}
