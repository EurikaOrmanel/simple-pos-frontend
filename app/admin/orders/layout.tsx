import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders | Admin Dashboard",
  description: "Manage and view all orders",
};

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
