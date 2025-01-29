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
import { useQuery, useMutation } from "@tanstack/react-query";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

interface CustomerInput {
  name: string;
  phone: string;
}

async function suggestCustomers(query: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/sales_persons/customers/suggest?q=${query}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch suggestions");
  return response.json();
}

async function createCustomer(data: CustomerInput) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/sales_persons/customers/`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );
  if (!response.ok) throw new Error("Failed to create customer");
  return response.json();
}

export function CustomerSearch() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const setCustomer = useCartStore((state) => state.setCustomer);
  const customer = useCartStore((state) => state.customer);
  const { toast } = useToast();

  const { data: suggestions = [], isLoading } = useQuery({
    queryKey: ["customerSuggestions", name],
    queryFn: () => suggestCustomers(name),
    enabled: name.length >= 2,
  });

  const createCustomerMutation = useMutation({
    mutationFn: createCustomer,
    onSuccess: (newCustomer) => {
      setCustomer(newCustomer);
      toast({
        title: "Customer Created",
        description: `${newCustomer.name} (${newCustomer.phone})`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create customer. Please try again.",
      });
    },
  });

  const handleSearch = (query: string, field: "name" | "phone") => {
    if (field === "name") setName(query);
    else setPhone(query);
  };

  const handleSelectCustomer = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    setName(selectedCustomer.name);
    setPhone(selectedCustomer.phone);
    toast({
      title: "Customer Selected",
      description: `${selectedCustomer.name} (${selectedCustomer.phone})`,
    });
  };

  const handleCreateCustomer = () => {
    if (!name || !phone) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in both name and phone number",
      });
      return;
    }

    // Validate phone number format (Ghana phone number format)
    const phoneRegex = /^0(2(0|[3-8])|5(0|[4-7]|9))\d{7}$/;
    if (!phoneRegex.test(phone)) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a valid Ghana phone number",
      });
      return;
    }

    createCustomerMutation.mutate({ name, phone });
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
            ? `Selected: ${customer.name} (${customer.phone})`
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
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="Phone number (e.g., 0241234567)"
            value={phone}
            onChange={(e) => handleSearch(e.target.value, "phone")}
          />
        </div>

        {isLoading && (
          <div className="text-sm text-muted-foreground">
            Loading suggestions...
          </div>
        )}

        {suggestions.length > 0 && (
          <div className="mt-2 space-y-1">
            {suggestions.map((suggestion: Customer) => (
              <Button
                key={suggestion.id}
                variant="ghost"
                className="w-full justify-start gap-2 h-auto py-2"
                onClick={() => handleSelectCustomer(suggestion)}>
                <User className="h-4 w-4 shrink-0" />
                <div className="flex flex-col items-start text-sm truncate">
                  <span className="truncate w-full">
                    {suggestion.name} ({suggestion.phone})
                  </span>
                </div>
              </Button>
            ))}
          </div>
        )}

        {name && phone && !customer && (
          <Button
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={handleCreateCustomer}
            disabled={createCustomerMutation.isPending}>
            <UserPlus className="h-4 w-4" />
            {createCustomerMutation.isPending
              ? "Creating..."
              : "Create New Customer"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
