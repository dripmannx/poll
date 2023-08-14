import Link from "next/link";

import { useRouter } from "next/router";
import * as React from "react";
import { cn } from "../../utils/utils";
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const router = useRouter();

  return (
    <nav
      className={cn(
        "items-cemter flex h-full items-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <Link
        href="/"
        className={cn(
          " group  flex h-full items-center text-center text-sm font-medium transition-colors hover:border-b-2 hover:border-black hover:text-primary dark:hover:border-white",
          router.pathname === "/"
            ? " border-b-2 border-black dark:border-white"
            : ""
        )}
      >
        <span className="m-auto">Entdecken</span>
      </Link>
      <Link
        href="/create"
        className={cn(
          " flex h-full items-center text-center text-sm font-medium transition-colors hover:border-b-2 hover:border-black hover:text-primary dark:hover:border-white",
          router.pathname === "/create"
            ? " border-b-2 border-black dark:border-white"
            : ""
        )}
      >
        <span className="m-auto">Erstellen</span>
      </Link>
    </nav>
  );
}
