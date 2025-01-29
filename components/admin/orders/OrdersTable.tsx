"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useOrderStore,
  type Order,
  type OrderStatus,
} from "@/stores/useOrderStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// Types for the order status
const orderStatuses = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
} as const;

// Sample data - replace with actual API call
const sampleOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customer: {
      name: "John Doe",
      email: "john@example.com",
      phone: "+233 20 123 4567",
    },
    date: "2024-03-20 14:30",
    status: "completed" as OrderStatus,
    items: [
      {
        id: "1",
        name: "Classic Burger",
        quantity: 2,
        price: 29.99,
        total: 59.98,
      },
    ],
    subtotal: 59.98,
    tax: 4.8,
    total: 64.78,
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customer: {
      name: "Jane Smith",
      email: "jane@example.com",
      phone: "+233 24 987 6543",
    },
    date: "2024-03-20 15:45",
    status: "pending" as OrderStatus,
    items: [
      {
        id: "2",
        name: "Cheese Pizza",
        quantity: 1,
        price: 34.99,
        total: 34.99,
      },
    ],
    subtotal: 34.99,
    tax: 2.8,
    total: 37.79,
  },
];

interface OrdersTableProps {
  searchQuery: string;
  statusFilter: OrderStatus | "all";
}

export function OrdersTable({ searchQuery, statusFilter }: OrdersTableProps) {
  const router = useRouter();
  const { orders, setOrders, isLoading, setLoading, error, setError } =
    useOrderStore();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API delay
        setOrders(sampleOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [setOrders, setLoading, setError]);

  useEffect(() => {
    // Filter orders based on search query and status
    const filtered = orders
      .filter(
        (order) => statusFilter === "all" || order.status === statusFilter
      )
      .filter(
        (order) =>
          order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          order.customer.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    setFilteredOrders(filtered);
  }, [orders, searchQuery, statusFilter]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" />
          <p className="text-muted-foreground">Loading orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <p className="text-destructive">Error: {error}</p>
          <Button variant="outline" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            {orders.length === 0
              ? "No orders found"
              : "No orders match your search criteria"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order Number</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredOrders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">{order.orderNumber}</TableCell>
              <TableCell>{order.customer.name}</TableCell>
              <TableCell>{order.date}</TableCell>
              <TableCell>{order.items.length}</TableCell>
              <TableCell>₵{order.total.toFixed(2)}</TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn("capitalize", orderStatuses[order.status])}>
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer"
                      onClick={() => router.push(`/admin/orders/${order.id}`)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
