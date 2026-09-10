"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Plus, ListChecks, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/expenses", label: "Expenses", icon: Wallet },
  { href: "/expenses/new", label: "Add", icon: Plus, isFab: true },
  { href: "/todos", label: "To Do", icon: ListChecks },
  { href: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur pb-[env(safe-area-inset-bottom)]">
      <ul className="mx-auto flex max-w-md items-center justify-around px-2">
        {NAV_ITEMS.map((item) => {
          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;

          if ("isFab" in item && item.isFab) {
            return (
              <li key={item.href} className="-mt-5">
                <Link
                  href={item.href}
                  aria-label={item.label}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-maroon text-white shadow-lg shadow-maroon/30 active:scale-95 transition-transform"
                >
                  <Icon size={26} />
                </Link>
              </li>
            );
          }

          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium",
                  active ? "text-maroon" : "text-muted"
                )}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 2} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
