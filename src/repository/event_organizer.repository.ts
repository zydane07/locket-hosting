import { Prisma, PrismaClient } from '@prisma/client';

export class EventOrganizerRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.storeWithTransaction = this.storeWithTransaction.bind(this);
    this.find = this.find.bind(this);
    this.findAllWithCondition = this.findAllWithCondition.bind(this);
    this.update = this.update.bind(this);
    this.updateWithTransaction = this.updateWithTransaction.bind(this);
  }

  storeWithTransaction(tx: Prisma.TransactionClient, payload: any) {
    const newEventOrganizer = tx.event_Organizer.create(payload);
    return newEventOrganizer;
  }

  find(condition: any) {
    const eventOrganizer = this.prisma.event_Organizer.findFirst(condition);
    return eventOrganizer;
  }

  findAllWithCondition(condition: any) {
    const eventOrganizers = this.prisma.event_Organizer.findMany(condition);
    return eventOrganizers;
  }

  update(payload: any) {
    const eventOrganizer = this.prisma.event_Organizer.update(payload);
    return eventOrganizer;
  }

  updateWithTransaction(tx: Prisma.TransactionClient, payload: any) {
    const eventOrganizer = tx.event_Organizer.update(payload);
    return eventOrganizer;
  }
}
