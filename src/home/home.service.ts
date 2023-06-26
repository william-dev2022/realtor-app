import {Injectable, BadRequestException} from "@nestjs/common";
import {PrismaService} from "src/prisma/prisma.service";
import {HomeResponseDto} from "./dtos/home.dto";
import {PropertyType} from "@prisma/client";

interface GetHomesQueryFilter {
  property_type?: PropertyType;
  city?: string;
  price?: {
    lte?: number;
    gte?: number;
  };
}
@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filter: GetHomesQueryFilter): Promise<HomeResponseDto[]> {
    try {
      const homes = await this.prismaService.home.findMany({
        where: filter,
        select: {
          id: true,
          address: true,
          city: true,
          number_of_bathrooms: true,
          number_of_bedrooms: true,
          property_type: true,
          images: {
            select: {
              url: true
            },
            take: 1
          },
          land_size: true,
          listed_data: true,
          realtor: {
            select: {
              name: true,
              email: true,
              phone: true
            }
          }
        }
      });
      return homes.map((home) => {
        const imageThumbnail = home.images[0]?.url;
        delete home.images;
        return new HomeResponseDto({...home, imageThumbnail: imageThumbnail});
      });
    } catch (error) {
      throw new BadRequestException();
    }
  }

  getHome(id: number) {
    const home = this.prismaService.home.findUnique({where: {id}});
    return home;
  }
}
