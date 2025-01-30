"use client";

import { ProductSection } from "./ProductSection";
import { CartSection } from "./CartSection";
import { useEffect, useState } from "react";
import { Store, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { LogoutButton } from "@/components/auth/LogoutButton";

export function POSLayout() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 overflow-hidden flex flex-col">
        <header className="border-b bg-background px-6 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Store className="h-6 w-6" />
              <h1 className="text-xl font-semibold">Point of Sale</h1>
            </div>
            <div className="flex-1 max-w-xl relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <LogoutButton />
            </div>
          </div>
        </header>
        <ProductSection
          className="flex-1 overflow-y-auto p-4 bg-background"
          isLoading={isLoading}
          searchQuery={searchQuery}
        />
      </div>
      <div className="w-[400px] border-l bg-muted">
        <CartSection className="h-screen" />
      </div>
    </div>
  );
}
