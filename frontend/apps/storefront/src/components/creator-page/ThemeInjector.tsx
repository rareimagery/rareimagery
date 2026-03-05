import { useEffect } from 'react';
import type { CreatorTheme } from '@rareimagery/types';
import {
  buildCSSVars,
  buildBackgroundCSS,
  buildAnimationCSS,
  buildOverlayCSS,
  buildScrollbarCSS,
  loadGoogleFonts,
  injectStyleTag,
  cleanupThemeInjection,
} from '../../lib/themeUtils';

interface ThemeInjectorProps {
  theme: CreatorTheme;
  handle: string;
}

export function ThemeInjector({ theme, handle }: ThemeInjectorProps) {
  useEffect(() => {
    // Inject CSS custom properties
    injectStyleTag(`theme-vars-${handle}`, buildCSSVars(theme, handle));

    // Inject background styles
    injectStyleTag(`theme-bg-${handle}`, buildBackgroundCSS(theme, handle));

    // Inject animation
    injectStyleTag(`theme-animation-${handle}`, buildAnimationCSS(theme, handle));

    // Inject overlay
    injectStyleTag(`theme-overlay-${handle}`, buildOverlayCSS(theme, handle));

    // Inject scrollbar
    injectStyleTag(`theme-scrollbar-${handle}`, buildScrollbarCSS(theme, handle));

    // Load Google Fonts
    loadGoogleFonts([theme.fontHeading, theme.fontBody, theme.fontAccent]);

    return () => {
      cleanupThemeInjection(handle);
    };
  }, [theme, handle]);

  return null;
}
