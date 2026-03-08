export { drupalClient } from './client';
export { buildJsonApiFilter, deserializeJsonApi, buildInclude } from './jsonapi';
export { useStoreProfile, useStores } from './hooks/useStoreApi';
export type { StoreProfileResponse, StoreSummary } from './hooks/useStoreApi';
export { useProducts, useProduct } from './hooks/useProductApi';
export { useCarts, useAddToCart, useUpdateCartItem, useRemoveCartItem } from './hooks/useCartApi';
export { useOrders, useOrder } from './hooks/useOrderApi';
export { useTaxonomyTerms } from './hooks/useTaxonomyApi';

export { useXProfilePreview, useCreateStore } from './hooks/useStoreCreateApi';
export {
  useSubscriptionCheckout,
  useSubscriptionPortal,
  useSubscriptionStatus,
} from './hooks/useSubscriptionApi';
export type {
  SubscriptionCheckoutResponse,
  SubscriptionPortalResponse,
  SubscriptionStatusResponse,
} from './hooks/useSubscriptionApi';

export { useXProfile, useXPosts, useGenerateStoreContent, useGenerateProductDescription } from './hooks/useXaiApi';

// Server-side exports (for Next.js server components)
export { DrupalServerClient } from './server-client';
export { fetchStores, fetchStoreProfile } from './fetchers';
