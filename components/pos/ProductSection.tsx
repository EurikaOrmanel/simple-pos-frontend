"use client";

import { cn } from "@/lib/utils";
import { ProductCard } from "./ProductCard";

interface ProductSectionProps {
  className?: string;
  isLoading?: boolean;
  searchQuery?: string;
}

const PRODUCTS = [
  {
    id: "burger-1",
    name: "Classic Burger",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=500&fit=crop",
  },
  {
    id: "burger-2",
    name: "Cheese Burger Deluxe",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&h=500&fit=crop",
  },
  {
    id: "burger-3",
    name: "BBQ Bacon Burger",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=500&h=500&fit=crop",
  },
  {
    id: "pizza-1",
    name: "Pepperoni Pizza",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=500&h=500&fit=crop",
  },
  {
    id: "pizza-2",
    name: "Margherita Pizza",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&h=500&fit=crop",
  },
  {
    id: "pizza-3",
    name: "Supreme Pizza",
    price: 44.99,
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&h=500&fit=crop",
  },
  {
    id: "chicken-1",
    name: "Grilled Chicken",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=500&h=500&fit=crop",
  },
  {
    id: "chicken-2",
    name: "Chicken Wings (8pcs)",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=500&h=500&fit=crop",
  },
  {
    id: "chicken-3",
    name: "Chicken Tenders",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1562967914-608f82629710?w=500&h=500&fit=crop",
  },
  {
    id: "fish-1",
    name: "Grilled Fish",
    price: 44.99,
    image:
      "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&h=500&fit=crop",
  },
  {
    id: "fish-2",
    name: "Fish & Chips",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1579208575657-c595a05383b7?w=500&h=500&fit=crop",
  },
  {
    id: "salad-1",
    name: "Caesar Salad",
    price: 19.99,
    image:
      "https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=500&h=500&fit=crop",
  },
  {
    id: "salad-2",
    name: "Greek Salad",
    price: 21.99,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=500&fit=crop",
  },
  {
    id: "pasta-1",
    name: "Spaghetti Bolognese",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=500&h=500&fit=crop",
  },
  {
    id: "pasta-2",
    name: "Fettuccine Alfredo",
    price: 26.99,
    image:
      "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=500&h=500&fit=crop",
  },
  {
    id: "pasta-3",
    name: "Shrimp Scampi",
    price: 29.99,
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&h=500&fit=crop",
  },
  {
    id: "dessert-1",
    name: "Chocolate Cake",
    price: 14.99,
    image:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=500&h=500&fit=crop",
  },
  {
    id: "dessert-2",
    name: "Cheesecake",
    price: 15.99,
    image:
      "https://images.unsplash.com/photo-1524351199678-941a58a3df50?w=500&h=500&fit=crop",
  },
  {
    id: "dessert-3",
    name: "Tiramisu",
    price: 13.99,
    image:
      "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&h=500&fit=crop",
  },
  {
    id: "drinks-1",
    name: "Fresh Smoothie",
    price: 9.99,
    image:
      "https://images.unsplash.com/photo-1509482560494-4126f8225994?w=500&h=500&fit=crop",
  },
  {
    id: "drinks-2",
    name: "Iced Coffee",
    price: 7.99,
    image:
      "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&h=500&fit=crop",
  },
  {
    id: "drinks-3",
    name: "Fresh Lemonade",
    price: 6.99,
    image:
      "https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=500&h=500&fit=crop",
  },
];

export function ProductSection({
  className,
  isLoading,
  searchQuery = "",
}: ProductSectionProps) {
  const filteredProducts = PRODUCTS.filter((product) =>
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
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}
