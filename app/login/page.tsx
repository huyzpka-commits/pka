import LoginButtons from "@/components/auth/LoginButtons";

export default function LoginPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,211,238,0.2),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.18),transparent_35%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 py-16">
        <div className="mb-10 text-center">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-cyan-400">
            Cloud Photo Gallery
          </p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">
            Kết nối cloud bằng quyền chỉ đọc
          </h1>
          <p className="mt-5 max-w-2xl text-zinc-400">
            Ứng dụng lấy metadata và thumbnail ảnh từ cloud, sau đó hiển thị theo masonry grid, timeline và smart albums.
          </p>
        </div>

        <LoginButtons />
      </section>
    </main>
  );
}
