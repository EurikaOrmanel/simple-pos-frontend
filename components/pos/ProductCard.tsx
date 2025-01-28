"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { useCartStore } from "@/stores/useCartStore";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem, items, updateQuantity, removeItem } = useCartStore();
  const { toast } = useToast();

  const quantity = items.find((item) => item.id === product.id)?.quantity || 0;

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast({
      description: `Added ${product.name} to cart`,
    });
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) {
      updateQuantity(product.id, quantity - 1);
    } else {
      removeItem(product.id);
      toast({
        description: `Removed ${product.name} from cart`,
      });
    }
  };

  return (
    <Card className="overflow-hidden group">
      <CardContent className="p-0">
        <div className="relative h-48 w-full bg-muted">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          {quantity > 0 && (
            <div className="absolute top-2 right-2 bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium">
              {quantity}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 flex flex-col gap-2">
        <div className="w-full">
          <h3 className="font-medium truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            ₵{product.price.toFixed(2)}
          </p>
        </div>
        <div className="flex items-center gap-2 w-full">
          {quantity > 0 ? (
            <>
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecreaseQuantity}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-8 text-center">{quantity}</span>
            </>
          ) : null}
          <Button
            className={cn(
              "flex-1 gap-2",
              quantity > 0 ? "bg-primary" : "bg-primary/90 hover:bg-primary"
            )}
            onClick={handleAddToCart}>
            <Plus className="h-4 w-4" />
            {quantity > 0 ? "Add More" : "Add to Cart"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
