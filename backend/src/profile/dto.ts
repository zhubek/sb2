import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from "class-validator";
import { DiplomaType, Language, UserRole } from "@prisma/client";

export class CreateUserDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsInt()
  organizationId?: number;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  surname?: string;

  @IsOptional()
  @IsString()
  grade?: string;

  @IsOptional()
  @IsEnum(Language)
  language?: Language;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsInt()
  organizationId?: number;
}

export class CreateOrganizationDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsOptional()
  @IsInt()
  cityId?: number;

  @IsOptional()
  @IsInt()
  ownerUserId?: number;
}

export class CreateRegionDto {
  @IsString()
  @MinLength(1)
  name: string;
}

export class CreateCityDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsInt()
  regionId: number;
}

export class CreateDiplomaDto {
  @IsString()
  @MinLength(1)
  name: string;

  @IsEnum(DiplomaType)
  type: DiplomaType;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class AddOrgAdminDto {
  @IsInt()
  userId: number;
}
