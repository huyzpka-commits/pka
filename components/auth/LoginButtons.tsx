"use client";

import { signIn } from "next-auth/react";

const providers = [
  {
    id: "google",
    label: "Google Drive",
    className: "bg-white text-zinc-950 hover:bg-zinc-200",
  },
  {
    id: "azure-ad",
    label: "OneDrive",
    className: "bg-blue-600 text-white hover:bg-blue-500",
  },
  {
    id: "dropbox",
    label: "Dropbox",
    className: "bg-sky-500 text-white hover:bg-sky-400",
  },
];

export default function LoginButtons() {
  return (
    <div className="grid w-full max-w-md gap-3">
      {providers.map((provider) => (
        <button
          key={provider.id}
          type="button"
          onClick={() => signIn(provider.id, { callbackUrl: "/gallery" })}
          className={`rounded-2xl px-5 py-4 text-sm font-semibold shadow-lg shadow-black/20 transition ${provider.className}`}
        >
          Đăng nhập với {provider.label}
        </button>
      ))}
    </div>
  );
}
