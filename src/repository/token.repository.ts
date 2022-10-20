import { Prisma, PrismaClient } from '@prisma/client';

export class TokenRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.deleteWithTransaction = this.deleteWithTransaction.bind(this);
  }

  store(payload: any) {
    const token = this.prisma.token.create(payload);
    return token;
  }

  find(condition: any) {
    const token = this.prisma.token.findFirst(condition);
    return token;
  }

  deleteWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const token = tx.token.delete(condition);
    return token;
  }
}
