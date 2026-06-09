import { create } from "zustand";
import type { PhotoItem } from "@/types/photo";

type PhotoState = {
  photos: PhotoItem[];
  cursor?: string;
  isLoading: boolean;
  setPhotos: (photos: PhotoItem[]) => void;
  appendPhotos: (photos: PhotoItem[]) => void;
  setCursor: (cursor?: string) => void;
  setLoading: (value: boolean) => void;
};

export const usePhotoStore = create<PhotoState>()((set) => ({
  photos: [],
  isLoading: false,

  setPhotos: (photos) => set({ photos }),

  appendPhotos: (photos) =>
    set((state) => ({
      photos: [...state.photos, ...photos],
    })),

  setCursor: (cursor) => set({ cursor }),
  setLoading: (value) => set({ isLoading: value }),
}));
