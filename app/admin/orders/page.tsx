"use client";

import { OrdersHeader } from "@/components/admin/orders/OrdersHeader";
import { OrdersTable } from "@/components/admin/orders/OrdersTable";
import { useState } from "react";
import { type OrderStatus } from "@/stores/useOrderStore";

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | "all">("all");

  return (
    <div className="space-y-6">
      <OrdersHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
      />
      <OrdersTable searchQuery={searchQuery} statusFilter={statusFilter} />
    </div>
  );
}
