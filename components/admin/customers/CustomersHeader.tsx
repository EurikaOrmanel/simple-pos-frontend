import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CustomersHeader() {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-tight flex items-center gap-2">
          <Users className="h-6 w-6" />
          Customers
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage your customers and their information
        </p>
      </div>
      <Link href="/admin/customers/add">
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </Link>
    </div>
  );
}
