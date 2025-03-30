import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  users: new Map(),
  currentUser: null,
  register: (email, password, name) => {
    const store = useAuthStore.getState();
    if (store.users.has(email)) {
      return false;
    }
    store.users.set(email, { email, password, name });
    return true;
  },
  login: (email, password) => {
    const store = useAuthStore.getState();
    const user = store.users.get(email);
    if (user && user.password === password) {
      set({ currentUser: user });
      return true;
    }
    return false;
  },
  logout: () => {
    set({ currentUser: null });
  },
}));