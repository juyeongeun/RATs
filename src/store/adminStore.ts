import { create } from "zustand";

interface AdminState {
  id: number | null;
  email: string | null;
  setAdmin: (admin: { id: number; email: string }) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  id: null,
  email: null,
  setAdmin: (admin) => set({ id: admin.id, email: admin.email }),
}));
