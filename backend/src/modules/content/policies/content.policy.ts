import { ForbiddenException, UnauthorizedException } from "@nestjs/common";
import type { Actor } from "../../auth/actor-context.service";

export function contentCapabilities(actor: Actor | null) {
  return {
    canEdit: !!actor?.contentAdmin,
    canPublish: !!actor?.contentAdmin,
    canRestore: !!actor?.contentAdmin,
  };
}
export function requireContentAdmin(
  actor: Actor | null,
): asserts actor is Actor {
  if (!actor)
    throw new UnauthorizedException("Войдите в панель администратора");
  if (!contentCapabilities(actor).canEdit)
    throw new ForbiddenException("Нет доступа к контенту");
}
export function requireAttemptOwner(
  actor: Actor | null,
): asserts actor is Actor & { ownerKey: string } {
  if (!actor?.ownerKey) throw new UnauthorizedException("Войдите в аккаунт");
}
