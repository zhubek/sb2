import { Global, Module } from "@nestjs/common";
import { ActorContextService } from "./actor-context.service";
import { PasswordLogin } from "./use-cases/password-login.use-case";
import { AuthResolver } from "./graphql/auth.resolver";
@Global()
@Module({ providers: [ActorContextService, PasswordLogin, AuthResolver], exports: [ActorContextService] })
export class AuthModule {}
