import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface CartLine {
  id: string;
  product_id: string;
  size: string | null;
  color: string | null;
  quantity: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    price_usd: number;
    price_country: Record<string, number>;
    brand?: { name: string } | null;
  };
}

const LOCAL_KEY = "luxeholic:cart";

function loadLocal(): Array<{
  product_id: string;
  size: string | null;
  color: string | null;
  quantity: number;
}> {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveLocal(items: ReturnType<typeof loadLocal>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  return { user, loading };
}

export function useCart() {
  const { user } = useAuthUser();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    if (user) {
      const { data } = await supabase
        .from("cart_items")
        .select(
          "id, product_id, size, color, quantity, product:products(id, name, slug, images, price_usd, price_country, brand:brands(name))",
        )
        .eq("user_id", user.id);
      setLines((data ?? []) as unknown as CartLine[]);
    } else {
      const local = loadLocal();
      if (local.length === 0) {
        setLines([]);
        setLoading(false);
        return;
      }
      const ids = [...new Set(local.map((l) => l.product_id))];
      const { data: products } = await supabase
        .from("products")
        .select("id, name, slug, images, price_usd, price_country, brand:brands(name)")
        .in("id", ids);
      const map = new Map((products ?? []).map((p: any) => [p.id, p]));
      setLines(
        local
          .map((l, i) => ({
            id: `local-${i}`,
            product_id: l.product_id,
            size: l.size,
            color: l.color,
            quantity: l.quantity,
            product: map.get(l.product_id),
          }))
          .filter((l) => l.product) as CartLine[],
      );
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const add = async (
    product_id: string,
    size: string | null,
    color: string | null,
    quantity = 1,
  ) => {
    if (user) {
      // upsert quantity
      const existing = lines.find(
        (l) => l.product_id === product_id && l.size === size && l.color === color,
      );
      if (existing) {
        await supabase
          .from("cart_items")
          .update({ quantity: existing.quantity + quantity })
          .eq("id", existing.id);
      } else {
        await supabase
          .from("cart_items")
          .insert({ user_id: user.id, product_id, size, color, quantity });
      }
    } else {
      const local = loadLocal();
      const i = local.findIndex(
        (l) => l.product_id === product_id && l.size === size && l.color === color,
      );
      if (i >= 0) local[i].quantity += quantity;
      else local.push({ product_id, size, color, quantity });
      saveLocal(local);
    }
    await refresh();
  };

  const remove = async (line: CartLine) => {
    if (user) {
      await supabase.from("cart_items").delete().eq("id", line.id);
    } else {
      const local = loadLocal().filter(
        (l) =>
          !(l.product_id === line.product_id && l.size === line.size && l.color === line.color),
      );
      saveLocal(local);
    }
    await refresh();
  };

  const updateQty = async (line: CartLine, q: number) => {
    if (q < 1) return remove(line);
    if (user) {
      await supabase.from("cart_items").update({ quantity: q }).eq("id", line.id);
    } else {
      const local = loadLocal();
      const i = local.findIndex(
        (l) => l.product_id === line.product_id && l.size === line.size && l.color === line.color,
      );
      if (i >= 0) {
        local[i].quantity = q;
        saveLocal(local);
      }
    }
    await refresh();
  };

  const clear = async () => {
    if (user) await supabase.from("cart_items").delete().eq("user_id", user.id);
    else saveLocal([]);
    await refresh();
  };

  return { lines, loading, refresh, add, remove, updateQty, clear, user };
}
