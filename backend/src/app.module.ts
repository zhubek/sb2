import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { TestsModule } from "./tests/tests.module";
import { ProfileModule } from "./profile/profile.module";
import { NavigatorModule } from "./navigator/navigator.module";
import { ChatModule } from "./chat/chat.module";
import { CourseModule } from "./course/course.module";
import { AchievementsModule } from "./achievements/achievements.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    TestsModule,
    ProfileModule,
    NavigatorModule,
    ChatModule,
    CourseModule,
    AchievementsModule,
  ],
})
export class AppModule {}
