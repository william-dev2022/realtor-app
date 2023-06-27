import {PropertyType} from "@prisma/client";

export interface GetHomesQueryFilter {
  property_type?: PropertyType;
  city?: string;
  price?: {
    lte?: number;
    gte?: number;
  };
}

export interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  landSize: number;
  propertyType: PropertyType;
  images: {url: string}[];
}

export interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  landSize?: number;
  propertyType?: PropertyType;
}
