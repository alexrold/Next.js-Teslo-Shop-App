import { FC, useEffect, useReducer } from 'react';
import { useSession, signOut } from 'next-auth/react';
import axios from 'axios';
import Cookies from 'js-cookie';
import { tesloShopApi } from '../../api';
import { IUser } from '../../interfaces';
import { AuthContext, authReducer } from './';

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface Props {
  children?: React.ReactNode | undefined;
}

export const AuthProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();


  useEffect(() => {
    if (status === 'authenticated') {
      console.log({ user: data.user });
      dispatch({ type: '[AUTH] - Login', payload: data.user as IUser });
    }
  }, [status, data]);


  const checkToken = async () => {
    // si no hay token en coockie 
    if (!Cookies.get('token')) {
      return;
    }

    try {
      const { data } = await tesloShopApi.get('/user/validate');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
      return;
    } catch (error) {
      return Cookies.remove('token');
    }
  }

  // logout
  const logout = () => {
    Cookies.remove('cart');

    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('zip');
    Cookies.remove('country');
    Cookies.remove('phone');
    Cookies.remove('phone2');
    Cookies.remove('provinceOrState');
    Cookies.remove('city');

    dispatch({ type: '[AUTH] - Logout' });
    signOut();
  }

  // loginUser
  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloShopApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  // RegisterUser
  const registerUser = async (name: string, email: string, password: string): Promise<{ hasError: boolean; message?: string; }> => {
    try {
      const { data } = await tesloShopApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[AUTH] - Login', payload: user });
      return {
        hasError: false,
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const { message } = error.response?.data as { message: string }
        return {
          hasError: true,
          message,
        }
      }
      return {
        hasError: true,
        message: 'Ocurrio un error inesperado, intente nuevamente',
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // Methods
        loginUser,
        logout,
        registerUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};