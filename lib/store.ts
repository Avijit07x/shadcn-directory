import { create } from 'zustand';

interface UIState {
  isAddModalOpen: boolean;
  setAddModalOpen: (isOpen: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAddModalOpen: false,
  setAddModalOpen: (isOpen) => set({ isAddModalOpen: isOpen }),
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
}));
