"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Package, ShoppingCart, Users } from "lucide-react";

const sidebarLinks = [
  {
    title: "Products",
    href: "/admin",
    icon: Package,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    title: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-[calc(100vh-4rem)] border-r">
      <nav className="p-4 space-y-2">
        {sidebarLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent transition-colors",
                pathname === link.href && "bg-accent"
              )}>
              <Icon className="h-5 w-5" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
