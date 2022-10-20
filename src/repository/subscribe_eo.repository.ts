import { PrismaClient } from '@prisma/client';

export class SubscribeEORepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.findAll = this.findAll.bind(this);
    this.find = this.find.bind(this);
    this.delete = this.delete.bind(this);
    this.countAll = this.countAll.bind(this);
  }

  store(payload: any) {
    const subscribe = this.prisma.subscribeEO.create(payload);
    return subscribe;
  }

  findAll(condition: any) {
    const subscriber = this.prisma.subscribeEO.findMany(condition);
    return subscriber;
  }

  find(condition: any) {
    const subscribe = this.prisma.subscribeEO.findFirst(condition);
    return subscribe;
  }

  delete(condition: any) {
    const unsubscribe = this.prisma.subscribeEO.delete(condition);
    return unsubscribe;
  }

  countAll(condition: any) {
    const countAllSubscriber = this.prisma.subscribeEO.count(condition);
    return countAllSubscriber;
  }
}
