import { Injectable, NotFoundException } from "@nestjs/common";
import { ChatType, MessageRole } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  create(userId: number, chatType: ChatType, name?: string) {
    return this.prisma.chat.create({ data: { userId, chatType, name } });
  }

  listForUser(userId: number) {
    return this.prisma.chat.findMany({
      where: { userId },
      orderBy: { startTime: "desc" },
      include: { _count: { select: { messages: true } } },
    });
  }

  async messages(chatId: number) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new NotFoundException("Чат не найден");
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { time: "asc" },
    });
  }

  async postMessage(chatId: number, text: string) {
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new NotFoundException("Чат не найден");

    const userMessage = await this.prisma.message.create({
      data: { chatId, text, role: MessageRole.USER },
    });

    // Прод: здесь вызов LLM (Claude API) с контекстом профиля и результатов
    // тестов ученика. Пока — заглушка, чтобы контракт с фронтендом работал.
    const assistantMessage = await this.prisma.message.create({
      data: {
        chatId,
        role: MessageRole.ASSISTANT,
        text: "Спасибо за вопрос! AI-ответы подключаются на следующем этапе — здесь появится ответ профориентатора.",
      },
    });

    return { userMessage, assistantMessage };
  }
}
