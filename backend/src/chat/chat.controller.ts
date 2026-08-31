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
import { ChatType } from "@prisma/client";
import { Type } from "class-transformer";
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { ChatService } from "./chat.service";

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
  constructor(private chat: ChatService) {}

  @Post()
  create(@Body() dto: CreateChatDto) {
    return this.chat.create(dto.userId, dto.chatType, dto.name);
  }

  @Get()
  list(@Query("userId", ParseIntPipe) userId: number) {
    return this.chat.listForUser(userId);
  }

  @Get(":id/messages")
  messages(@Param("id", ParseIntPipe) id: number) {
    return this.chat.messages(id);
  }

  @Post(":id/messages")
  postMessage(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: PostMessageDto
  ) {
    return this.chat.postMessage(id, dto.text);
  }
}
