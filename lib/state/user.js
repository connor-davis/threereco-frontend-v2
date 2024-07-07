import { createJSONStorage, persist } from "zustand/middleware";

import { create } from "zustand";

const useUserStore = create(
  persist(
    (set, get) => ({
      user: undefined,
      setUser: (user) => set({ user }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useUserStore;
