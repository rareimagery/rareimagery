export interface CreatorStore {
  nodeId: number;
  uuid: string;
  handle: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  logoUrl: string;
  about: string;
  followers: number;
  verified: boolean;
  brandColor: string;
  tagline: string;
  commerceStoreId: number;
  commerceStoreUuid: string;
  stripeAccountId?: string;
  printfulStoreId?: string;
  subscriptionStatus?: 'pending' | 'active' | 'past_due' | 'canceled' | null;
  stripeCustomerId?: string;
}

export interface XProfilePreview {
  handle: string;
  displayName: string;
  bio: string;
  avatarUrl: string;
  bannerUrl: string;
  followers: number;
  verified: boolean;
  handleTaken: boolean;
  error: string | null;
}

export interface StoreCreateRequest {
  handle: string;
  bio?: string;
  tagline?: string;
  brandColor?: string;
  about?: string;
}

export type StoreCreateResponse = CreatorStore;
