import { FC, useReducer } from 'react';
import { UiContext, uiReducer } from './';

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

export const UiProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);

  const togglesidMenu = () => {
    dispatch({ type: '[UI] - toggleMenu' });
  };

  return (
    <UiContext.Provider
      value={{
        ...state,

        // Methods
        togglesidMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};