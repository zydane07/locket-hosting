import { Prisma, PrismaClient } from '@prisma/client';

export class EventOrganizerPreconditionRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.update = this.update.bind(this);
    this.deleteWithTransaction = this.deleteWithTransaction.bind(this);
  }

  store(payload: any) {
    const eoPrecondition =
      this.prisma.event_Organizer_Precondition.create(payload);
    return eoPrecondition;
  }

  find(condition: any) {
    const eoPrecondition =
      this.prisma.event_Organizer_Precondition.findFirst(condition);
    return eoPrecondition;
  }

  update(condition: any) {
    const eoPrecondition =
      this.prisma.event_Organizer_Precondition.update(condition);
    return eoPrecondition;
  }

  deleteWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const eoPrecondition = tx.event_Organizer_Precondition.delete(condition);
    return eoPrecondition;
  }
}
