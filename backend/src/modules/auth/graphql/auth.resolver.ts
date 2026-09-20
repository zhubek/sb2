import { Args, Field, InputType, Int, Mutation, ObjectType, Resolver } from "@nestjs/graphql";
import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";
import { PasswordLogin } from "../use-cases/password-login.use-case";
@InputType()
class PasswordLoginInput {
  @Field() @IsEmail() @MaxLength(254) email: string;
  @Field() @IsString() @MinLength(1) @MaxLength(256) password: string;
}
@ObjectType()
class LoginIdentity {
  @Field(() => Int) id: number;
  @Field() email: string;
  @Field() name: string;
  @Field() role: string;
  @Field() contentAdmin: boolean;
  @Field(() => Int) credentialVersion: number;
}
@Resolver()
export class AuthResolver {
  constructor(private readonly login: PasswordLogin) {}
  @Mutation(() => LoginIdentity)
  passwordLogin(@Args("input") input: PasswordLoginInput) {
    return this.login.execute(input.email, input.password);
  }
}
