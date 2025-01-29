import { Metadata } from "next";
import { CustomerForm } from "@/components/admin/customers/CustomerForm";

export const metadata: Metadata = {
  title: "Add Customer | Admin Dashboard",
  description: "Add a new customer",
};

export default function AddCustomerPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Add Customer</h2>
        <p className="text-sm text-muted-foreground">
          Add a new customer to your system
        </p>
      </div>
      <CustomerForm />
    </div>
  );
}
