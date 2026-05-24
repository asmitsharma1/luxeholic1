import { Link } from "@tanstack/react-router";
import { Search, User, ShoppingBag, Menu, X, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { useCountry, COUNTRIES, type Country } from "@/lib/country";
import { useCart, useAuthUser } from "@/lib/cart";

const NAV: Array<{ label: string; to: string; params?: Record<string, string> }> = [
  { label: "Women", to: "/shop", params: { gender: "women" } },
  { label: "Men", to: "/shop", params: { gender: "men" } },
  { label: "Handbags", to: "/shop", params: { category: "handbags" } },
  { label: "Shoes", to: "/shop", params: { category: "shoes" } },
  { label: "Maisons", to: "/maisons" },
  { label: "New Arrivals", to: "/shop", params: { sort: "new" } },
];

export function SiteHeader() {
  const { country, setCountry } = useCountry();
  const [openCountry, setOpenCountry] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { lines } = useCart();
  const { user } = useAuthUser();
  const count = lines.reduce((a, l) => a + l.quantity, 0);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/95 backdrop-blur border-b border-border"
            : "bg-background border-b border-transparent"
        }`}
      >
        <div className="container-luxe flex h-16 items-center justify-between gap-4 md:h-20">
          <button
            onClick={() => setOpenMenu(true)}
            className="flex items-center gap-2 text-xs tracking-[0.3em] uppercase text-foreground/80 hover:text-foreground md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden md:flex items-center gap-6 flex-1">
            <button
              onClick={() => setOpenCountry((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] tracking-[0.32em] uppercase text-foreground/70 hover:text-foreground"
            >
              {COUNTRIES[country].label}
              <ChevronDown className="h-3 w-3" />
            </button>
            {openCountry && (
              <div className="absolute left-10 top-16 z-50 w-48 bg-card border border-border shadow-lg">
                {(Object.keys(COUNTRIES) as Country[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCountry(c);
                      setOpenCountry(false);
                    }}
                    className="flex w-full items-center justify-between px-5 py-3 text-[11px] tracking-[0.32em] uppercase hover:bg-secondary"
                  >
                    {COUNTRIES[c].label}
                    {c === country && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/" className="flex-1 text-center md:flex-none">
            <span className="display text-2xl tracking-[0.25em] md:text-3xl md:tracking-[0.35em]">
              LUXEHOLIC
            </span>
          </Link>

          <div className="flex flex-1 items-center justify-end gap-4 md:gap-6">
            <Link
              to="/shop"
              search={{ q: "" }}
              className="hidden md:inline-flex hover:text-primary"
              aria-label="Search"
            >
              <Search className="h-[18px] w-[18px]" />
            </Link>
            <Link
              to={user ? "/account" : "/auth"}
              className="hover:text-primary"
              aria-label="Account"
            >
              <User className="h-[18px] w-[18px]" />
            </Link>
            <Link to="/cart" className="relative hover:text-primary" aria-label="Cart">
              <ShoppingBag className="h-[18px] w-[18px]" />
              {count > 0 && (
                <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                  {count}
                </span>
              )}
            </Link>
            <button
              onClick={() => setOpenMenu(true)}
              className="hidden md:inline-flex items-center gap-2 text-[11px] tracking-[0.32em] uppercase hover:text-primary"
            >
              <Menu className="h-4 w-4" /> Menu
            </button>
          </div>
        </div>

        {/* Inline category nav */}
        <nav className="hidden md:block border-t border-border/60">
          <ul className="container-luxe flex items-center justify-center gap-10 py-3">
            {NAV.map((item) => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  search={item.params as never}
                  className="text-[11px] tracking-[0.32em] uppercase text-foreground/70 transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {openMenu && (
        <div className="fixed inset-0 z-50 bg-background fade-up">
          <div className="container-luxe flex h-16 items-center justify-between md:h-20">
            <span className="display text-2xl tracking-[0.25em] md:text-3xl md:tracking-[0.35em]">
              LUXEHOLIC
            </span>
            <button onClick={() => setOpenMenu(false)} aria-label="Close menu">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="container-luxe pt-8">
            <ul className="space-y-5">
              {NAV.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    search={item.params as never}
                    onClick={() => setOpenMenu(false)}
                    className="display text-5xl md:text-7xl hover:italic"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="hairline my-10" />
            <div className="space-y-3 text-[11px] tracking-[0.32em] uppercase text-foreground/70">
              <Link
                to={user ? "/account" : "/auth"}
                onClick={() => setOpenMenu(false)}
                className="block hover:text-primary"
              >
                {user ? "Account" : "Sign in / Create account"}
              </Link>
              <Link
                to="/cart"
                onClick={() => setOpenMenu(false)}
                className="block hover:text-primary"
              >
                Shopping bag
              </Link>
              <p className="pt-4">Shipping to {COUNTRIES[country].label}</p>
              <div className="flex gap-4">
                {(Object.keys(COUNTRIES) as Country[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCountry(c);
                    }}
                    className={`hover:text-primary ${c === country ? "text-primary" : ""}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
