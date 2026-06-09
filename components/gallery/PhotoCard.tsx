"use client";

import Image from "next/image";
import type { PhotoItem } from "@/types/photo";

type PhotoCardProps = {
  photo: PhotoItem;
  onClick?: (photo: PhotoItem) => void;
};

const providerLabel = {
  google: "Google Drive",
  onedrive: "OneDrive",
  dropbox: "Dropbox",
};

export default function PhotoCard({ photo, onClick }: PhotoCardProps) {
  return (
    <button
      type="button"
      onClick={() => onClick?.(photo)}
      className="group mb-3 block w-full break-inside-avoid overflow-hidden rounded-2xl bg-zinc-900 text-left shadow-lg shadow-black/20"
    >
      <div className="relative">
        <Image
          src={photo.thumbnailUrl}
          alt={photo.name}
          width={photo.width ?? 600}
          height={photo.height ?? 800}
          loading="lazy"
          unoptimized
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 25vw, 20vw"
          className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.03]"
        />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 transition group-hover:opacity-100">
          <p className="truncate text-xs font-medium text-white">{photo.name}</p>
          <p className="mt-1 text-[11px] text-zinc-300">{providerLabel[photo.provider]}</p>
        </div>
      </div>
    </button>
  );
}
