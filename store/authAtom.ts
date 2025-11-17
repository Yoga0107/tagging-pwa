import { atom } from "jotai";

export interface AuthUser {
  id?: string;
  email: string;
  departement?: string | null;
}

export const userAtom = atom<AuthUser | null>(null);
