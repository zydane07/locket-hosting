import { Application, Router } from 'express';
import multer from 'src/helper/multer';
import { RenderController } from 'src/views/render.controller';
import { UserController } from '../controller/user.controller';
import { ParticipantController } from '../controller/participant.controller';
import { EventOrganizerController } from '../controller/event_organizer.controller';
import { VerifyController } from '../controller/verify.controller';
import { AuthController } from '../controller/auth.controller';
import { SessionController } from '../controller/session.controller';
import { EventController } from '../controller/event.controller';
import { CategoryController } from '../controller/category.controller';
import { EligibilityController } from '../controller/eligibility.controller';
import { AuthMiddleware } from '../middleware/auth.middleware';
import { ImageController } from 'src/controller/image.controller';
import { EventParticipantController } from 'src/controller/event_participant.controller';
import { AdminController } from 'src/controller/admin.controller';
import { FeedbackController } from 'src/controller/feedback.controller';
import { EventCommentController } from 'src/controller/event_comment.controller';
import { SubscribeEOController } from 'src/controller/subscribe_eo.controller';
import { EventPreconditionDescriptionController } from 'src/controller/event_precondition_description.controller';
import {
  DEFAULT_ALLOWED_ROLES,
  ADMIN_ALLOWED_ROLES,
  EO_ALLOWED_ROLES,
  NON_ADMIN_ALLOWED_ROLES,
  PARTICIPANT_ALLOWED_ROLES,
} from 'src/helper/constant';
import { EventPreconditionController } from 'src/controller/event_precondition.controller';

export class Service {
  app: Application;
  routerApi: Router;
  routerRender: Router;
  authMiddleware: AuthMiddleware;
  renderController: RenderController;
  userController: UserController;
  participantController: ParticipantController;
  eventOrganizerController: EventOrganizerController;
  verifyController: VerifyController;
  authController: AuthController;
  sessionController: SessionController;
  eventController: EventController;
  categoryController: CategoryController;
  eligibilityController: EligibilityController;
  imageController: ImageController;
  eventParticipantController: EventParticipantController;
  adminController: AdminController;
  feedbackController: FeedbackController;
  eventCommentController: EventCommentController;
  subscribeEOController: SubscribeEOController;
  eventPreconditionDescriptionController: EventPreconditionDescriptionController;
  eventPreconditionController: EventPreconditionController;
  constructor(
    app: Application,
    routerApi: Router,
    routerRender: Router,
    authMiddleware: AuthMiddleware,
    renderController: RenderController,
    userController: UserController,
    participantController: ParticipantController,
    eventOrganizerController: EventOrganizerController,
    verifyController: VerifyController,
    authController: AuthController,
    sessionController: SessionController,
    eventController: EventController,
    categoryController: CategoryController,
    eligibilityController: EligibilityController,
    imageController: ImageController,
    eventParticipantController: EventParticipantController,
    adminController: AdminController,
    feedbackController: FeedbackController,
    eventCommentController: EventCommentController,
    subscribeEOController: SubscribeEOController,
    eventPreconditionDescriptionController: EventPreconditionDescriptionController,
    eventPreconditionController: EventPreconditionController,
  ) {
    this.app = app;
    this.routerApi = routerApi;
    this.routerRender = routerRender;
    this.authMiddleware = authMiddleware;
    this.renderController = renderController;
    this.userController = userController;
    this.participantController = participantController;
    this.eventOrganizerController = eventOrganizerController;
    this.verifyController = verifyController;
    this.authController = authController;
    this.sessionController = sessionController;
    this.eventController = eventController;
    this.categoryController = categoryController;
    this.eligibilityController = eligibilityController;
    this.imageController = imageController;
    this.eventParticipantController = eventParticipantController;
    this.adminController = adminController;
    this.feedbackController = feedbackController;
    this.eventCommentController = eventCommentController;
    this.subscribeEOController = subscribeEOController;
    this.eventPreconditionDescriptionController =
      eventPreconditionDescriptionController;
    this.eventPreconditionController = eventPreconditionController;
  }
  init() {
    this.app.use('/api', this.authMiddleware.apiAuth, this.api());
    this.app.use('/', this.web());
  }

