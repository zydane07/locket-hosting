import { PrismaClient } from '@prisma/client';

export class EligibilityRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  store(payload: any) {
    const newEligibility = this.prisma.eligibility.create(payload);
    return newEligibility;
  }

  find(condition: any) {
    const eligibility = this.prisma.eligibility.findFirst(condition);
    return eligibility;
  }

  findAll() {
    const eligibilities = this.prisma.eligibility.findMany();
    return eligibilities;
  }
}
