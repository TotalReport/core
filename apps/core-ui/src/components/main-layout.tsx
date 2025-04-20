"use client";

import { FileText, Home, Rocket } from "lucide-react";
import { Nav } from "./nav";

export function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <nav className="bg-gray-800 text-white p-2">
        <Nav
          isCollapsed={false}
          links={[
            {
              title: "Home",
              icon: Home,
              variant: "ghost",
              href: "/",
            },
            {
              title: "Reports",
              icon: FileText,
              variant: "ghost",
              href: "/reports",
            },
            {
              title: "Launches",
              icon: Rocket,
              variant: "ghost",
              href: "/launches",
            },
          ]}
        />
      </nav>
      <main className="flex-grow p-0">
        {children}
      </main>
    </div>
  );
}
