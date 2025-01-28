"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserPlus, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id?: string;
  name: string;
  mobile: string;
  isNew?: boolean;
}

export function CustomerSearch() {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const setCustomer = useCartStore((state) => state.setCustomer);
  const customer = useCartStore((state) => state.customer);
  const { toast } = useToast();

  const handleSearch = async (query: string, field: "name" | "mobile") => {
    if (field === "name") setName(query);
    else setMobile(query);

    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    // TODO: Implement API call to search customers
    // For now, we'll just create a new customer
    setSuggestions([
      {
        id: "new",
        name: field === "name" ? query : name,
        mobile: field === "mobile" ? query : mobile,
        isNew: true,
      },
    ]);
  };

  const handleSelectCustomer = (customer: Customer) => {
    if (!name || !mobile) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both name and mobile number",
      });
      return;
    }

    setName(customer.name);
    setMobile(customer.mobile);
    setCustomer(customer);
    setSuggestions([]);

    toast({
      title: customer.isNew ? "New Customer Created" : "Customer Selected",
      description: `${customer.name} (${customer.mobile})`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Customer Details
        </CardTitle>
        <CardDescription>
          {customer
            ? `Selected: ${customer.name} (${customer.mobile})`
            : "Search for existing customer or create new one"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            placeholder="Customer name"
            value={name}
            onChange={(e) => handleSearch(e.target.value, "name")}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            id="mobile"
            placeholder="Mobile number"
            value={mobile}
            onChange={(e) => handleSearch(e.target.value, "mobile")}
          />
        </div>

        {suggestions.length > 0 && (
          <div className="mt-2">
            {suggestions.map((customer) => (
              <Button
                key={customer.id}
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2"
                onClick={() => handleSelectCustomer(customer)}>
                <UserPlus className="h-4 w-4 shrink-0" />
                <div className="flex flex-col items-start text-sm truncate">
                  {customer.isNew && (
                    <span className="text-muted-foreground">
                      Create new customer
                    </span>
                  )}
                  <span className="truncate w-full">
                    {customer.name} ({customer.mobile})
                  </span>
                </div>
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
