import { PrismaClient } from '@prisma/client';

export class EventParticipantRepository {
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
    const newEventParticipant = this.prisma.eventParticipant.create(payload);
    return newEventParticipant;
  }

  findAll(condition: any) {
    const allEventParticipants =
      this.prisma.eventParticipant.findMany(condition);
    return allEventParticipants;
  }

  find(condition: any) {
    const eventParticipant = this.prisma.eventParticipant.findFirst(condition);
    return eventParticipant;
  }

  update(condition: any) {
    const updateEventParticipant =
      this.prisma.eventParticipant.update(condition);
    return updateEventParticipant;
  }

  delete(condition: any) {
    const deleteEventParticipant =
      this.prisma.eventParticipant.delete(condition);
    return deleteEventParticipant;
  }
}
