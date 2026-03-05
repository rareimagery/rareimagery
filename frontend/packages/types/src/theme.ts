export interface CreatorTheme {
  uuid: string;
  themeNodeId: number;
  // Background
  bgColor: string | null;
  bgImageUrl: string | null;
  bgRepeat: 'tile' | 'cover' | 'contain' | 'fixed-scroll' | null;
  bgOverlayColor: string | null;
  bgOverlayOpacity: number | null;
  bgAnimation: 'none' | 'slow-scroll' | 'pulse' | 'shimmer' | null;
  // Music
  musicUrl: string | null;
  musicAutoplay: boolean;
  musicLoop: boolean;
  musicVolume: number;
  musicTrackTitle: string | null;
  musicArtist: string | null;
  musicPlayerPosition: 'top-bar' | 'sidebar' | 'floating' | 'hidden';
  // Typography
  fontHeading: string | null;
  fontBody: string | null;
  fontAccent: string | null;
  fontSizeScale: number;
  // Colors
  colorPrimary: string | null;
  colorSecondary: string | null;
  colorText: string | null;
  colorLink: string | null;
  colorLinkHover: string | null;
  colorAccent: string | null;
  colorScrollbarThumb: string | null;
  colorScrollbarTrack: string | null;
  // Layout
  layoutBlocks: LayoutBlock[];
  aboutMeHtml: string | null;
  // Social
  socialInstagram: string | null;
  socialYoutube: string | null;
  socialTiktok: string | null;
  socialFacebook: string | null;
  socialDiscord: string | null;
  socialWebsite: string | null;
  socialLinks: SocialLink[];
  // Meta
  themeName: string | null;
  themePublished: boolean;
}

export interface LayoutBlock {
  id: string;
  enabled: boolean;
  order: number;
}

export interface SocialLink {
  title: string;
  url: string;
}
