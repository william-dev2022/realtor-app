import {Controller, Post, Body} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {SingupDto, signinDto} from "../dtos/auth.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/signup")
  singUp(@Body() body: SingupDto) {
    return this.authService.singup(body);
  }

  @Post("/signin")
  signin(@Body() body: signinDto) {
    return this.authService.signin(body);
  }
}
