import {Injectable, ConflictException, HttpException} from "@nestjs/common";
import {PrismaService} from "src/prisma/prisma.service";
import * as bcrypt from "bcryptjs";
import {UserType} from "@prisma/client";
import * as jwt from "jsonwebtoken";
import {Prisma} from "@prisma/client";

interface SignupParams {
  email: string;
  password: string;
  name: string;
  phone: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly prismaService: PrismaService) {}

  async singup(
    {email, password, phone, name}: SignupParams,
    userType: UserType
  ) {
    const userExists = await this.prismaService.user.findUnique({
      where: {email}
    });

    if (userExists) {
      throw new ConflictException("User already exists");
    }

    //hash user password using bycrpt
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const user = await this.prismaService.user.create({
        data: {
          email,
          name,
          phone,
          password: hashedPassword,
          user_type: userType
        }
      });
      return this.generateJWT(user.name, user.id);
    } catch (error) {
      // if (error instanceof Prisma.PrismaClientKnownRequestError) {
      //   if (error.code === "P2002") {
      //     throw new HttpException("Phone number already exist", 400);
      //   }
      // }
      throw new HttpException("Bad Request", 400);
    }
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

  async generateProductKey(email: string, userType: UserType) {
    const key = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return await bcrypt.hash(key, 10);
  }

  async validateProductKey(
    email: string,
    userType: UserType,
    productKey: string
  ): Promise<boolean> {
    const key = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;
    return await bcrypt.compare(key, productKey);
  }
}
