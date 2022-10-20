import { Prisma, PrismaClient } from '@prisma/client';

export class EventCommentRepository {
  prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.store = this.store.bind(this);
    this.find = this.find.bind(this);
    this.findAllWithCondition = this.findAllWithCondition.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteWithTransaction = this.deleteWithTransaction.bind(this);
    this.deleteManyWithTransaction = this.deleteManyWithTransaction.bind(this);
  }

  store(payload: any) {
    const newComment = this.prisma.eventComment.create(payload);
    return newComment;
  }

  find(condition: any) {
    const comment = this.prisma.eventComment.findFirst(condition);
    return comment;
  }

  findAllWithCondition(condition: any) {
    const comments = this.prisma.eventComment.findMany(condition);
    return comments;
  }

  update(payload: any) {
    const updateComment = this.prisma.eventComment.update(payload);
    return updateComment;
  }

  delete(condition: any) {
    const deleteComment = this.prisma.eventComment.delete(condition);
    return deleteComment;
  }

  deleteWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const deleteComment = tx.eventComment.delete(condition);
    return deleteComment;
  }

  deleteManyWithTransaction(tx: Prisma.TransactionClient, condition: any) {
    const deleteComments = tx.eventComment.deleteMany(condition);
    return deleteComments;
  }
}
