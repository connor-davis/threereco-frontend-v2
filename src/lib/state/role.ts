import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface RoleState {
  role: string | null;
  setRole: (role: string) => void;
}

const useRole = create(
  persist<RoleState>(
    (set, get) => ({
      role: null,
      setRole: (role: string) => set({ role }),
    }),
    {
      name: "role-state",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useRole;
