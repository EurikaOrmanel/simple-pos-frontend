import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import { Plus } from "lucide-react";

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
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative h-40 w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
      <CardFooter className="p-2 flex justify-between items-center">
        <div>
          <h3 className="font-medium">{product.name}</h3>
          <p className="text-sm text-muted-foreground">
            ${product.price.toFixed(2)}
          </p>
        </div>
        <Button size="icon" variant="ghost">
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
