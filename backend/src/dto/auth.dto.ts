import { IsEmail, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class CreateAdminDto extends LoginDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsString()
  @MinLength(2)
  bankName: string;
}
