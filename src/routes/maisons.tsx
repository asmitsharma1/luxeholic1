import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/maisons")({
  head: () => ({
    meta: [
      { title: "Maisons — Luxeholic" },
      { name: "description", content: "The houses we curate." },
    ],
  }),
  component: Maisons,
});

function Maisons() {
  const { data: brands = [] } = useQuery({
    queryKey: ["all-brands"],
    queryFn: async () => {
      const { data } = await supabase.from("brands").select("*").order("name");
      return data ?? [];
    },
  });

  return (
    <div className="container-luxe py-12 md:py-20">
      <p className="eyebrow text-center">Curated Maisons</p>
      <h1 className="display mt-3 text-center text-5xl md:text-7xl text-balance">
        The Houses we keep.
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-center text-foreground/70">
        Luxeholic partners with the world's most coveted Maisons to bring you a single, considered
        edit of pieces, authenticated and shipped with care across Australia, New Zealand and India.
      </p>

      <div className="mt-16 divide-y divide-border border-y border-border">
        {brands.map((b) => (
          <Link
            key={b.id}
            to="/shop"
            search={{ brand: b.slug } as never}
            className="group flex flex-col gap-3 py-8 md:flex-row md:items-center md:justify-between"
          >
            <h2 className="display text-4xl md:text-6xl group-hover:italic">{b.name}</h2>
            <p className="max-w-md text-sm text-foreground/70">{b.description}</p>
            <span className="eyebrow group-hover:text-primary">View →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
