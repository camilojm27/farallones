import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  username?: string;
  phone_number?: string | null;
  email_verified_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;
  isOffline: boolean;
  setIsOffline: Dispatch<SetStateAction<boolean>>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isOffline: false,
  setIsOffline: () => {},
});