  api() {
    // Authentication Route
    this.routerApi.post('/login', this.authController.login);
    this.routerApi.post('/refresh-token', this.sessionController.refreshToken);
    this.routerApi.post('/forgot-password', this.authController.forgotPassword);
    this.routerApi.post(
      '/reset-password/:token',
      this.authController.resetPassword,
    );

    // User Route
    this.routerApi.get(
      '/profile',
      this.authMiddleware.userAuth,
      this.userController.profile,
    );

    // Admin Route
    this.routerApi.get(
      '/admin/event-organizers',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.adminController.findNotVerifiedEventOrganizer,
    );
    this.routerApi.get(
      '/admin/event-organizers/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.adminController.findEventOrganizerPrecondition,
    );
    this.routerApi.put(
      '/admin/event-organizers/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.adminController.verifyEventOrganizer,
    );
    this.routerApi.put(
      '/admin/event/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.adminController.verifyEvent,
    );
    this.routerApi.get(
      '/admin/event',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.adminController.findUnverifiedEvents,
    );
    this.routerApi.post(
      '/admin/report',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.adminController.notifyEO,
    );

    // Participant Route
    this.routerApi.post(
      '/participant/register',
      this.participantController.register,
    );
    this.routerApi.get(
      '/participant/subscribed',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.participantController.findSubscribedEO,
    );

    // Event Organizer Route
    this.routerApi.post(
      '/eventorganizer/register',
      this.eventOrganizerController.register,
    );
    this.routerApi.post(
      '/eventorganizer/verify-precondition',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventOrganizerController.createPrecondition,
    );
    this.routerApi.get(
      '/eventorganizer',
      this.eventOrganizerController.findAllVerifiedEO,
    );
    this.routerApi.get(
      '/eventorganizer/:id',
      this.eventOrganizerController.findEOByID,
    );
    this.routerApi.get(
      '/eventorganizer/subscriber',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventOrganizerController.findAllSubscriber,
    );
    this.routerApi.get(
      '/eventorganizer/count/subscriber',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventOrganizerController.countAllSubscriber,
    );

    // Category Route
    // zydane
    this.routerApi.post(
      '/admin/category',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.categoryController.create,
    );
    this.routerApi.get('/category', this.categoryController.findAll);

    // Eligibility Route
    // zydane
    this.routerApi.post(
      '/admin/eligibility',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(ADMIN_ALLOWED_ROLES),
      this.eligibilityController.create,
    );
    this.routerApi.get('/eligibility', this.eligibilityController.findAll);

    // Verification Route
    this.routerApi.post(
      '/verification-participant',
      this.verifyController.verifyEmailParticipant,
    );
    this.routerApi.post(
      '/verification-eo',
      this.verifyController.verifyEmailEventOrganizer,
    );

    // Event Route
    // zydane
    this.routerApi.post(
      '/eventorganizer/event',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventController.create,
    );
    this.routerApi.get('/event', this.eventController.findAll);
    this.routerApi.get('/event/:id', this.eventController.findByID);
    this.routerApi.put(
      '/event/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventController.update,
    );
    this.routerApi.delete(
      '/event/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventController.delete,
    );

    // Image Route
    this.routerApi.post(
      '/image',
      multer.single('image'),
      this.imageController.create,
    );
    this.routerApi.get('/image', this.imageController.findAll);
    this.routerApi.get('/image/:id', this.imageController.find);

    // Event Participant Route
    // zydane
    this.routerApi.post(
      '/register-event',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventParticipantController.registerEvent,
    );

    this.routerApi.get(
      '/participant/event',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventParticipantController.findAllRegisteredEvent,
    );

    // Feedback Route
    // zydane
    this.routerApi.post(
      '/feedback',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(NON_ADMIN_ALLOWED_ROLES),
      this.feedbackController.create,
    );
    this.routerApi.get('/feedback', this.feedbackController.findAll);

    // EventComment Route
    this.routerApi.post(
      '/comment',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(DEFAULT_ALLOWED_ROLES),
      this.eventCommentController.create,
    );
    this.routerApi.get(
      '/parent/comment/:event_id',
      this.eventCommentController.findAllParentCommentsByEventID,
    );
    this.routerApi.get(
      '/child/comment/:parent_comment_id',
      this.eventCommentController.findAllChildCommentsByParentCommentID,
    );
    this.routerApi.get(
      '/comment/:comment_id',
      this.eventCommentController.findByID,
    );
    this.routerApi.put(
      '/comment/:comment_id',
      this.authMiddleware.userAuth,
      this.eventCommentController.updateComment,
    );
    this.routerApi.delete(
      '/comment/:comment_id',
      this.authMiddleware.userAuth,
      this.eventCommentController.deleteComment,
    );

    // Subscribe Route
    this.routerApi.post(
      '/subscribe',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.subscribeEOController.subscribeEO,
    );
    this.routerApi.delete(
      '/subscribe',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.subscribeEOController.unsubscribeEO,
    );

    // Event Precondition Description Route
    // zydane
    this.routerApi.post(
      '/event/precondition/description',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventPreconditionDescriptionController
        .createEventPreconditionDescription,
    );

    this.routerApi.get(
      '/event/:event_id/precondition/description',
      this.eventPreconditionDescriptionController
        .findAllEventPrecondDescByEventID,
    );

    this.routerApi.get(
      '/event/precondition/description/:id',
      this.eventPreconditionDescriptionController.findEventPrecondDescByID,
    );

    this.routerApi.put(
      '/event/precondition/description/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventPreconditionDescriptionController.updateEventPreconditionDesc,
    );

    this.routerApi.delete(
      '/event/precondition/description/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventPreconditionDescriptionController.deleteEventPreconditionDesc,
    );

    // Event Precondition Route
    // zydane
    this.routerApi.post(
      '/event/participant/precondition',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventPreconditionController.storeEventPrecondition,
    );
    this.routerApi.get(
      '/event/:event_id/participant/precondition',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventPreconditionController.findParticipantEventPreconditions,
    );
    this.routerApi.get(
      '/event/participant/precondition/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventPreconditionController.findEventPrecondByID,
    );
    this.routerApi.put(
      '/event/participant/precondition',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventPreconditionController.updateEventPrecondition,
    );
    this.routerApi.delete(
      '/event/participant/precondition/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(PARTICIPANT_ALLOWED_ROLES),
      this.eventPreconditionController.deleteEventPrecondition,
    );
    this.routerApi.get(
      '/event/:event_id/precondition',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventPreconditionController.findAllParticipantEventPrecondition,
    );
    this.routerApi.get(
      '/event/precondition/:id',
      this.authMiddleware.userAuth,
      this.authMiddleware.roleChecker(EO_ALLOWED_ROLES),
      this.eventPreconditionController.findParticipantEventPrecondByID,
    );

    return this.routerApi;
  }

