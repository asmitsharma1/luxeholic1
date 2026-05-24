import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "@/lib/cart";
import { useCountry, priceFor, formatPrice } from "@/lib/country";
import { Minus, Plus, X } from "lucide-react";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Shopping Bag — Luxeholic" }] }),
  component: CartPage,
});

function CartPage() {
  const { lines, remove, updateQty, loading } = useCart();
  const { country } = useCountry();
  const navigate = useNavigate();

  const subtotal = lines.reduce(
    (a, l) => a + priceFor(country, l.product.price_country, l.product.price_usd) * l.quantity,
    0,
  );

  return (
    <div className="container-luxe py-12 md:py-16">
      <p className="eyebrow">Shopping Bag</p>
      <h1 className="display mt-2 text-5xl md:text-7xl">Your Bag.</h1>

      {loading ? (
        <p className="mt-20 text-center eyebrow">Loading…</p>
      ) : lines.length === 0 ? (
        <div className="mt-20 text-center">
          <p className="text-muted-foreground">Your bag is currently empty.</p>
          <Link
            to="/shop"
            className="mt-6 inline-block bg-primary px-10 py-4 text-[11px] tracking-[0.35em] uppercase text-primary-foreground hover:opacity-90"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
          <div className="divide-y divide-border">
            {lines.map((line) => {
              const price = priceFor(country, line.product.price_country, line.product.price_usd);
              return (
                <div key={line.id} className="flex gap-6 py-6">
                  <Link
                    to="/product/$slug"
                    params={{ slug: line.product.slug }}
                    className="w-28 shrink-0"
                  >
                    <img
                      src={line.product.images[0]}
                      alt={line.product.name}
                      className="aspect-[4/5] w-full object-cover bg-secondary"
                    />
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {line.product.brand && <p className="eyebrow">{line.product.brand.name}</p>}
                        <Link
                          to="/product/$slug"
                          params={{ slug: line.product.slug }}
                          className="display mt-1 text-xl hover:text-primary"
                        >
                          {line.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {[line.size, line.color].filter(Boolean).join(" · ")}
                        </p>
                      </div>
                      <button onClick={() => remove(line)} aria-label="Remove">
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-4">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQty(line, line.quantity - 1)}
                          className="px-3 py-2"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm">{line.quantity}</span>
                        <button
                          onClick={() => updateQty(line, line.quantity + 1)}
                          className="px-3 py-2"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="display text-lg">
                        {formatPrice(country, price * line.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="h-fit border border-border bg-card p-8 lg:sticky lg:top-32">
            <p className="eyebrow">Order Summary</p>
            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>{formatPrice(country, subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Shipping</span>
                <span>Complimentary</span>
              </div>
            </div>
            <div className="hairline my-6" />
            <div className="flex justify-between">
              <span className="eyebrow">Total</span>
              <span className="display text-2xl">{formatPrice(country, subtotal)}</span>
            </div>
            <button
              onClick={() => navigate({ to: "/checkout" })}
              className="mt-8 w-full bg-primary py-4 text-[11px] tracking-[0.35em] uppercase text-primary-foreground hover:opacity-90"
            >
              Proceed to Checkout
            </button>
            <p className="mt-4 text-center text-[10px] tracking-[0.3em] uppercase text-muted-foreground">
              Shipping & taxes calculated at checkout
            </p>
          </aside>
        </div>
      )}
    </div>
  );
}
