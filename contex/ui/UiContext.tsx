import { Context, createContext } from 'react';

interface ContextProps {
  isMenuOpen: boolean;

  // Methods
  togglesidMenu: () => void;
}

export const UiContext: Context<ContextProps> = createContext({} as ContextProps);