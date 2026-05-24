import { useState } from "react";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";
import { useNewArrivals, useCreateOrder } from "@/hooks/useBrandsGateway";
import { createDocument } from "@/integrations/firebase";
import { AuthModal } from "./AuthModal";
import { ProductsShowcase } from "./ProductsShowcase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Heart, Search } from "lucide-react";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  size: string;
  quantity: number;
  image: string;
}

export function LuxuryShop() {
  const { user } = useFirebaseAuth();
  const { data: newArrivals, isLoading } = useNewArrivals(8);
  const createOrderMutation = useCreateOrder();
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = async (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.size === item.size);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.size === item.size
            ? { ...i, quantity: i.quantity + 1 }
            : i,
        );
      }
      return [...prev, item];
    });

    // Save to Firebase if user is logged in
    if (user) {
      await createDocument("cart_items", {
        userId: user.uid,
        ...item,
      });
    }

    toast.success("Added to cart!");
  };

  const addToWishlist = async (productId: string, productName: string) => {
    if (!user) {
      toast.error("Please sign in to add to wishlist");
      return;
    }

    const result = await createDocument("wishlist", {
      userId: user.uid,
      productId,
      productName,
    });

    if (result.error) {
      toast.error("Failed to add to wishlist");
    } else {
      toast.success("Added to wishlist!");
    }
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error("Please sign in to checkout");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    try {
      // Create order via BrandsGateway
      const orderData = {
        items: cart.map((item) => ({
          product_id: item.productId,
          sku: item.productId, // You should use actual SKU
          size: item.size,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: {
          name: user.displayName || "Customer",
          address_line1: "123 Main St", // Should come from user profile
          city: "New York",
          postal_code: "10001",
          country: "US",
          phone: "+1234567890",
        },
      };

      const order = await createOrderMutation.mutateAsync(orderData);

      // Save order to Firebase
      await createDocument("orders", {
        userId: user.uid,
        orderId: order.id,
        orderNumber: order.order_number,
        items: cart,
        total: order.total,
        status: order.status,
      });

      setCart([]);
      toast.success("Order placed successfully!");
    } catch (error) {
      toast.error("Failed to place order");
      console.error("Checkout error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <h1 className="text-2xl font-bold">LUXEHOLIC</h1>
              <nav className="hidden md:flex gap-6">
                <a href="#" className="text-sm hover:underline">
                  Women
                </a>
                <a href="#" className="text-sm hover:underline">
                  Men
                </a>
                <a href="#" className="text-sm hover:underline">
                  Bags
                </a>
                <a href="#" className="text-sm hover:underline">
                  Shoes
                </a>
                <a href="#" className="text-sm hover:underline">
                  Accessories
                </a>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
                    {cart.length}
                  </Badge>
                )}
              </Button>
              <AuthModal />
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[500px] bg-gradient-to-r from-purple-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="max-w-2xl">
            <h2 className="text-5xl font-bold mb-4">Luxury Fashion from Top Brands</h2>
            <p className="text-xl mb-8">
              Discover authentic designer pieces from Gucci, Prada, Versace, and more
            </p>
            <Button size="lg" variant="secondary">
              Shop New Arrivals
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-muted-foreground">Fresh from the runway - Latest luxury pieces</p>
          </div>
          <Button variant="outline">View All</Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-muted h-80 rounded-lg mb-4" />
                <div className="bg-muted h-4 rounded mb-2" />
                <div className="bg-muted h-4 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {newArrivals?.products.slice(0, 4).map((product) => (
              <div key={product.id} className="group cursor-pointer">
                <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                  <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <Button
                      size="icon"
                      variant="secondary"
                      className="rounded-full"
                      onClick={() => addToWishlist(product.id, product.name)}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <h3 className="font-semibold mb-1 line-clamp-1">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold">${product.price.toFixed(2)}</span>
                  <Button
                    size="sm"
                    onClick={() =>
                      addToCart({
                        productId: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        size: product.sizes[0]?.size || "M",
                        quantity: 1,
                        image: product.images[0],
                      })
                    }
                  >
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* All Products */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">All Products</h2>
          <ProductsShowcase />
        </div>
      </section>

      {/* Cart Summary (if items in cart) */}
      {cart.length > 0 && (
        <div className="fixed bottom-4 right-4 bg-background border rounded-lg shadow-lg p-4 max-w-sm">
          <h3 className="font-bold mb-2">Cart Summary</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {cart.length} item(s) - Total: $
            {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
          </p>
          <Button className="w-full" onClick={handleCheckout}>
            Checkout
          </Button>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold mb-4">LUXEHOLIC</h3>
              <p className="text-sm text-muted-foreground">
                Your destination for authentic luxury fashion from the world's top brands.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Women
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Men
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Accessories
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Shipping
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-foreground">
                    Returns
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Connect</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Powered by BrandsGateway & Firebase
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © 2026 Luxeholic. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
