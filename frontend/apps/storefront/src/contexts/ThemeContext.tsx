import { createContext, useContext, type ReactNode } from 'react';
import type { CreatorTheme } from '@rareimagery/types';

interface ThemeContextValue {
  theme: CreatorTheme | null;
}

const ThemeContext = createContext<ThemeContextValue>({ theme: null });

export function ThemeProvider({
  children,
  initialTheme,
}: {
  children: ReactNode;
  initialTheme: CreatorTheme | null;
}) {
  return (
    <ThemeContext.Provider value={{ theme: initialTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
