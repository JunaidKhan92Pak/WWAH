"use client";

import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";


export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <aside
          className="hidden lg:block w-64 overflow-y-scroll bg-[#FCE7D2] border-r flex-shrink-0"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <Sidebar />
        </aside>
        <main className="flex-1 overflow-y-auto mb-2">{children}</main>
      </div>
    </div>
  );
}
