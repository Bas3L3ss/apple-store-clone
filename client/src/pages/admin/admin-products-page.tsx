import { buttonVariants } from "@/src/components/ui/button";
import { Separator } from "@/src/components/ui/separator";
import { Plus } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { cn } from "@/src/lib/utils";
import { Heading } from "@/src/components/ui/heading";
import ProductListingPage from "@/src/components/dashboard/product/listing-product-table";
import ProductTableAction from "@/src/components/dashboard/product/product-tables/product-table-action";
import { useState } from "react";

export default function ProductPage() {
  const [searchParams] = useSearchParams();
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  return (
    <div className="flex flex-1 flex-col space-y-4">
      <div className="flex items-start justify-between">
        <Heading title="Products" description="Manage products" />
        <Link
          to="/dashboard/product/create"
          className={cn(buttonVariants(), "text-xs md:text-sm")}
        >
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Link>
      </div>
      <Separator />
      <ProductTableAction
        setSelectedProductIds={setSelectedProductIds}
        selectedProductIds={selectedProductIds}
      />

      <ProductListingPage
        setSelectedProductIds={setSelectedProductIds}
        searchParams={searchParams}
      />
    </div>
  );
}
