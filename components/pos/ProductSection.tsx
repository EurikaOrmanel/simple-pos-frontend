"use client";

import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";
import { useEffect, useState } from "react";
import { productsApi, type Product } from "@/lib/api/products";
import { useToast } from "@/hooks/use-toast";

interface ProductSectionProps {
  className?: string;
  isLoading?: boolean;
  searchQuery?: string;
}

export function ProductSection({
  className,
  isLoading: initialLoading,
  searchQuery = "",
}: ProductSectionProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(initialLoading);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchProducts() {
      try {
        setIsLoading(true);
        const response = await productsApi.getAllForSales(1, 100);
        setProducts(response);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again later.",
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchProducts();
  }, [toast]);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="bg-muted animate-pulse rounded-lg aspect-[4/3]"
            />
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground">
            <p className="text-lg font-medium">No products found</p>
            <p className="text-sm">Try a different search term</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={{
                ...product,
                price: parseFloat(product.price),
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
