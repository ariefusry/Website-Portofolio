"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/** Menu samping admin; halaman yang sedang dibuka ditandai supaya tidak tersesat. */
export function NavLinks({ items }: { items: { href: string; label: string }[] }) {
  const pathname = usePathname();

  return (
    <nav className="mt-5 grid gap-0.5 font-body text-sm">
      {items.map((item) => {
        const current = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={current ? "page" : undefined}
            className={`rounded-md px-2.5 py-2 focus-visible:outline-2 focus-visible:outline-accent-solid ${
              current ? "bg-page font-semibold" : "hover:bg-page"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
