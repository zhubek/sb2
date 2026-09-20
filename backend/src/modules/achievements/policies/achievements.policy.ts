import { ForbiddenException, Injectable } from "@nestjs/common";
import { ActorContextService } from "../../auth/actor-context.service";
import { requireActor } from "../../auth/require-actor";

// This feature owns its access rules. Content-editor grants do not grant access here.
@Injectable()
export class AchievementsPolicy {
  constructor(private readonly actors: ActorContextService) {}
  actor() { return requireActor(this.actors.current()); }
  user(userId: number) {
    const actor = this.actor();
    if (actor.role !== "ADMIN" && actor.userId !== userId)
      throw new ForbiddenException("Нет доступа к пользователю");
  }
  ownedScope(): { userId?: number } {
    const actor = this.actor();
    return actor.role === "ADMIN" ? {} : { userId: actor.userId ?? -1 };
  }

  admin() {
    if (this.actor().role !== "ADMIN") throw new ForbiddenException("Нет доступа");
  }
  organization(id: number) {
    const actor = this.actor();
    if (actor.role !== "ADMIN" && (actor.role !== "TEACHER" || actor.organizationId !== id))
      throw new ForbiddenException("Нет доступа к организации");
  }
}
