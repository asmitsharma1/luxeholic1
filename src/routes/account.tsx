import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthUser } from "@/lib/cart";
import { useCountry, formatPrice } from "@/lib/country";
import type { Country } from "@/lib/country";
import { toast } from "sonner";

export const Route = createFileRoute("/account")({
  head: () => ({ meta: [{ title: "Account — Luxeholic" }] }),
  component: Account,
});

function Account() {
  const { user, loading } = useAuthUser();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [user, loading, navigate]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("orders")
      .select("*, items:order_items(*)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders(data ?? []));
  }, [user]);

  if (!user) return null;

  return (
    <div className="container-luxe py-12 md:py-16">
      <p className="eyebrow">My Maison</p>
      <h1 className="display mt-2 text-5xl md:text-6xl">Welcome.</h1>
      <p className="mt-2 text-muted-foreground">{user.email}</p>
      <button
        onClick={async () => {
          await supabase.auth.signOut();
          toast.success("Signed out");
          navigate({ to: "/" });
        }}
        className="mt-2 text-[11px] tracking-[0.3em] uppercase underline hover:text-primary"
      >
        Sign out
      </button>

      <div className="mt-16">
        <h2 className="display text-3xl">Orders</h2>
        <div className="hairline mt-4" />
        {orders.length === 0 ? (
          <p className="mt-8 text-muted-foreground text-sm">
            No orders yet.{" "}
            <Link to="/shop" className="underline">
              Discover the edit →
            </Link>
          </p>
        ) : (
          <ul className="mt-6 divide-y divide-border">
            {orders.map((o) => (
              <li key={o.id} className="py-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="eyebrow">
                      Order #{o.id.slice(0, 8)} · {new Date(o.created_at).toLocaleDateString()}
                    </p>
                    <p className="display text-lg mt-1">{o.items?.length ?? 0} items</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase tracking-widest text-muted-foreground">
                      {o.status}
                    </p>
                    <p className="display text-xl">
                      {formatPrice(o.country as Country, Number(o.total))}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
