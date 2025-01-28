"use client";

import { ProductForm } from "@/components/admin/ProductForm";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home, Info } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddProductPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Breadcrumb Navigation */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">
              <Home className="h-4 w-4" />
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin/products">Products</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Add New Product</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Add New Product</h1>
          <p className="text-muted-foreground mt-1">
            Create a new product in your inventory
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Button>
      </div>

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <ProductForm />
          </CardContent>
        </Card>

        {/* Help Section */}
        <div className="space-y-6">
          {/* Tips Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Tips for adding products</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>
                    Use clear, descriptive product names that customers can
                    easily understand
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>
                    Add detailed descriptions highlighting key features and
                    benefits
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>
                    Set competitive prices and maintain accurate inventory
                    levels
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>
                    Upload high-quality product images (recommended size:
                    1200x1200px)
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>
                    Use unique SKU numbers following your naming convention
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Requirements Card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Info className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold">Requirements</h3>
              </div>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>Product name: Minimum 2 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>Description: Minimum 10 characters</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>Price: Must be a positive number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>SKU: Required, must be unique</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="select-none">•</span>
                  <span>Quantity: Must be 0 or greater</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
