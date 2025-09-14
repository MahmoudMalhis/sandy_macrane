import { create } from "zustand";

const useAppStore = create((set, get) => ({
  // حالة نموذج الطلب
  isOrderFormOpen: false,
  selectedAlbum: null,

  // حالة Lightbox للصور
  isLightboxOpen: false,
  currentImageIndex: 0,
  currentImages: [],

  // إجراءات نموذج الطلب
  openOrderForm: (album = null) =>
    set({
      isOrderFormOpen: true,
      selectedAlbum: album,
    }),

  closeOrderForm: () =>
    set({
      isOrderFormOpen: false,
      selectedAlbum: null,
    }),

  // إجراءات Lightbox
  openLightbox: (images, startIndex = 0) =>
    set({
      isLightboxOpen: true,
      currentImages: images,
      currentImageIndex: startIndex,
    }),

  closeLightbox: () =>
    set({
      isLightboxOpen: false,
      currentImages: [],
      currentImageIndex: 0,
    }),

  // تغيير الصورة الحالية في Lightbox
  setCurrentImage: (index) => set({ currentImageIndex: index }),
}));

export default useAppStore;
