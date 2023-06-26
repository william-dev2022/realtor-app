import {
  Controller,
  Post,
  Body,
  Param,
  ParseEnumPipe,
  UnauthorizedException
} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {SingupDto, SigninDto, GenerateProductKeyDto} from "../dtos/auth.dto";
import {UserType} from "@prisma/client";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup/:userType")
  async singUp(
    @Body() body: SingupDto,
    @Param("userType", new ParseEnumPipe(UserType)) userType: UserType
  ) {
    if (userType != UserType.BUYER) {
      if (!body.productKey) {
        throw new UnauthorizedException("Product key is required");
      }
      const isValidProductKey = await this.authService.validateProductKey(
        body.email,
        userType,
        body.productKey
      );

      if (!isValidProductKey) {
        throw new UnauthorizedException();
      }
    }

    return this.authService.singup(body, userType);
  }

  @Post("/signin")
  signin(@Body() body: SigninDto) {
    return this.authService.signin(body);
  }

  @Post("/key")
  generateProductKey(@Body() {email, userType}: GenerateProductKeyDto) {
    return this.authService.generateProductKey(email, userType);
  }
}
