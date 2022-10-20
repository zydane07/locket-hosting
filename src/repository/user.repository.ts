import { Prisma, PrismaClient } from '@prisma/client';

export class UserRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.storeWithTransaction = this.storeWithTransaction.bind(this);
    this.find = this.find.bind(this);
  }

  storeWithTransaction(tx: Prisma.TransactionClient, payload: any) {
    const newUser = tx.user.create(payload);
    return newUser;
  }

  find(condition: any) {
    const user = this.prisma.user.findFirst(condition);
    return user;
  }

  updateWithTransaction(tx: Prisma.TransactionClient, payload: any) {
    const updateUser = tx.user.update(payload);
    return updateUser;
  }
}
