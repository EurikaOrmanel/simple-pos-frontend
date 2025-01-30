"use client";

import { useState, useCallback, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/useCartStore";
import Cookies from "js-cookie";
import debounce from "lodash.debounce";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Customer {
  id: string;
  name: string;
  phone: string;
}

function getAuthToken(): string | null {
  const authData = Cookies.get("auth-storage");
  console.log("authData", authData);
  if (!authData) return null;

  try {
    const parsedData = JSON.parse(decodeURIComponent(authData));
    const token = parsedData.state?.token || null;

    return token;
  } catch (error) {
    console.error("Error parsing auth data:", error);
    return null;
  }
}

async function suggestCustomers(query: string): Promise<Customer[]> {
  const token = getAuthToken();
  if (!token) throw new Error("No authentication token found");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/v1/sales_persons/customers/suggest?q=${query}`,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  if (!response.ok) throw new Error("Failed to fetch suggestions");
  return response.json();
}

export function CustomerSearch() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<Customer[]>([]);
  const [lastSearchQuery, setLastSearchQuery] = useState("");
  const setCustomer = useCartStore((state) => state.setCustomer);
  const setPendingCustomer = useCartStore((state) => state.setPendingCustomer);
  const customer = useCartStore((state) => state.customer);
  const { toast } = useToast();

  const resetForm = useCallback(() => {
    setName("");
    setPhone("");
    setSuggestions([]);
    setLastSearchQuery("");
  }, []);

  // Watch for customer being null and reset form
  useEffect(() => {
    if (!customer) {
      resetForm();
    }
  }, [customer, resetForm]);

  const searchCustomers = useCallback(
    async (query: string) => {
      if (query.length < 2 || query === lastSearchQuery) return;

      setIsLoading(true);
      try {
        const results = await suggestCustomers(query);
        setSuggestions(results);
        setLastSearchQuery(query);
      } catch (err) {
        console.error("Failed to fetch suggestions:", err);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            err instanceof Error ? err.message : "Failed to fetch suggestions",
        });
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [lastSearchQuery, toast]
  );

  const debouncedSearch = useMemo(
    () => debounce(searchCustomers, 500),
    [searchCustomers]
  );

  const handleSearch = (query: string, field: "name" | "phone") => {
    if (field === "name") {
      setName(query);

      // Clear suggestions if query is too short
      if (query.length < 2) {
        setSuggestions([]);
        return;
      }

      // Only search if query is significantly different from last search
      const queryDifference = Math.abs(query.length - lastSearchQuery.length);
      const isSignificantChange =
        !lastSearchQuery.includes(query) && !query.includes(lastSearchQuery);

      if (queryDifference > 1 || isSignificantChange) {
        debouncedSearch(query);
      }
    } else {
      setPhone(query);
    }

    // If both name and phone are filled, set as pending customer
    if (name && phone) {
      // Validate phone number format (Ghana phone number format)
      const phoneRegex = /^0(2(0|[3-8])|5(0|[4-7]|9))\d{7}$/;
      console.log("phone", phone);
      if (phoneRegex.test(phone)) {
        console.log("Setting pending customer", name, phone);
        setPendingCustomer(name, phone);
      }
    }
  };

  const handleSelectCustomer = (selectedCustomer: Customer) => {
    setCustomer(selectedCustomer);
    setName(selectedCustomer.name);
    setPhone(selectedCustomer.phone);
    setSuggestions([]);
    setLastSearchQuery(""); // Reset last search query
    toast({
      title: "Customer Selected",
      description: `${selectedCustomer.name} (${selectedCustomer.phone})`,
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
            ? customer.isPending
              ? "New customer will be created when placing order"
              : `Selected: ${customer.name} (${customer.phone})`
            : "Search for existing customer or enter new customer details"}
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
            {suggestions.map((suggestion) => (
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
      </CardContent>
    </Card>
  );
}
