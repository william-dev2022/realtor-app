import {
  Controller,
  Get,
  Put,
  Delete,
  Post,
  Param,
  Query,
  ParseIntPipe
} from "@nestjs/common";
import {HomeService} from "./home.service";
import {HomeResponseDto} from "./dtos/home.dto";
import {PropertyType} from "@prisma/client";

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
  createHome() {
    return {};
  }

  @Put("")
  updateHome() {
    return {};
  }

  @Delete(":id")
  deleteHome() {
    return {};
  }
}
