import {
  IsString,
  IsNotEmpty,
  IsEmail,
  MinLength,
  Matches
} from "class-validator";

export class SingupDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @Matches(/^(\+\d{1,2}\s?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: "phone must be a valid phone number"
  })
  phone: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class signinDto {
  @IsEmail()
  email: string;
  @IsString()
  password: string;
}