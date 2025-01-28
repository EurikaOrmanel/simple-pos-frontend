import { POSLayout } from "@/components/pos/POSLayout";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "POS System",
  description: "Simple and efficient point of sale system",
};

export default function POSPage() {
  return <POSLayout />;
}
