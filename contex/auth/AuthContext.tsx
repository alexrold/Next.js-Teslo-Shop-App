import { Context, createContext } from 'react';
import { IUser } from '../../interfaces';

interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;

  // Methods
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (name: string, email: string, password: string) => Promise<{ hasError: boolean; message?: string; }>;
}

export const AuthContext: Context<ContextProps> = createContext({} as ContextProps);