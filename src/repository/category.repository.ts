import { PrismaClient } from '@prisma/client';

export class CategoryRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  store(payload: any) {
    const newCategory = this.prisma.category.create(payload);
    return newCategory;
  }

  find(condition: any) {
    const category = this.prisma.category.findFirst(condition);
    return category;
  }

  findAll() {
    const categories = this.prisma.category.findMany();
    return categories;
  }
}
