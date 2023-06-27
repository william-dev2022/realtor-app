import {
  Injectable,
  BadRequestException,
  NotFoundException
} from "@nestjs/common";
import {PrismaService} from "src/prisma/prisma.service";
import {HomeResponseDto} from "./dtos/home.dto";
import {
  CreateHomeParams,
  GetHomesQueryFilter,
  UpdateHomeParams
} from "./types/home.types";

const homeSelectPropert = {
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
};

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}
  async getHomes(filter: GetHomesQueryFilter): Promise<HomeResponseDto[]> {
    try {
      const homes = await this.prismaService.home.findMany({
        where: filter,
        select: homeSelectPropert
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

  async getHome(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {id},
      select: homeSelectPropert
    });
    return new HomeResponseDto(home);
  }

  async createHome({
    address,
    city,
    images,
    landSize,
    numberOfBathrooms,
    numberOfBedrooms,
    propertyType
  }: CreateHomeParams) {
    const createdHome = await this.prismaService.home.create({
      data: {
        address,
        city,
        land_size: landSize,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms,
        property_type: propertyType,
        realtor_id: 1
      }
      // select: homeSelectPropert
    });

    const homeImages = images.map((image) => ({
      url: image.url,
      home_id: createdHome.id
    }));

    await this.prismaService.image.createMany({
      data: homeImages
    });

    return new HomeResponseDto(createdHome);
  }

  async updateHomeById(
    id: number,
    {
      city,
      address,
      landSize,
      numberOfBathrooms,
      propertyType,
      numberOfBedrooms
    }: UpdateHomeParams
  ) {
    const homeExists = await this.prismaService.home.findUnique({where: {id}});
    if (!homeExists) return new NotFoundException();

    // return body;
    const updatedHome = await this.prismaService.home.update({
      where: {id: id},
      data: {
        city,
        address,
        land_size: landSize,
        property_type: propertyType,
        number_of_bathrooms: numberOfBathrooms,
        number_of_bedrooms: numberOfBedrooms
      }
    });
    return new HomeResponseDto(updatedHome);
  }

  async deleteHomeById(id: number) {
    const homeExists = await this.prismaService.home.findUnique({where: {id}});

    if (!homeExists) return new NotFoundException();
    await this.prismaService.image.deleteMany({where: {home_id: id}});
    await this.prismaService.home.delete({where: {id}});

    return;
  }
}
