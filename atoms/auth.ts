import { atom } from "jotai";

export const authAtom = atom({
  isAuthenticated: false,
  user: null as null | { email: string },
});
