import { Prisma, PrismaClient } from '@prisma/client';

export class EventPreconditionRepository {
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
    const eventPrecond = this.prisma.eventPrecondition.create(payload);
    return eventPrecond;
  }

  find(condition: any) {
    const eventPrecond = this.prisma.eventPrecondition.findFirst(condition);
    return eventPrecond;
  }

  findAll(condition: any) {
    const eventPreconds = this.prisma.eventPrecondition.findMany(condition);
    return eventPreconds;
  }

  countAll(condition: any) {
    const eventPreconds = this.prisma.eventPrecondition.count(condition);
    return eventPreconds;
  }

  update(condition: any) {
    const eventPrecond = this.prisma.eventPrecondition.update(condition);
    return eventPrecond;
  }

  delete(condition: any) {
    const eventPrecond = this.prisma.eventPrecondition.delete(condition);
    return eventPrecond;
  }

  deleteAllWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const eventPrecond = tx.eventPrecondition.deleteMany(condition);
    return eventPrecond;
  }
}
