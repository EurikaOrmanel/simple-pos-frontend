"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function AdminHeader() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="font-semibold">Simple POS Admin</div>

        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
          <LogoutButton />
        </div>
      </div>
    </header>
  );
}
