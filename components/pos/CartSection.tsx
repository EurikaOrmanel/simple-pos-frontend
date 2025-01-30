"use client";

import { CustomerSearch } from "./CustomerSearch";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "./CartItem";
import Cookies from "js-cookie";
import { API_BASE_URL } from "@/lib/api/client";

interface CartSectionProps {
  className?: string;
}

function getAuthToken(): string | null {
  const authData = Cookies.get("auth-storage");
  if (!authData) return null;

  try {
    const parsedData = JSON.parse(decodeURIComponent(authData));
    const token = parsedData.state?.token || null;
    return token;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
}

async function createCustomer(data: { name: string; phone: string }) {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(`${API_BASE_URL}/v1/sales_persons/customers/`, {
    method: "POST",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create customer");
  return response.json();
}

async function createOrder(data: {
  customer_id: string;
  items: { product_id: string; quantity: number }[];
}) {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${API_BASE_URL}/v1/sales_persons/orders/create`,
    {
      method: "POST",
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
}

export function CartSection({ className }: CartSectionProps) {
  const {
    items,
    total,
    removeItem,
    updateQuantity,
    customer,
    setCustomer,
    clearCart,
  } = useCartStore();
  const { toast } = useToast();

  const handleUpdateQuantity = (
    id: string,
    currentQuantity: number,
    delta: number
  ) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity < 1) {
      removeItem(id);
      toast({
        description: "Item removed from cart",
      });
    } else {
      updateQuantity(id, newQuantity);
    }
  };

  const handleCheckout = async () => {
    if (!customer) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a customer before checkout",
      });
      return;
    }

    try {
      let customerId: string;

      // If this is a pending customer, create them first
      if (customer.isPending) {
        const newCustomer = await createCustomer({
          name: customer.name,
          phone: customer.phone,
        });
        customerId = newCustomer.id;
        setCustomer(newCustomer); // Update the customer in the store with the created one
      } else if (!customer.id) {
        throw new Error("Invalid customer ID");
      } else {
        customerId = customer.id;
      }
      // Create the order
      await createOrder({
        customer_id: customerId,
        items: items.map((item) => ({
          product_id: item.id,
          quantity: item.quantity,
        })),
      });

      toast({
        title: "Order Placed",
        description: `Order total: ₵${total.toFixed(2)}`,
      });

      // Clear everything after successful order
      clearCart(); // This will clear items, customer, and total
    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to place order",
      });
    }
  };

  return (
    <div className={cn("flex flex-col h-full overflow-hidden", className)}>
      <div className="p-4 border-b">
        <CustomerSearch />
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-muted-foreground p-8 text-center min-h-[400px]">
              <ShoppingCart className="h-12 w-12 mb-4" />
              <h3 className="font-medium mb-2">Your cart is empty</h3>
              <p className="text-sm">Add items from the menu to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  price={item.price}
                  quantity={item.quantity}
                  image={item.image}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t bg-background">
        <div className="flex justify-between text-lg font-medium mb-4">
          <span>Total</span>
          <span>₵{total.toFixed(2)}</span>
        </div>
        <Button
          className="w-full"
          size="lg"
          disabled={items.length === 0 || !customer}
          onClick={handleCheckout}>
          {items.length === 0
            ? "Add Items to Cart"
            : customer?.isPending
            ? "Place Order"
            : "Place Order"}
        </Button>
      </div>
    </div>
  );
}
