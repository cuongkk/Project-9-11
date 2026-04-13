"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center p-2.5"
      style={{
        backgroundImage: "url('/admin/background.png')",
      }}
    >
      {children}
    </div>
  );
}
