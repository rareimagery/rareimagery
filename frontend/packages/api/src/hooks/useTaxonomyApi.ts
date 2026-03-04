import { useQuery } from '@tanstack/react-query';
import type { TaxonomyTerm, VocabularyId } from '@rareimagery/types';
import { drupalClient } from '../client';
import { deserializeJsonApi } from '../jsonapi';

export function useTaxonomyTerms(vocabulary: VocabularyId) {
  return useQuery({
    queryKey: ['taxonomy', vocabulary],
    queryFn: async () => {
      const data = await drupalClient.get<unknown>(
        `/jsonapi/taxonomy-term/${vocabulary}`,
        { sort: 'name' },
      );

      return deserializeJsonApi<TaxonomyTerm>(
        data as Parameters<typeof deserializeJsonApi>[0],
      );
    },
    staleTime: 10 * 60 * 1000,
  });
}
