"use client";

import { useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import type { PhotoItem } from "@/types/photo";

type LightboxProps = {
  photo: PhotoItem | null;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
};

const providerLabel = {
  google: "Google Drive",
  onedrive: "OneDrive",
  dropbox: "Dropbox",
};

export default function Lightbox({ photo, onClose, onPrev, onNext }: LightboxProps) {
  const backdropRef = useRef<HTMLDivElement>(null);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    },
    [onClose, onPrev, onNext]
  );

  useEffect(() => {
    if (!photo) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [photo, handleKey]);

  if (!photo) return null;

  return (
    <div
      ref={backdropRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 z-10 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {onPrev && (
        <button
          type="button"
          onClick={onPrev}
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {onNext && (
        <button
          type="button"
          onClick={onNext}
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      <div className="flex max-h-[90vh] max-w-[90vw] flex-col items-center">
        <Image
          src={photo.previewUrl}
          alt={photo.name}
          width={photo.width ?? 1600}
          height={photo.height ?? 1200}
          unoptimized
          className="max-h-[80vh] w-auto rounded-lg object-contain"
          sizes="90vw"
        />
        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-white">{photo.name}</p>
          <p className="mt-1 text-xs text-zinc-400">{providerLabel[photo.provider]}</p>
          {photo.takenAt && (
            <p className="mt-1 text-xs text-zinc-500">
              {new Date(photo.takenAt).toLocaleDateString("vi-VN")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
