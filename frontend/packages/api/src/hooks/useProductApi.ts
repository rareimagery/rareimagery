import { useQuery } from '@tanstack/react-query';
import type { Product } from '@rareimagery/types';
import { drupalClient } from '../client';
import {
  buildJsonApiFilter,
  buildInclude,
  buildPagination,
  deserializeJsonApi,
} from '../jsonapi';

export interface ProductFilters {
  storeNodeId?: number;
  category?: string;
  designStyle?: string;
  audience?: string;
  animalType?: string;
  breed?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export function useProducts(
  productType: string,
  filters: ProductFilters = {},
) {
  return useQuery({
    queryKey: ['products', productType, filters],
    queryFn: async () => {
      const apiFilters: Record<string, string> = {};

      if (filters.storeNodeId) {
        apiFilters['field_store.meta.drupal_internal__nid'] =
          String(filters.storeNodeId);
      }
      if (filters.category)
        apiFilters['field_product_category.meta.drupal_internal__tid'] =
          filters.category;
      if (filters.designStyle)
        apiFilters['field_design_style.meta.drupal_internal__tid'] =
          filters.designStyle;
      if (filters.audience)
        apiFilters['field_audience.meta.drupal_internal__tid'] =
          filters.audience;
      if (filters.animalType)
        apiFilters['field_animal_type.meta.drupal_internal__tid'] =
          filters.animalType;
      if (filters.breed)
        apiFilters['field_breed.meta.drupal_internal__tid'] = filters.breed;
      apiFilters['status'] = '1';

      const params = {
        ...buildJsonApiFilter(apiFilters),
        ...buildInclude(
          'variations',
          'field_product_category',
          'field_design_style',
          'field_audience',
          'field_animal_type',
          'field_breed',
        ),
        ...buildPagination(
          ((filters.page ?? 1) - 1) * (filters.limit ?? 24),
          filters.limit ?? 24,
        ),
        'sort': '-created',
      };

      const data = await drupalClient.get<unknown>(
        `/jsonapi/commerce-product/${productType}`,
        params as Record<string, string>,
      );

      return deserializeJsonApi<Product>(
        data as Parameters<typeof deserializeJsonApi>[0],
      );
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useProduct(productType: string, uuid: string) {
  return useQuery({
    queryKey: ['product', uuid],
    queryFn: async () => {
      const params = buildInclude(
        'variations',
        'field_product_category',
        'field_design_style',
        'field_audience',
        'field_animal_type',
        'field_breed',
      );

      const data = await drupalClient.get<unknown>(
        `/jsonapi/commerce-product/${productType}/${uuid}`,
        params,
      );

      const results = deserializeJsonApi<Product>(
        data as Parameters<typeof deserializeJsonApi>[0],
      );
      return results[0] ?? null;
    },
    enabled: !!uuid,
  });
}
