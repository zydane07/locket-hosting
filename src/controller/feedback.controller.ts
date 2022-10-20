import { Request, response, Response } from 'express';
import { FeedbackRepository } from 'src/repository/feedback.repository';
import { Res } from '../helper/response';
import { ERROR, SUCCESS } from '../helper/constant';
import { generateID } from '../helper/vegenerate';
import { valFeedbackMsg } from 'src/helper/validation';

export class FeedbackController {
  feedbackRepository: FeedbackRepository;
  constructor(feedbackRepository: FeedbackRepository) {
    this.feedbackRepository = feedbackRepository;
    this.create = this.create.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  async create(req: Request, res: Response) {
    try {
      const { feedback_message, rating_stars } = req.body;
      const validate = valFeedbackMsg.validate(req.body);
      if (validate.error) {
        return Res.error(res, validate.error.details[0].message);
      }
      const createFeedback = await this.feedbackRepository.store({
        data: {
          id: generateID(),
          user_id: req.user?.id,
          review: feedback_message,
          star: rating_stars,
        },
      });
      if (!createFeedback) {
        return Res.error(res, ERROR.InternalServer);
      }

      return Res.success(res, SUCCESS.SendFeedback, {});
    } catch (err) {
      return Res.error(res, err);
    }
  }

  async findAll(req: Request, res: Response) {
    try {
      const feedbacks = await this.feedbackRepository.findAll();
      return Res.success(res, SUCCESS.GetAllFeedback, feedbacks);
    } catch (err) {
      return Res.error(res, err);
    }
  }
}
