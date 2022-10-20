import { Prisma, PrismaClient } from '@prisma/client';

export class SessionRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.update = this.update.bind(this);
  }

  store(payload: any) {
    const session = this.prisma.session.create(payload);
    return session;
  }

  find(condition: any) {
    const session = this.prisma.session.findFirst(condition);
    return session;
  }

  update(condition: any) {
    const session = this.prisma.session.update(condition);
    return session;
  }
}
