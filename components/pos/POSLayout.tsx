import { ProductSection } from "./ProductSection";
import { CartSection } from "./CartSection";

export function POSLayout() {
  return (
    <div className="flex h-screen">
      <ProductSection className="w-2/3 p-4 bg-background" />
      <CartSection className="w-1/3 border-l bg-muted p-4" />
    </div>
  );
}
