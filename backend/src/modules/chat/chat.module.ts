import { ChatPolicy } from "./policies/chat.policy";
import { Module } from "@nestjs/common";
import { ChatQueries } from "./queries/chat.queries";
import { ChatUseCases } from "./use-cases/chat.use-cases";

@Module({
  providers: [ChatPolicy, ChatQueries, ChatUseCases],
  exports: [ChatQueries, ChatUseCases],
})
export class ChatModule {}
