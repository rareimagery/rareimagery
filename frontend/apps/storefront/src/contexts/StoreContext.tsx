import { createContext, useContext, type ReactNode } from 'react';
import type { CreatorStore } from '@rareimagery/types';

interface StoreContextValue {
  store: CreatorStore | null;
  handle: string;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextValue>({
  store: null,
  handle: '',
  isLoading: true,
});

export function StoreProvider({
  children,
  store,
  handle,
  isLoading,
}: StoreContextValue & { children: ReactNode }) {
  return (
    <StoreContext.Provider value={{ store, handle, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  return useContext(StoreContext);
}
