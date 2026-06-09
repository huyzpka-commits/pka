"use client";

import type { PhotoItem } from "@/types/photo";
import PhotoCard from "./PhotoCard";

type MasonryGridProps = {
  photos: PhotoItem[];
  onPhotoClick?: (photo: PhotoItem) => void;
};

export default function MasonryGrid({ photos, onPhotoClick }: MasonryGridProps) {
  if (photos.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-white/10 p-10 text-center text-zinc-400">
        Không có ảnh phù hợp với bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div className="columns-2 gap-3 md:columns-3 lg:columns-4 xl:columns-5">
      {photos.map((photo) => (
        <PhotoCard key={`${photo.provider}-${photo.cloudFileId}`} photo={photo} onClick={onPhotoClick} />
      ))}
    </div>
  );
}
