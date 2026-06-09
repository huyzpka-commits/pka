"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import MasonryGrid from "@/components/gallery/MasonryGrid";
import Lightbox from "@/components/gallery/Lightbox";
import Timeline from "@/components/gallery/Timeline";
import { usePhotoStore } from "@/stores/photo-store";
import type { PhotoItem } from "@/types/photo";

export default function GalleryPage() {
  const { photos, setPhotos, appendPhotos, cursor, setCursor, isLoading, setLoading } = usePhotoStore();
  const [activeDate, setActiveDate] = useState<string>();
  const [error, setError] = useState<string>();
  const [loaded, setLoaded] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoItem | null>(null);

  useEffect(() => {
    if (loaded) return;

    async function loadPhotos() {
      setLoading(true);
      setError(undefined);

      try {
        const response = await fetch("/api/photos");
        const data = await response.json();

        if (!response.ok) {
          setError(data.error ?? "Lỗi không xác định");
          return;
        }

        setPhotos(data.photos ?? []);
        setCursor(data.nextCursor ?? undefined);
        setLoaded(true);
      } catch {
        setError("Không thể kết nối server");
      } finally {
        setLoading(false);
      }
    }

    loadPhotos();
  }, [loaded, setCursor, setLoading, setPhotos]);

  const loadMore = useCallback(async () => {
    if (!cursor || isLoading) return;

    setLoading(true);
    setError(undefined);

    try {
      const response = await fetch(`/api/photos?cursor=${encodeURIComponent(cursor)}`);
      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Lỗi tải thêm");
        return;
      }

      appendPhotos(data.photos ?? []);
      setCursor(data.nextCursor ?? undefined);
    } catch {
      setError("Không thể tải thêm ảnh");
    } finally {
      setLoading(false);
    }
  }, [cursor, isLoading, appendPhotos, setCursor, setLoading]);

  const safePhotos = photos ?? [];
  const visiblePhotos = useMemo(() => {
    if (!activeDate) return safePhotos;

    return safePhotos.filter((photo) => photo.takenAt?.startsWith(activeDate));
  }, [activeDate, safePhotos]);

  const selectedIndex = selectedPhoto ? visiblePhotos.findIndex((p) => p.id === selectedPhoto.id) : -1;

  return (
    <main className="min-h-screen bg-zinc-950 px-4 py-6 text-white md:px-8">
      <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.25em] text-cyan-400">Gallery</p>
          <h1 className="mt-2 text-3xl font-semibold">Ảnh của bạn</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-400">
            Ảnh được tải trực tiếp từ cloud storage của bạn.
          </p>
        </div>

        <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-zinc-300">
          {isLoading ? "Đang tải ảnh..." : `${safePhotos.length} ảnh`}
        </div>
      </header>

      {error && (
        <div className="mb-8 rounded-xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-sm text-red-300">
          {error}
          {!safePhotos.length && (
            <Link href="/login" className="ml-2 underline hover:text-red-200">
              Kết nối cloud
            </Link>
          )}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <div>
          <MasonryGrid photos={visiblePhotos} onPhotoClick={setSelectedPhoto} />
          {cursor && (
            <div className="mt-6 flex justify-center">
              <button
                type="button"
                onClick={loadMore}
                disabled={isLoading}
                className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-40"
              >
                {isLoading ? "Đang tải..." : "Tải thêm ảnh"}
              </button>
            </div>
          )}
        </div>
        <Timeline photos={safePhotos} activeDate={activeDate} onSelectDate={setActiveDate} />
      </div>

      <Lightbox
        photo={selectedPhoto}
        onClose={() => setSelectedPhoto(null)}
        onPrev={selectedIndex > 0 ? () => setSelectedPhoto(visiblePhotos[selectedIndex - 1]) : undefined}
        onNext={selectedIndex < visiblePhotos.length - 1 ? () => setSelectedPhoto(visiblePhotos[selectedIndex + 1]) : undefined}
      />
    </main>
  );
}
