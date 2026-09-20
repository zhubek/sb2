import { ChatPolicy } from "../policies/chat.policy";
import { Injectable, NotFoundException } from "@nestjs/common";
import { ChatType, MessageRole } from "../../../../generated/prisma";
import { PrismaService } from "../../../platform/database/prisma.service";

@Injectable()
export class ChatUseCases {
  constructor(
    private prisma: PrismaService,
    private readonly access: ChatPolicy,
  ) {}

  create(userId: number, chatType: ChatType, name?: string) {
    this.access.user(userId);
    return this.prisma.chat.create({ data: { userId, chatType, name } });
  }

  async postMessage(chatId: number, text: string) {
    if (!(await this.prisma.chat.findFirst({ where: { id: chatId, ...this.access.ownedScope() }, select: { id: true } }))) throw new NotFoundException("Запись не найдена");
    const chat = await this.prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) throw new NotFoundException("Чат не найден");

    return this.prisma.$transaction(async (tx) => {
      const userMessage = await tx.message.create({
        data: { chatId, text, role: MessageRole.USER },
      });

      // Прод: здесь вызов LLM (Claude API) с контекстом профиля и результатов
      // тестов ученика. Пока — канонический демо-ответ, чтобы контракт
      // с фронтендом работал end-to-end.
      const assistantMessage = await tx.message.create({
        data: {
          chatId,
          role: MessageRole.ASSISTANT,
          text: "Отличный вопрос! Судя по результатам ваших тестов, у вас яркий креативно-коммуникативный профиль: DeBruce показал топ-навыки «Креативность», «Коммуникация» и «Эмпатия», а тип ENFJ это только подтверждает. Вам подойдут профессии, где нужно придумывать и рассказывать: PR-менеджер, журналист, бренд-стратег, продюсер медиапроектов. Рекомендую начать с направления «Журналистика и информация» и программы «Реклама и связи с общественностью» — её ведут КазНУ, ЕНУ и Туран, причём в двух из них есть гранты и общежития. Хотите, покажу эти вузы в навигаторе с уже настроенными фильтрами? А ещё могу объяснить, почему именно эти навыки так ценятся в медиа-индустрии.",
        },
      });

      return { userMessage, assistantMessage };
    });
  }
}
