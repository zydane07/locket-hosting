import { Prisma, PrismaClient } from '@prisma/client';

export class ParticipantRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.storeWithTransaction = this.storeWithTransaction.bind(this);
    this.find = this.find.bind(this);
  }

  storeWithTransaction(tx: Prisma.TransactionClient, payload: any) {
    const newParticipant = tx.participant.create(payload);
    return newParticipant;
  }

  find(condition: any) {
    const participant = this.prisma.participant.findFirst(condition);
    return participant;
  }
}
