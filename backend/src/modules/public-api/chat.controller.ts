import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { ChatType } from "../../../generated/prisma";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ChatQueries } from "../chat/queries/chat.queries";
import { ChatUseCases } from "../chat/use-cases/chat.use-cases";

class CreateChatDto {
  @IsInt()
  @Type(() => Number)
  userId: number;

  @IsEnum(ChatType)
  chatType: ChatType;

  @IsOptional()
  @IsString()
  name?: string;
}

class PostMessageDto {
  @IsString()
  @MinLength(1)
  text: string;
}

@ApiTags("chat")
@Controller("chats")
export class ChatController {
  constructor(
    private chatQueries: ChatQueries,
    private chatUseCases: ChatUseCases,
  ) {}

  @Post()
  create(@Body() dto: CreateChatDto) {
    return this.chatUseCases.create(dto.userId, dto.chatType, dto.name);
  }

  @Get()
  list(@Query("userId", ParseIntPipe) userId: number) {
    return this.chatQueries.listForUser(userId);
  }

  @Get(":id/messages")
  messages(@Param("id", ParseIntPipe) id: number) {
    return this.chatQueries.messages(id);
  }

  @Post(":id/messages")
  postMessage(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: PostMessageDto,
  ) {
    return this.chatUseCases.postMessage(id, dto.text);
  }
}
