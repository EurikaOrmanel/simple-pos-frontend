import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Minus, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface CartSectionProps {
  className?: string;
}

export function CartSection({ className }: CartSectionProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Cart</h2>
        <ShoppingCart className="h-5 w-5" />
      </div>

      <ScrollArea className="flex-1">
        <div className="space-y-2">
          {/* Cart items will go here */}
          <p className="text-muted-foreground text-center py-8">
            No items in cart
          </p>
        </div>
      </ScrollArea>

      <div className="border-t mt-4 pt-4 space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>$0.00</span>
        </div>

        <Button className="w-full">Checkout</Button>
      </div>
    </div>
  );
}

export function CartItem() {
  return (
    <div className="flex gap-4 py-3">
      <div className="h-16 w-16 rounded-md bg-muted flex-shrink-0" />
      <div className="flex flex-col flex-1 gap-1">
        <div className="flex justify-between">
          <h3 className="font-medium">Product Name</h3>
          <button
            className="text-destructive hover:text-destructive/80"
            title="Remove item"
            aria-label="Remove item from cart">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">₵99.99</p>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm w-8 text-center">1</span>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8"
            aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
