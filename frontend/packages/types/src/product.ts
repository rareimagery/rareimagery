import type { TaxonomyTerm } from './taxonomy';

export type ProductType = 'physical_pod' | 'physical_custom' | 'digital_download';
export type VariationType = 'pod_variation' | 'custom_variation' | 'digital_variation';

export interface Price {
  number: string;
  currencyCode: string;
}

export interface ProductVariation {
  uuid: string;
  type: VariationType;
  sku: string;
  price: Price;
  status: boolean;
  attributes: {
    size?: string;
    color?: string;
    material?: string;
  };
  printfulVariantId?: string;
  fileUrl?: string;
}

export interface Product {
  uuid: string;
  title: string;
  type: ProductType;
  status: boolean;
  storeNodeId: number;
  printfulProductId?: string;
  categories: TaxonomyTerm[];
  designStyles: TaxonomyTerm[];
  audiences: TaxonomyTerm[];
  animalTypes: TaxonomyTerm[];
  breeds: TaxonomyTerm[];
  variations: ProductVariation[];
  imageUrl?: string;
  createdAt: string;
}
