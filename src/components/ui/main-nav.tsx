import Link from "next/link";

import * as React from "react";
import { cn } from "../../utils/utils";
export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn(
        "items-cemter flex h-full items-center space-x-4 lg:space-x-6",
        className
      )}
      {...props}
    >
      <div className="flex items-center"></div>

      <Link
        href="/"
        className=" flex h-full text-center text-sm font-medium transition-colors hover:border-b-2 hover:border-black hover:text-primary dark:hover:border-white"
      >
        <span className="m-auto">Entdecken</span>
      </Link>
      <Link
        href="/new"
        className=" flex h-full text-center text-sm font-medium transition-colors hover:border-b-2 hover:border-black hover:text-primary dark:hover:border-white"
      >
        <span className="m-auto">Erstellen</span>
      </Link>
    </nav>
  );
}
