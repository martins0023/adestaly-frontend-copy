"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef } from "react";
import { cn } from "../lib/utils";

// 1. We extend Next.js's Link props, but omit 'href' and 'className' 
// so we can override them to match your existing React Router implementation.
type NextLinkProps = React.ComponentPropsWithoutRef<typeof Link>;

interface NavLinkCompatProps extends Omit<NextLinkProps, "href" | "className"> {
  to: NextLinkProps["href"]; // Maps React Router's 'to' to Next.js's 'href'
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, to, ...props }, ref) => {
    const pathname = usePathname();
    
    // 2. Next.js natively doesn't have an "isActive" prop, so we calculate it by 
    // comparing the current path to the 'to' destination.
    const isActive = pathname === to.toString();

    return (
      <Link
        ref={ref}
        href={to} // Pass 'to' directly into Next.js's 'href' prop
        className={cn(
          className, 
          isActive && activeClassName
          // Note: Next.js App Router doesn't expose a native "isPending" transition state 
          // directly on the Link level like React Router does. The pendingClassName is 
          // kept in the interface so your app doesn't break, but is safely ignored here.
        )}
        {...props}
      />
    );
  },
);

NavLink.displayName = "NavLink";

export { NavLink };