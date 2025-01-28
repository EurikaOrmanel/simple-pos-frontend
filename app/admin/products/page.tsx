import { ProductsHeader } from "@/components/admin/products/ProductsHeader";
import { ProductsTable } from "@/components/admin/products/ProductsTable";

export default function ProductsPage() {
  return (
    <div className="space-y-6">
      <ProductsHeader />
      <ProductsTable />
    </div>
  );
}
