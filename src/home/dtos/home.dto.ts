// export class GetAllHomeDto {}

import {PropertyType} from "@prisma/client";
import {Expose, Exclude, Type} from "class-transformer";
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested
} from "class-validator";

export class HomeResponseDto {
  constructor(partials: Partial<HomeResponseDto>) {
    Object.assign(this, partials);
  }

  id: number;

  address: string;

  @Exclude()
  number_of_bedrooms: number;

  @Expose({name: "numberOfBedrooms"})
  numberOfBedrooms = () => this.number_of_bedrooms;

  @Exclude()
  number_of_bathrooms: number;

  @Expose({name: "numberOfBathrooms"})
  numberOfBathrooms = () => this.number_of_bathrooms;

  @Exclude()
  listed_data: Date;

  @Expose({name: "listedDate"})
  listedDate = () => this.listed_data;

  @Exclude()
  land_size: number;

  @Expose({name: "landSize"})
  landSize = () => this.land_size;

  @Exclude()
  property_type: PropertyType;

  @Expose({name: "propertyType"})
  propertyType = () => this.property_type;

  imageThumbnail: string;

  city: string;
  @Exclude()
  created_at: Date;
  @Exclude()
  updated_at: Date;
  @Exclude()
  realtor_id: number;
}

export class HomePropertUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedroom: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathroom: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  city: string;
}

class Image {
  @IsString()
  @IsNotEmpty()
  url: string;
}
export class CreateHomeDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsPositive()
  numberOfBedrooms: number;

  @IsNumber()
  @IsPositive()
  numberOfBathrooms: number;

  @IsString()
  @IsNotEmpty()
  city: string;

  @IsNumber()
  @IsPositive()
  landSize: number;

  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @IsArray()
  @ValidateNested({each: true})
  @Type(() => Image)
  images: Image[];
}

export class UpdateHomeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBedrooms?: number;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  numberOfBathrooms?: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @IsNumber()
  @IsPositive()
  landSize?: number;

  @IsOptional()
  @IsEnum(PropertyType)
  propertyType?: PropertyType;
}
