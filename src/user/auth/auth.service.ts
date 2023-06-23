import {Injectable, ConflictException, HttpException} from "@nestjs/common";
import {PrismaService} from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import {UserType} from "@prisma/client";
import * as jwt from "jsonwebtoken";

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async singup({email, password, phone, name}: SignupParams) {
    const userExists = await this.prismaService.user.findUnique({
      where: {email}
    });

    if (userExists) {
      throw new ConflictException("User already exists");
    }

    //hash user password using bycrpt
    const hashedPassword = await bcrypt.hash(password, 10);

    //create a new user
    const user = await this.prismaService.user.create({
      data: {
        email,
        name,
        phone,
        password: hashedPassword,
        user_type: UserType.BUYER
      }
    });

    //generate user token
    return this.generateJWT(user.name, user.id);
  }

  async signin({email, password}: {email: string; password: string}) {
    //check if the email exists
    const user = await this.prismaService.user.findUnique({
      where: {email}
    });

    if (!user) {
      // throw new NotFoundException("User not found");
      throw new HttpException("Invalid credentials", 400);
    }

    //check if the provided password matches the hashed password
    const hashedPassword = user.password;
    const isValidPassword = await bcrypt.compare(password, hashedPassword);

    if (isValidPassword) {
      return this.generateJWT(user.name, user.id);
    }
    throw new HttpException("Invalid credentials", 400);
  }

  private generateJWT(name: string, id: number) {
    const userToken = jwt.sign(
      {
        id,
        name
      },
      process.env.JSON_TOKEN_KEY,
      {expiresIn: 36000}
    );
    return userToken;
  }
}
