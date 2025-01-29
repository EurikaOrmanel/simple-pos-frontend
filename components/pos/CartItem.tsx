"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { API_BASE_URL } from "@/lib/api/client";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  onUpdateQuantity: (
    id: string,
    currentQuantity: number,
    delta: number
  ) => void;
  onRemove: (id: string) => void;
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  image,
  onUpdateQuantity,
  onRemove,
}: CartItemProps) {
  const { toast } = useToast();

  const handleRemove = () => {
    onRemove(id);
    toast({
      description: "Item removed from cart",
    });
  };

  return (
    <div className="flex flex-col bg-card rounded-lg p-3 gap-3">
      <div className="flex gap-3">
        <div className="h-16 w-16 relative rounded-md overflow-hidden bg-muted shrink-0">
          <Image
            src={API_BASE_URL + image}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium leading-none truncate mb-1">{name}</h4>
          <p className="text-sm text-muted-foreground">₵{price.toFixed(2)}</p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t pt-2">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(id, quantity, -1)}>
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center tabular-nums">{quantity}</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8"
            onClick={() => onUpdateQuantity(id, quantity, 1)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          size="icon"
          variant="ghost"
          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
