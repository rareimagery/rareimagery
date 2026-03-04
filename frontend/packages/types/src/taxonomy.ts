export interface TaxonomyTerm {
  uuid: string;
  name: string;
  vocabularyId: VocabularyId;
}

export type VocabularyId =
  | 'product_category'
  | 'design_style'
  | 'audience'
  | 'animal_type'
  | 'breed';
