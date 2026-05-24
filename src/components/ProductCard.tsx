import { Link } from "@tanstack/react-router";
import { useCountry, priceFor, formatPrice } from "@/lib/country";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  images: string[];
  price_usd: number;
  price_country: Record<string, number> | null;
  brand?: { name: string } | null;
}

export function ProductCard({ p }: { p: ProductCardData }) {
  const { country } = useCountry();
  const price = priceFor(country, p.price_country, p.price_usd);
  return (
    <Link to="/product/$slug" params={{ slug: p.slug }} className="group block">
      <div className="aspect-[4/5] overflow-hidden bg-secondary">
        <img
          src={p.images[0] || "/placeholder.svg"}
          alt={p.name}
          loading="lazy"
          width={800}
          height={1000}
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="pt-4">
        {p.brand && <p className="eyebrow">{p.brand.name}</p>}
        <h3 className="display mt-1 text-xl leading-tight">{p.name}</h3>
        <p className="mt-2 text-sm text-foreground/80">{formatPrice(country, price)}</p>
      </div>
    </Link>
  );
}
