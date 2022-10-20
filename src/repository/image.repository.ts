import { PrismaClient } from '@prisma/client';

export class ImageRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.findAll = this.findAll.bind(this);
  }

  store(payload: any) {
    const newImage = this.prisma.image.create(payload);
    return newImage;
  }

  find(condition: any) {
    const image = this.prisma.image.findFirst(condition);
    return image;
  }

  findAll() {
    const images = this.prisma.image.findMany();
    return images;
  }
}
