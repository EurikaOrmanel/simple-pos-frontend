import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProductSectionProps {
  className?: string;
}

interface ProductCardProps {
  name: string;
  price: number;
  image: string;
}

function ProductCard({ name, price, image }: ProductCardProps) {
  return (
    <Card className="group overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-square relative">
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start gap-2">
            <div>
              <h3 className="font-medium leading-none mb-1">{name}</h3>
              <p className="text-sm text-muted-foreground">
                ₵{price.toFixed(2)}
              </p>
            </div>
            <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function ProductSection({ className }: ProductSectionProps) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." className="pl-8" />
      </div>

      <div className="grid grid-cols-3 gap-4 overflow-y-auto">
        {Array.from({ length: 9 }).map((_, i) => (
          <ProductCard
            key={i}
            name={`Product ${i + 1}`}
            price={9.99 + i}
            image={`https://images.unsplash.com/photo-${
              1514432324607 + i
            }?w=200&h=200&fit=crop`}
          />
        ))}
      </div>
    </div>
  );
}
