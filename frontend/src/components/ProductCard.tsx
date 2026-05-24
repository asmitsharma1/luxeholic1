import { Link } from "react-router-dom";

export interface ProductCardData {
  id: string;
  slug: string;
  name: string;
  images: string[];
  price_usd: number;
  price_country?: Record<string, number> | null;
  brand?: { name: string } | null;
}

export function ProductCard({ p }: { p: ProductCardData }) {
  // Simple price formatting - can be enhanced with country logic later
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Link to={`/product/${p.slug}`} className="group block">
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
        <p className="mt-2 text-sm text-foreground/80">{formatPrice(p.price_usd)}</p>
      </div>
    </Link>
  );
}
