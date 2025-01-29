"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { productsApi } from "@/lib/api/products";
import { API_BASE_URL } from "@/lib/api/client";

const productFormSchema = z.object({
  name: z.string().min(2, {
    message: "Product name must be at least 2 characters.",
  }),
  price: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Price must be a valid positive number.",
  }),
  image: z.string().min(1, {
    message: "Image is required.",
  }),
});

type ProductFormValues = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  mode?: "create" | "edit";
  productId?: string;
}

export function ProductForm({ mode = "create", productId }: ProductFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      price: "",
      image: "",
    },
  });

  // Fetch product data when in edit mode
  useEffect(() => {
    async function fetchProduct() {
      if (mode === "edit" && productId) {
        try {
          setIsLoading(true);
          const product = await productsApi.getById(productId);

          form.reset({
            name: product.name,
            price: product.price,
            image: product.image,
          });

          if (product.image) {
            setImagePreview(API_BASE_URL + product.image);
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast({
            title: "Error",
            description: "Failed to load product data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      }
    }

    fetchProduct();
  }, [mode, productId, form]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        const preview = reader.result as string;
        setImagePreview(preview);
        form.setValue("image", preview, { shouldValidate: true });
      };
      reader.readAsDataURL(file);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOut = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleImageRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setImageFile(null);
    setImagePreview(null);
    form.setValue("image", "", { shouldValidate: true });
  };

  async function onSubmit(data: ProductFormValues) {
    try {
      setIsLoading(true);

      // Upload image if we have one
      let imageUrl = "";

      if (imageFile) {
        const uploadResult = await productsApi.uploadImage(imageFile);
        console.log("Upload result", uploadResult);

        imageUrl = "/media/image/" + uploadResult.image;
        // Set the form image field to the uploaded URL
        form.setValue("image", imageUrl);
        // log the form data
        console.log("Form data", form.getValues());
      } else if (mode === "edit") {
        // If we're editing and no new image was uploaded, keep the existing image
        imageUrl = data.image;
      }

      const productData = {
        name: data.name,
        price: parseFloat(data.price),
        image: imageUrl,
      };

      if (mode === "edit" && productId) {
        // Update existing product
        await productsApi.update(productId, productData);

        toast({
          title: "Product updated successfully",
          description: "Your product has been updated in the catalog.",
        });
      } else {
        // Create new product
        await productsApi.create(productData);

        toast({
          title: "Product created successfully",
          description: "Your product has been added to the catalog.",
        });
      }

      form.reset();
      setImageFile(null);
      setImagePreview(null);

      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error handling product:", error);

      let errorMessage = "Something went wrong. Please try again.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-6">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Image</FormLabel>
                <FormControl>
                  <div
                    className={cn(
                      "border-2 border-dashed rounded-lg p-8 transition-colors",
                      "hover:border-primary/50 hover:bg-muted/50",
                      isDragging && "border-primary/50 bg-muted/50",
                      "cursor-pointer text-center"
                    )}
                    onDragEnter={handleDragIn}
                    onDragLeave={handleDragOut}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() =>
                      document.getElementById("image-upload")?.click()
                    }>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <input
                      type="hidden"
                      {...field}
                      value={imagePreview || ""}
                    />
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="mx-auto relative aspect-video w-full max-w-3xl overflow-hidden rounded-lg border">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleImageRemove}>
                          Remove image
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                          <span className="font-semibold">Click to upload</span>{" "}
                          or drag and drop
                        </div>
                        <div className="text-xs text-muted-foreground">
                          SVG, PNG, JPG or GIF (max. 2MB)
                        </div>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Product Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter product name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "edit" ? "Update Product" : "Create Product"}
        </Button>
      </form>
    </Form>
  );
}
