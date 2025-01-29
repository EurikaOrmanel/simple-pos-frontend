"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileDown } from "lucide-react";
import { useOrderStore, type OrderStatus } from "@/stores/useOrderStore";

interface OrdersHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: OrderStatus | "all";
  onStatusChange: (value: OrderStatus | "all") => void;
}

export function OrdersHeader({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
}: OrdersHeaderProps) {
  const { orders } = useOrderStore();

  const handleExport = () => {
    // Create CSV content
    const headers = [
      "Order Number",
      "Customer",
      "Date",
      "Items",
      "Total",
      "Status",
    ];
    const rows = orders
      .filter(
        (order) => statusFilter === "all" || order.status === statusFilter
      )
      .filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((order) => [
        order.orderNumber,
        order.customer.name,
        order.date,
        order.items.length.toString(),
        order.total.toFixed(2),
        order.status,
      ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `orders-${new Date().toISOString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and track all orders</p>
      </div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search orders..."
              className="pl-8 w-[250px]"
              type="search"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="shrink-0"
          onClick={handleExport}>
          <FileDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
