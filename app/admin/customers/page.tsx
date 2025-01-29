import { Metadata } from "next";
import { CustomersHeader } from "@/components/admin/customers/CustomersHeader";
import { CustomersTable } from "@/components/admin/customers/CustomersTable";

export const metadata: Metadata = {
  title: "Customers | Admin Dashboard",
  description: "Manage your customers",
};

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <CustomersHeader />
      <CustomersTable />
    </div>
  );
}
