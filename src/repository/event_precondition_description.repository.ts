import { Prisma, PrismaClient } from '@prisma/client';

export class EventPreconditionDescriptionRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.findAll = this.findAll.bind(this);
    this.countAll = this.countAll.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAllWithTransaction = this.deleteAllWithTransaction.bind(this);
  }

  store(payload: any) {
    const eventPrecondDesc =
      this.prisma.eventPreconditionDescription.create(payload);
    return eventPrecondDesc;
  }

  find(condition: any) {
    const eventPrecondDesc =
      this.prisma.eventPreconditionDescription.findFirst(condition);
    return eventPrecondDesc;
  }

  findAll(condition: any) {
    const eventPrecondDescs =
      this.prisma.eventPreconditionDescription.findMany(condition);
    return eventPrecondDescs;
  }

  countAll(condition: any) {
    const eventPrecondDescs =
      this.prisma.eventPreconditionDescription.count(condition);
    return eventPrecondDescs;
  }

  update(condition: any) {
    const eventPrecondDesc =
      this.prisma.eventPreconditionDescription.update(condition);
    return eventPrecondDesc;
  }

  delete(condition: any) {
    const eventPrecondDesc =
      this.prisma.eventPreconditionDescription.delete(condition);
    return eventPrecondDesc;
  }

  deleteAllWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const eventPrecondDesc =
      tx.eventPreconditionDescription.deleteMany(condition);
    return eventPrecondDesc;
  }
}
