import { Prisma, PrismaClient } from '@prisma/client';

export class FeedbackRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  store(payload: any) {
    const storeFeedback = this.prisma.feedback.create(payload);
    return storeFeedback;
  }

  findAll() {
    const feedbacks = this.prisma.feedback.findMany();
    return feedbacks;
  }
}
