import { UnauthorizedException } from "@nestjs/common";
import type { Actor } from "./actor-context.service";

export function requireActor(actor: Actor | null): Actor {
  if (!actor) throw new UnauthorizedException("Войдите в аккаунт");
  return actor;
}
