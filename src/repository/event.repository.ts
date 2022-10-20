import { Prisma, PrismaClient } from '@prisma/client';

export class EventRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.findAll = this.findAll.bind(this);
    this.find = this.find.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

  store(payload: any) {
    const newEvent = this.prisma.event.create(payload);
    return newEvent;
  }

  findAll(condition: any) {
    const allEvents = this.prisma.event.findMany(condition);
    return allEvents;
  }

  find(condition: any) {
    const event = this.prisma.event.findFirst(condition);
    return event;
  }

  update(condition: any) {
    const updateEvent = this.prisma.event.update(condition);
    return updateEvent;
  }

  delete(condition: any) {
    const deleteEvent = this.prisma.event.delete(condition);
    return deleteEvent;
  }

  deleteWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const deleteEvent = tx.event.delete(condition);
    return deleteEvent;
  }
}
