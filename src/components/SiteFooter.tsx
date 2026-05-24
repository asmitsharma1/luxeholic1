import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-background mt-24">
      <div className="container-luxe grid gap-12 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <p className="eyebrow mb-3">Newsletter</p>
          <h3 className="display text-3xl md:text-4xl leading-tight text-balance">
            An invitation to the world of Luxeholic.
          </h3>
          <form
            className="mt-6 flex max-w-md border-b border-foreground"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="email"
              placeholder="Email address"
              className="flex-1 bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button className="text-[11px] tracking-[0.32em] uppercase">Subscribe →</button>
          </form>
        </div>
        <FooterCol
          title="Maison"
          links={[
            { label: "About", to: "/maisons" },
            { label: "Heritage", to: "/maisons" },
            { label: "Sustainability", to: "/maisons" },
          ]}
        />
        <FooterCol
          title="Shop"
          links={[
            { label: "Women", to: "/shop", params: { gender: "women" } },
            { label: "Men", to: "/shop", params: { gender: "men" } },
            { label: "Handbags", to: "/shop", params: { category: "handbags" } },
            { label: "Shoes", to: "/shop", params: { category: "shoes" } },
          ]}
        />
        <FooterCol
          title="Care"
          links={[
            { label: "Client services", to: "/auth" },
            { label: "Shipping", to: "/shop" },
            { label: "Returns", to: "/shop" },
          ]}
        />
      </div>
      <div className="border-t border-border">
        <div className="container-luxe flex flex-col items-center justify-between gap-3 py-6 text-[10px] tracking-[0.3em] uppercase text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} Luxeholic Maison. All rights reserved.</p>
          <p>Curated in Australia · Shipped worldwide</p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: Array<{ label: string; to: string; params?: Record<string, string> }>;
}) {
  return (
    <div>
      <p className="eyebrow mb-4">{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link
              to={l.to}
              search={l.params as never}
              className="text-sm text-foreground/80 hover:text-primary"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
