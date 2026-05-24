import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart";
import { useCountry, priceFor, formatPrice, COUNTRIES } from "@/lib/country";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — Luxeholic" }] }),
  component: Checkout,
});

function Checkout() {
  const { lines, clear, user } = useCart();
  const { country } = useCountry();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", city: "", postcode: "", phone: "" });

  useEffect(() => {
    if (!user) navigate({ to: "/auth" });
  }, [user, navigate]);

  const subtotal = lines.reduce(
    (a, l) => a + priceFor(country, l.product.price_country, l.product.price_usd) * l.quantity,
    0,
  );

  const placeOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || lines.length === 0) return;
    setBusy(true);
    try {
      const { data: order, error } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          country,
          currency: COUNTRIES[country].currency,
          subtotal,
          total: subtotal,
          shipping_address: form,
        })
        .select()
        .single();
      if (error) throw error;

      const items = lines.map((l) => ({
        order_id: order.id,
        product_id: l.product_id,
        product_snapshot: {
          name: l.product.name,
          image: l.product.images[0],
          brand: l.product.brand?.name,
        },
        size: l.size,
        color: l.color,
        quantity: l.quantity,
        unit_price: priceFor(country, l.product.price_country, l.product.price_usd),
      }));
      await supabase.from("order_items").insert(items);
      await clear();
      toast.success("Order placed. Payment to follow.");
      navigate({ to: "/account" });
    } catch (err: any) {
      toast.error(err.message ?? "Could not place order");
    } finally {
      setBusy(false);
    }
  };

  if (lines.length === 0) {
    return (
      <div className="container-luxe py-24 text-center">
        <h1 className="display text-4xl">Your bag is empty</h1>
        <Link to="/shop" className="mt-6 inline-block eyebrow hover:text-primary">
          ← Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="container-luxe py-12">
      <p className="eyebrow">Checkout</p>
      <h1 className="display mt-2 text-5xl md:text-6xl">Almost yours.</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_400px]">
        <form onSubmit={placeOrder} className="space-y-5">
          <p className="eyebrow">Shipping Address</p>
          {(["name", "address", "city", "postcode", "phone"] as const).map((k) => (
            <div key={k}>
              <label className="eyebrow capitalize">{k}</label>
              <input
                required
                value={form[k]}
                onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                className="mt-2 w-full border-b border-foreground bg-transparent py-3 text-sm outline-none focus:border-primary"
              />
            </div>
          ))}
          <button
            disabled={busy}
            className="w-full bg-primary py-4 text-[11px] tracking-[0.35em] uppercase text-primary-foreground disabled:opacity-50"
          >
            {busy ? "…" : "Place Order"}
          </button>
          <p className="text-xs text-muted-foreground">
            Payment gateway (PayPal) connects in the next iteration. Order is recorded as{" "}
            <em>pending</em>.
          </p>
        </form>

        <aside className="h-fit border border-border bg-card p-6">
          <p className="eyebrow mb-4">Order Summary</p>
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={l.id} className="flex justify-between text-sm">
                <span className="line-clamp-1">
                  {l.product.name} × {l.quantity}
                </span>
                <span>
                  {formatPrice(
                    country,
                    priceFor(country, l.product.price_country, l.product.price_usd) * l.quantity,
                  )}
                </span>
              </li>
            ))}
          </ul>
          <div className="hairline my-4" />
          <div className="flex justify-between">
            <span className="eyebrow">Total</span>
            <span className="display text-2xl">{formatPrice(country, subtotal)}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
