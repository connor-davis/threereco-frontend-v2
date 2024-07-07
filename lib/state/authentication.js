import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";

const useAuthenticationStore = create(
  persist(
    (set, get) => ({
      token: undefined,
      setToken: (token) => set({ token }),
    }),
    {
      name: "authentication-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useAuthenticationStore;
