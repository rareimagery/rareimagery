import { useTaxonomyTerms } from '@rareimagery/api';
import type { VocabularyId } from '@rareimagery/types';
import { LoadingSpinner } from '@rareimagery/ui';

const FILTER_VOCABULARIES: { id: VocabularyId; label: string }[] = [
  { id: 'product_category', label: 'Category' },
  { id: 'design_style', label: 'Style' },
  { id: 'audience', label: 'Audience' },
  { id: 'animal_type', label: 'Animal' },
  { id: 'breed', label: 'Breed' },
];

export function ProductFilters() {
  return (
    <div className="xstore__filters">
      {FILTER_VOCABULARIES.map((vocab) => (
        <FilterGroup key={vocab.id} vocabularyId={vocab.id} label={vocab.label} />
      ))}
    </div>
  );
}

function FilterGroup({
  vocabularyId,
  label,
}: {
  vocabularyId: VocabularyId;
  label: string;
}) {
  const { data: terms, isLoading } = useTaxonomyTerms(vocabularyId);

  if (isLoading) return <LoadingSpinner size={20} />;
  if (!terms || terms.length === 0) return null;

  return (
    <div className="xstore__facet">
      <h3 className="xstore__facet-title">{label}</h3>
      <ul className="xstore__facet-list">
        {terms.map((term) => (
          <li key={term.uuid} className="xstore__facet-item">
            <label>
              <input type="checkbox" value={term.uuid} />
              <span>{term.name}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}
