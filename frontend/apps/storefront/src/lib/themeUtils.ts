import type { CreatorTheme } from '@rareimagery/types';

/** Applies opacity to a hex color, returning an rgba string. */
function mixColor(hex: string, opacity: number): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

/**
 * Builds a CSS custom properties string from theme data.
 */
export function buildCSSVars(theme: CreatorTheme, handle: string): string {
  const vars: Record<string, string> = {};

  // Colors
  if (theme.colorPrimary) vars['--bg-primary'] = theme.colorPrimary;
  if (theme.colorSecondary) {
    vars['--bg-secondary'] = theme.colorSecondary;
    vars['--border-color'] = theme.colorSecondary;
  }
  if (theme.colorText) {
    vars['--text-primary'] = theme.colorText;
    vars['--text-secondary'] = mixColor(theme.colorText, 0.7);
    vars['--text-muted'] = mixColor(theme.colorText, 0.5);
  }
  if (theme.colorLink) vars['--color-link'] = theme.colorLink;
  if (theme.colorLinkHover) vars['--color-link-hover'] = theme.colorLinkHover;
  if (theme.colorAccent) {
    vars['--brand-color'] = theme.colorAccent;
    vars['--color-accent'] = theme.colorAccent;
  }
  if (theme.colorScrollbarThumb) vars['--scrollbar-thumb'] = theme.colorScrollbarThumb;
  if (theme.colorScrollbarTrack) vars['--scrollbar-track'] = theme.colorScrollbarTrack;

  // Typography
  if (theme.fontHeading) vars['--font-heading'] = `'${theme.fontHeading}', sans-serif`;
  if (theme.fontBody) vars['--font-body'] = `'${theme.fontBody}', sans-serif`;
  if (theme.fontAccent) vars['--font-accent'] = `'${theme.fontAccent}', monospace`;
  if (theme.fontSizeScale && theme.fontSizeScale !== 1.0) {
    vars['--font-size-scale'] = String(theme.fontSizeScale);
  }

  // Background
  if (theme.bgColor) vars['--page-bg'] = theme.bgColor;

  const lines = Object.entries(vars)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');

  return `.creator-page--${handle} {\n${lines}\n}`;
}

/**
 * Builds background CSS for the creator page.
 */
export function buildBackgroundCSS(theme: CreatorTheme, handle: string): string {
  const rules: string[] = [];

  if (theme.bgColor) {
    rules.push(`background-color: ${theme.bgColor};`);
  }

  if (theme.bgImageUrl) {
    rules.push(`background-image: url('${theme.bgImageUrl}');`);

    switch (theme.bgRepeat) {
      case 'tile':
        rules.push('background-repeat: repeat;');
        rules.push('background-size: auto;');
        break;
      case 'cover':
        rules.push('background-repeat: no-repeat;');
        rules.push('background-size: cover;');
        rules.push('background-position: center;');
        rules.push('background-attachment: fixed;');
        break;
      case 'contain':
        rules.push('background-repeat: no-repeat;');
        rules.push('background-size: contain;');
        rules.push('background-position: center;');
        break;
      case 'fixed-scroll':
        rules.push('background-repeat: no-repeat;');
        rules.push('background-size: cover;');
        rules.push('background-position: center;');
        rules.push('background-attachment: fixed;');
        break;
    }
  }

  if (!rules.length) return '';
  return `.creator-page--${handle} {\n  ${rules.join('\n  ')}\n}`;
}

/**
 * Builds background animation CSS.
 */
export function buildAnimationCSS(theme: CreatorTheme, handle: string): string {
  if (!theme.bgAnimation || theme.bgAnimation === 'none') return '';

  const selector = `.creator-page--${handle}`;

  switch (theme.bgAnimation) {
    case 'slow-scroll':
      return `
${selector} {
  animation: bg-scroll 30s linear infinite;
}
@keyframes bg-scroll {
  from { background-position: 0 0; }
  to { background-position: 0 100%; }
}`;
    case 'pulse':
      return `
${selector} {
  animation: bg-pulse 4s ease-in-out infinite;
}
@keyframes bg-pulse {
  0%, 100% { filter: brightness(1); }
  50% { filter: brightness(1.15); }
}`;
    case 'shimmer':
      return `
${selector}::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    110deg,
    transparent 30%,
    rgba(255, 255, 255, 0.06) 50%,
    transparent 70%
  );
  animation: bg-shimmer 3s ease-in-out infinite;
  pointer-events: none;
  z-index: 0;
}
@keyframes bg-shimmer {
  from { transform: translateX(-100%); }
  to { transform: translateX(100%); }
}`;
    default:
      return '';
  }
}

/**
 * Builds background overlay CSS.
 */
export function buildOverlayCSS(theme: CreatorTheme, handle: string): string {
  if (!theme.bgOverlayColor || theme.bgOverlayOpacity === null) return '';

  const opacity = Math.max(0, Math.min(1, theme.bgOverlayOpacity));
  const hex = theme.bgOverlayColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `
.creator-page--${handle}::after {
  content: '';
  position: fixed;
  inset: 0;
  background: rgba(${r}, ${g}, ${b}, ${opacity});
  pointer-events: none;
  z-index: 0;
}
.creator-page--${handle} > * {
  position: relative;
  z-index: 1;
}`;
}

/**
 * Builds scrollbar CSS.
 */
export function buildScrollbarCSS(theme: CreatorTheme, handle: string): string {
  if (!theme.colorScrollbarThumb && !theme.colorScrollbarTrack) return '';

  const thumb = theme.colorScrollbarThumb || '#888';
  const track = theme.colorScrollbarTrack || '#1a1a1a';

  return `
.creator-page--${handle} {
  scrollbar-color: ${thumb} ${track};
}
.creator-page--${handle}::-webkit-scrollbar {
  width: 10px;
}
.creator-page--${handle}::-webkit-scrollbar-track {
  background: ${track};
}
.creator-page--${handle}::-webkit-scrollbar-thumb {
  background: ${thumb};
  border-radius: 5px;
}`;
}

/**
 * Dynamically loads Google Fonts.
 */
export function loadGoogleFonts(fonts: (string | null)[]): void {
  const validFonts = fonts.filter((f): f is string => !!f && f.trim() !== '');
  if (validFonts.length === 0) return;

  const families = validFonts
    .map((f) => `family=${f.replace(/\s+/g, '+')}:wght@400;700`)
    .join('&');

  const linkId = 'creator-google-fonts';
  const existing = document.getElementById(linkId);
  if (existing) existing.remove();

  const link = document.createElement('link');
  link.id = linkId;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?${families}&display=swap`;
  document.head.appendChild(link);
}

/**
 * Injects a style tag with the given CSS content.
 */
export function injectStyleTag(id: string, css: string): void {
  if (!css) return;
  const existing = document.getElementById(id);
  if (existing) existing.remove();

  const style = document.createElement('style');
  style.id = id;
  style.textContent = css;
  document.head.appendChild(style);
}

/**
 * Removes injected style tags and font links.
 */
export function cleanupThemeInjection(handle: string): void {
  const ids = [
    `theme-vars-${handle}`,
    `theme-bg-${handle}`,
    `theme-animation-${handle}`,
    `theme-overlay-${handle}`,
    `theme-scrollbar-${handle}`,
    'creator-google-fonts',
  ];
  ids.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.remove();
  });
}
