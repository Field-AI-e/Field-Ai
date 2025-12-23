import {
  IsEmail,
  IsString,
  MinLength,
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  Max,
  IsEnum,
} from 'class-validator';
import { UserRole } from 'src/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsString()
  mainCrop?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  farmSizeHectares?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsBoolean()
  organicOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  voiceModeEnabled?: boolean;
}

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  farmName?: string;

  @IsOptional()
  @IsString()
  mainCrop?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  farmSizeHectares?: number;

  @IsOptional()
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @IsOptional()
  @IsString()
  locationName?: string;

  @IsOptional()
  @IsBoolean()
  organicOnly?: boolean;

  @IsOptional()
  @IsBoolean()
  voiceModeEnabled?: boolean;
}

export class UpdatePasswordDto {
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @IsString()
  @MinLength(6)
  newPassword: string;
}

export class VerifyEmailDto {
  @IsString()
  otpCode: string;
}

export class UserResponseDto {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  farmName?: string;
  mainCrop?: string;
  farmSizeHectares?: number;
  latitude?: number;
  longitude?: number;
  locationName?: string;
  organicOnly: boolean;
  voiceModeEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
