"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface TableFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  priceRange: string;
  onPriceRangeChange: (value: string) => void;
  onResetFilters: () => void;
}

export function TableFilters({
  searchQuery,
  onSearchChange,
  priceRange,
  onPriceRangeChange,
  onResetFilters,
}: TableFiltersProps) {
  return (
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-1">
        <Input
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <Select value={priceRange} onValueChange={onPriceRangeChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Price range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Prices</SelectItem>
          <SelectItem value="0-50">$0 - $50</SelectItem>
          <SelectItem value="51-100">$51 - $100</SelectItem>
          <SelectItem value="101+">$101+</SelectItem>
        </SelectContent>
      </Select>
      {(searchQuery || priceRange !== "all") && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onResetFilters}
          className="rounded-full">
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
