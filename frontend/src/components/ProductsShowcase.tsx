import { useState } from "react";
import { useProducts, useBrands, useCategories } from "@/hooks/useBrandsGateway";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

export function ProductsShowcase() {
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [page, setPage] = useState(1);

  // Fetch data using BrandsGateway hooks
  const { data: productsData, isLoading: productsLoading } = useProducts({
    brand: selectedBrand || undefined,
    category: selectedCategory || undefined,
    page,
    limit: 12,
  });

  const { data: brands, isLoading: brandsLoading } = useBrands();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  const handleResetFilters = () => {
    setSelectedBrand("");
    setSelectedCategory("");
    setPage(1);
  };

  if (productsLoading && page === 1) {
    return (
      <div className="container mx-auto py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-48 w-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Filters */}
      <div className="mb-8 flex flex-wrap gap-4 items-center">
        <div className="flex-1 min-w-[200px]">
          <Select value={selectedBrand} onValueChange={setSelectedBrand}>
            <SelectTrigger>
              <SelectValue placeholder="Select Brand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              {brands?.map((brand) => (
                <SelectItem key={brand.id} value={brand.name}>
                  {brand.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {categories?.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={handleResetFilters}>
          Reset Filters
        </Button>
      </div>

      {/* Products Grid */}
      {productsData?.products && productsData.products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productsData.products.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-square">
                    <img
                      src={product.images[0] || "/placeholder.jpg"}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {!product.is_available && (
                      <Badge className="absolute top-2 right-2" variant="destructive">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="text-lg mb-2 line-clamp-2">{product.name}</CardTitle>
                  <CardDescription className="mb-2">{product.brand}</CardDescription>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">
                      {product.currency} {product.price.toFixed(2)}
                    </span>
                    {product.retail_price > product.price && (
                      <span className="text-sm text-muted-foreground line-through">
                        {product.currency} {product.retail_price.toFixed(2)}
                      </span>
                    )}
                  </div>
                  {product.sizes && product.sizes.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.sizes.slice(0, 5).map((size, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {size.size}
                        </Badge>
                      ))}
                      {product.sizes.length > 5 && (
                        <Badge variant="outline" className="text-xs">
                          +{product.sizes.length - 5}
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" disabled={!product.is_available}>
                    {product.is_available ? "View Details" : "Out of Stock"}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {productsData.total_pages > 1 && (
            <div className="mt-8 flex justify-center gap-2">
              <Button
                variant="outline"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-2 px-4">
                <span>
                  Page {page} of {productsData.total_pages}
                </span>
              </div>
              <Button
                variant="outline"
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= productsData.total_pages}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found</p>
          <Button className="mt-4" onClick={handleResetFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
