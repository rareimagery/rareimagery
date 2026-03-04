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
}
