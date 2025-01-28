"use client";

import { CustomerSearch } from "./CustomerSearch";
import { useCartStore } from "@/stores/useCartStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CartItem } from "./CartItem";

interface CartSectionProps {
  className?: string;
}

export function CartSection({ className }: CartSectionProps) {
  const { items, total, removeItem, updateQuantity, customer } = useCartStore();
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
    // TODO: Implement checkout
    console.log("Checkout", { items, total, customer });
    toast({
      title: "Order Placed",
      description: `Order total: ₵${total.toFixed(2)}`,
    });
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
          {customer ? "Place Order" : "Select Customer to Continue"}
        </Button>
      </div>
    </div>
  );
}
