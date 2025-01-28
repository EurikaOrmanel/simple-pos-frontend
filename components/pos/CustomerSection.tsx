import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "lucide-react";

export function CustomerSection() {
  return (
    <div className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <User className="w-5 h-5" />
        <h2 className="font-semibold">Customer</h2>
      </div>
      <div className="flex gap-2">
        <Input placeholder="Search customer..." />
        <Button variant="outline">Add</Button>
      </div>
    </div>
  );
}
