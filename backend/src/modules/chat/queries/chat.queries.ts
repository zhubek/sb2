import { ChatPolicy } from "../policies/chat.policy";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ChatType, MessageRole } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";

@Injectable()
export class ChatQueries {
  constructor(
    private prisma: PrismaService,
    private readonly access: ChatPolicy,
  ) {}

  listForUser(userId: number) {
    this.access.user(userId);
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      include: { _count: { select: { messages: true } } },
    });
  }

  async messages(chatId: number) {
    if (!(await this.prisma.chat.findFirst({ where: { id: chatId, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new NotFoundException("Чат не найден");
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { time: "asc" },
    });
  }
}
