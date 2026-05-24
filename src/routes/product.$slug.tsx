import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCountry, priceFor, formatPrice } from "@/lib/country";
import { useCart } from "@/lib/cart";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/product/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug.replace(/-/g, " ")} — Luxeholic` },
      { name: "description", content: "Discover this piece from the Luxeholic edit." },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="container-luxe py-32 text-center">
      <h1 className="display text-4xl">Piece not found</h1>
      <Link to="/shop" className="mt-6 inline-block eyebrow hover:text-primary">
        ← Return to the edit
      </Link>
    </div>
  ),
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { country } = useCountry();
  const { add } = useCart();
  const [size, setSize] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("*, brand:brands(name, slug)")
        .eq("slug", slug)
        .maybeSingle();
      return data;
    },
  });

  if (isLoading) return <div className="container-luxe py-32 text-center eyebrow">Loading…</div>;
  if (!product) throw notFound();

  const price = priceFor(
    country,
    product.price_country as Record<string, number>,
    Number(product.price_usd),
  );
  const images: string[] = product.images?.length ? product.images : ["/placeholder.svg"];

  const onAdd = async () => {
    if (product.sizes?.length > 1 && !size) {
      toast.error("Please select a size");
      return;
    }
    await add(
      product.id,
      size ?? product.sizes?.[0] ?? null,
      color ?? product.colors?.[0] ?? null,
      1,
    );
    toast.success("Added to shopping bag");
  };

  return (
    <div className="container-luxe py-8 md:py-12">
      <div className="grid gap-8 md:grid-cols-2 md:gap-16">
        <div className="space-y-3">
          {images.map((src, i) => (
            <div key={i} className="aspect-[4/5] overflow-hidden bg-secondary">
              <img
                src={src}
                alt={product.name}
                loading={i === 0 ? "eager" : "lazy"}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>

        <div className="md:sticky md:top-32 md:self-start">
          {product.brand && <p className="eyebrow">{product.brand.name}</p>}
          <h1 className="display mt-3 text-4xl md:text-5xl text-balance">{product.name}</h1>
          <p className="display mt-4 text-2xl">{formatPrice(country, price)}</p>

          <p className="mt-8 max-w-md text-sm leading-relaxed text-foreground/80">
            {product.description}
          </p>

          {product.colors?.length > 0 && (
            <div className="mt-8">
              <p className="eyebrow mb-3">Color · {color ?? product.colors[0]}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c: string) => {
                  const active = (color ?? product.colors[0]) === c;
                  return (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`border px-4 py-2 text-xs ${active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {product.sizes?.length > 1 && (
            <div className="mt-6">
              <p className="eyebrow mb-3">Size</p>
              <div className="grid grid-cols-4 gap-2">
                {product.sizes.map((s: string) => {
                  const active = size === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`border py-3 text-xs ${active ? "border-foreground bg-foreground text-background" : "border-border hover:border-foreground"}`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={onAdd}
            className="mt-10 w-full bg-primary py-5 text-[11px] tracking-[0.35em] uppercase text-primary-foreground transition hover:opacity-90"
          >
            Add to Bag
          </button>

          <p className="eyebrow mt-6 !text-[10px]">
            Complimentary Shipping & Returns · Authenticity Guaranteed
          </p>
        </div>
      </div>
    </div>
  );
}
