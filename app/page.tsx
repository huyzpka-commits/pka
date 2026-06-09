import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-6 text-white">
      <section className="max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.35em] text-cyan-400">
          Cloud Photo Gallery
        </p>
        <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
          Trung tâm quản lý ảnh từ Google Drive, OneDrive và Dropbox
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-zinc-400">
          Xem ảnh dạng masonry, duyệt theo timeline và chuẩn bị sẵn nền tảng cho album thông minh.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-300"
          >
            Kết nối cloud
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Xem demo gallery
          </Link>
        </div>
      </section>
    </main>
  );
}
