// export class GetAllHomeDto {}

import {PropertyType} from "@prisma/client";
import {Expose, Exclude} from "class-transformer";

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
