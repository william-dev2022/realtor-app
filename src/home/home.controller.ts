import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Query,
  ParseIntPipe,
  Body
} from "@nestjs/common";
import {HomeService} from "./home.service";
import {CreateHomeDto, HomeResponseDto, UpdateHomeDto} from "./dtos/home.dto";
import {PropertyType} from "@prisma/client";
import {AuthUser, User} from "src/user/decorators/user.decorator";

@Controller("home")
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get("")
  async getHomes(
    @Query("city") city?: string,
    @Query("propertyType") propertyType?: PropertyType,
    @Query("minPrice") minPrice?: string,
    @Query("maxPrice") maxPrice?: string
  ): Promise<HomeResponseDto[]> {
    const price =
      minPrice || maxPrice
        ? {
            gte: minPrice ? parseInt(minPrice) : undefined,
            lte: maxPrice ? parseInt(maxPrice) : undefined
          }
        : undefined;
    const filter = {
      ...(city && {city}),
      ...(propertyType && {property_type: propertyType}),
      ...(price && {price})
    };
    return await this.homeService.getHomes(filter);
  }

  @Get(":id")
  getHome(@Param("id", new ParseIntPipe()) id: number) {
    return this.homeService.getHome(id);
  }

  @Post("")
  createHome(@Body() body: CreateHomeDto, @User() user: AuthUser) {
    return user;
    return this.homeService.createHome(body);
  }

  @Put(":id")
  updateHome(@Param("id") id: number, @Body() body: UpdateHomeDto) {
    return this.homeService.updateHomeById(id, body);
  }

  @Delete(":id")
  deleteHome(@Param("id") id: number, @User() user) {
    return user;
    return this.homeService.deleteHomeById(id);
  }
}
