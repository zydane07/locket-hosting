import Joi from 'joi';

export const valRegisParticipant = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().max(100).required(),
  phoneNumber: Joi.string().required(),
  password: Joi.string().min(6).required(),
  repassword: Joi.string().min(6).required(),
});

export const valRegisEventOrganizer = Joi.object({
  email: Joi.string().email().required(),
  name: Joi.string().max(100).required(),
  password: Joi.string().min(6).required(),
  repassword: Joi.string().min(6).required(),
});

export const valLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

export const valForgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

export const valResetPassword = Joi.object({
  password: Joi.string().min(6).required(),
  repassword: Joi.string().min(6).required(),
});

export const valCreateEvent = Joi.object({
  name: Joi.string().min(3).required(),
  date_time: Joi.date().required(),
  image_id: Joi.number().required(),
  category_id: Joi.number().required(),
  eligibility_id: Joi.number().required(),
  description: Joi.string().min(3).required(),
});

export const valCreateCategory = Joi.object({
  name: Joi.string().min(3).required(),
  description: Joi.string().min(3).max(50).required(),
});

export const valCreateEligibility = Joi.object({
  name: Joi.string().min(1).required(),
  description: Joi.string().min(3).max(50).required(),
});

export const valNotifyEO = Joi.object({
  event_organizer_id: Joi.number().required(),
  report_message: Joi.string().min(6).max(255).required(),
});

export const valFeedbackMsg = Joi.object({
  feedback_message: Joi.string().min(3).max(255),
  rating_stars: Joi.number().min(1).max(5).required(),
});

export const valCreateComment = Joi.object({
  comment: Joi.string().min(1).max(255).required(),
  event_id: Joi.number().required(),
  parent_id: Joi.number(),
  mentioned_user: Joi.number(),
});

export const valUpdateComment = Joi.object({
  comment: Joi.string().min(1).max(255).required(),
  comment_id: Joi.number().required(),
  mentioned_user: Joi.number(),
});

export const valCreateEventPrecondDesc = Joi.object({
  event_id: Joi.number().required(),
  name: Joi.string().min(3).max(25).required(),
});

export const valUpdateEventPrecondDesc = Joi.object({
  id: Joi.number().required(),
  name: Joi.string().min(3).max(25).required(),
});

export const valCreateEventPrecond = Joi.object({
  image_id: Joi.number().required(),
  event_precondition_description_id: Joi.number().required(),
});

export const valUpdateEventPrecond = Joi.object({
  id: Joi.number().required(),
  image_id: Joi.number().required(),
});
