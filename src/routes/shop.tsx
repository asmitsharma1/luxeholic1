import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import { useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  category: z.string().optional(),
  gender: z.string().optional(),
  brand: z.string().optional(),
  sort: z.string().optional(),
  q: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Shop — Luxeholic" },
      {
        name: "description",
        content: "Shop the full curated edit of premium fashion, handbags, shoes and accessories.",
      },
    ],
  }),
  component: Shop,
});

const CATEGORIES = ["all", "dresses", "handbags", "shoes", "outerwear", "accessories"];

function Shop() {
  const search = Route.useSearch();
  const navigate = Route.useNavigate();
  const [q, setQ] = useState(search.q ?? "");

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products", search],
    queryFn: async () => {
      let query = supabase
        .from("products")
        .select(
          "id, slug, name, images, price_usd, price_country, category, gender, brand:brands(name, slug)",
        );
      if (search.category) query = query.eq("category", search.category);
      if (search.gender) query = query.eq("gender", search.gender);
      if (search.q) query = query.ilike("name", `%${search.q}%`);
      if (search.sort === "new") query = query.order("created_at", { ascending: false });
      else query = query.order("featured", { ascending: false });
      const { data } = await query;
      return (data ?? []) as unknown as Array<
        ProductCardData & { category: string; brand: { slug: string; name: string } | null }
      >;
    },
  });

  const filtered = search.brand ? products.filter((p) => p.brand?.slug === search.brand) : products;

  return (
    <div className="container-luxe py-12 md:py-16">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">{search.gender ? `For ${search.gender}` : "All Categories"}</p>
          <h1 className="display mt-2 text-5xl md:text-7xl capitalize">
            {search.category ?? search.gender ?? "The Edit"}.
          </h1>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ search: (s: z.infer<typeof searchSchema>) => ({ ...s, q }) });
          }}
          className="flex w-full max-w-xs border-b border-foreground"
        >
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the maison…"
            className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button className="text-[11px] tracking-[0.3em] uppercase">Search</button>
        </form>
      </div>

      <div className="hairline mt-8" />

      <div className="flex flex-wrap gap-x-6 gap-y-3 py-6">
        {CATEGORIES.map((c) => {
          const active = (c === "all" && !search.category) || c === search.category;
          return (
            <button
              key={c}
              onClick={() =>
                navigate({
                  search: (s: z.infer<typeof searchSchema>) => ({
                    ...s,
                    category: c === "all" ? undefined : c,
                  }),
                })
              }
              className={`text-[11px] tracking-[0.3em] uppercase transition ${
                active
                  ? "text-primary border-b border-primary pb-1"
                  : "text-foreground/60 hover:text-foreground"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="hairline mb-10" />

      {isLoading ? (
        <p className="text-center py-20 eyebrow">Curating…</p>
      ) : filtered.length === 0 ? (
        <p className="text-center py-20 text-muted-foreground">No pieces match your selection.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      )}
    </div>
  );
}