  web() {
    this.routerRender.get('/', this.renderController.index);
    this.routerRender.get('/event', this.renderController.event);
    this.routerRender.get('/event/:id', this.renderController.detail_event);
    this.routerRender.get('/event-saya', this.renderController.my_event);
    this.routerRender.get('/login', this.renderController.login);
    this.routerRender.get('/lupa-pass-1', this.renderController.lupa_pass_1);
    this.routerRender.get('/lupa-pass-2', this.renderController.lupa_pass_2);
    this.routerRender.get('/buat-sandi-baru', this.renderController.new_pass_1);
    this.routerRender.get('/sandi-diubah', this.renderController.new_pass_2);
    this.routerRender.get('/register', this.renderController.register);
    this.routerRender.get(
      '/register-participant',
      this.renderController.register_participant,
    );
    this.routerRender.get(
      '/register-event-organizer',
      this.renderController.register_eo,
    );
    this.routerRender.get(
      '/register-verifikasi',
      this.renderController.register_verifikasi,
    );
    this.routerRender.get(
      '/verifikasi-ulang',
      this.renderController.verifikasi_ulang,
    );
    this.routerRender.get(
      '/verifikasi-sukses',
      this.renderController.verifikasi_sukses,
    );
    this.routerRender.get(
      '/register-participant',
      this.renderController.register_participant,
    );
    this.routerRender.get(
      '/register-event-organizer',
      this.renderController.register_eo,
    );
    this.routerRender.get(
      '/register-verifikasi',
      this.renderController.register_verifikasi,
    );
    this.routerRender.get(
      '/verifikasi-ulang',
      this.renderController.verifikasi_ulang,
    );
    this.routerRender.get(
      '/verifikasi-sukses',
      this.renderController.verifikasi_sukses,
    );
    this.routerRender.get(
      '/verifikasi/participant/:token',
      this.renderController.verifikasi,
    );
    this.routerRender.get(
      '/verifikasi/eo/:token',
      this.renderController.verifikasiEO,
    );
    this.routerRender.get(
      '/dashboard-event-organizer',
      this.renderController.dashboard_eo,
    );
    this.routerRender.get('/event-eo', this.renderController.event_eo);
    this.routerRender.get(
      '/create-event',
      this.renderController.create_event_eo,
    );
    this.routerRender.get('/edit-event', this.renderController.edit_event_eo);
    this.routerRender.get(
      '/detail-event',
      this.renderController.detail_event_eo,
    );
    this.routerRender.get('/subscribers', this.renderController.subscribers);
    this.routerRender.get('/komentar', this.renderController.komentar);
    this.routerRender.get(
      '/detail-komentar',
      this.renderController.detail_komentar,
    );
    this.routerRender.get('/pengaturan-akun', this.renderController.pengaturan);

    this.routerRender.get('/login-admin', this.renderController.login_admin);
    this.routerRender.get(
      '/dashboard-admin',
      this.renderController.dashboard_admin,
    );
    this.routerRender.get(
      '/event-manajement',
      this.renderController.event_manajement,
    );
    this.routerRender.get(
      '/detail-event-terkonfirmasi',
      this.renderController.detail_event_manajement,
    );
    this.routerRender.get(
      '/konfirmasi-event',
      this.renderController.detail_event_konfirmasi,
    );
    this.routerRender.get(
      '/daftar-participants',
      this.renderController.daftar_participants,
    );
    this.routerRender.get(
      '/daftar-event-organizer',
      this.renderController.daftar_eo,
    );

    this.routerRender.get(
      '/profile-saya',
      this.renderController.profile_participant,
    );
    this.routerRender.get('/hubungi-kami', this.renderController.hubungi_kami);
    this.routerRender.get(
      '/tentang-locket',
      this.renderController.tentang_locket,
    );
    this.routerRender.get('/semua-event', this.renderController.semua_event_eo);

    return this.routerRender;
  }
}
