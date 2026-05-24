import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductCard, type ProductCardData } from "@/components/ProductCard";
import heroImg from "@/assets/hero.jpg";
import catBags from "@/assets/cat-bags.jpg";
import catWomen from "@/assets/cat-women.jpg";
import catMen from "@/assets/cat-men.jpg";
import catShoes from "@/assets/cat-shoes.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Luxeholic — The Maison of Premium Houses" },
      {
        name: "description",
        content:
          "Curated luxury from Gucci, Prada, Balenciaga, Saint Laurent. Shipping across Australia, New Zealand, India.",
      },
      { property: "og:title", content: "Luxeholic — The Maison of Premium Houses" },
      { property: "og:image", content: heroImg },
    ],
  }),
  component: Index,
});

const CATEGORIES = [
  { label: "Women", to: "/shop", params: { gender: "women" }, img: catWomen },
  { label: "Men", to: "/shop", params: { gender: "men" }, img: catMen },
  { label: "Handbags", to: "/shop", params: { category: "handbags" }, img: catBags },
  { label: "Shoes", to: "/shop", params: { category: "shoes" }, img: catShoes },
];

function Index() {
  const { data: featured = [] } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await supabase
        .from("products")
        .select("id, slug, name, images, price_usd, price_country, brand:brands(name)")
        .eq("featured", true)
        .limit(8);
      return (data ?? []) as unknown as ProductCardData[];
    },
  });

  const { data: brands = [] } = useQuery({
    queryKey: ["brands"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("slug, name");
      return data ?? [];
    },
  });

  return (
    <>
      {/* Hero */}
      <section className="relative h-[80vh] min-h-[600px] w-full overflow-hidden">
        <img
          src={heroImg}
          alt="Luxeholic Spring · Summer Edition"
          width={1600}
          height={1920}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />
        <div className="relative z-10 flex h-full items-end">
          <div className="container-luxe pb-16 text-cream">
            <p className="eyebrow !text-cream/80 fade-up">Spring · Summer Edition</p>
            <h1
              className="display mt-4 text-5xl leading-[1.05] text-balance text-cream md:text-7xl lg:text-8xl fade-up"
              style={{ animationDelay: "100ms" }}
            >
              The art of living,
              <br />
              beautifully dressed.
            </h1>
            <div className="mt-10 fade-up" style={{ animationDelay: "240ms" }}>
              <Link
                to="/shop"
                className="inline-flex items-center bg-cream px-10 py-4 text-[11px] tracking-[0.35em] uppercase text-oxblood transition hover:bg-cream/90"
              >
                Discover the Edit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Curated universe */}
      <section className="container-luxe py-20 md:py-28">
        <div className="text-center">
          <p className="eyebrow">Curated Universe</p>
          <h2 className="display mt-3 text-4xl text-balance md:text-6xl">
            The Houses, the Hands, the Heritage.
          </h2>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.label}
              to={c.to}
              search={c.params as never}
              className="group relative block aspect-[3/4] overflow-hidden bg-secondary"
            >
              <img
                src={c.img}
                alt={c.label}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end p-6 text-cream">
                <h3 className="display text-3xl md:text-4xl">{c.label}</h3>
                <p className="mt-2 text-[10px] tracking-[0.4em] uppercase opacity-90">Discover →</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The Edit */}
      <section className="container-luxe pb-20 md:pb-28">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Curated Selection</p>
            <h2 className="display mt-2 text-4xl md:text-6xl">The Edit.</h2>
          </div>
          <Link to="/shop" className="text-[11px] tracking-[0.35em] uppercase hover:text-primary">
            View All →
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4">
          {featured.map((p) => (
            <ProductCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* Maisons strip */}
      <section className="border-y border-border bg-secondary/50 py-12">
        <div className="container-luxe">
          <p className="eyebrow text-center mb-6">The Maisons We Carry</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4 md:gap-x-16">
            {brands.map((b) => (
              <li key={b.slug}>
                <Link
                  to="/maisons"
                  className="display text-2xl tracking-wide hover:text-primary md:text-3xl"
                >
                  {b.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
