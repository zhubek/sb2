import { Module } from "@nestjs/common";
import { TestsModule } from "../tests/tests.module";
import { ProfileModule } from "../profile/profile.module";
import { NavigatorModule } from "../navigator/navigator.module";
import { ChatModule } from "../chat/chat.module";
import { CourseModule } from "../course/course.module";
import { AchievementsModule } from "../achievements/achievements.module";
import { TestsController } from "./tests.controller";
import { ProfileController } from "./profile.controller";
import { NavigatorController } from "./navigator.controller";
import { ChatController } from "./chat.controller";
import { CourseController } from "./course.controller";
import { AchievementsController } from "./achievements.controller";

// Compatibility adapters for the existing application URLs.
@Module({
  imports: [
    TestsModule,
    ProfileModule,
    NavigatorModule,
    ChatModule,
    CourseModule,
    AchievementsModule,
  ],
  controllers: [
    TestsController,
    ProfileController,
    NavigatorController,
    ChatController,
    CourseController,
    AchievementsController,
  ],
})
export class PublicApiModule {}
