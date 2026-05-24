import { createContext, useContext } from "react";

export type Country = "AU" | "NZ" | "IN";

export const COUNTRIES: Record<
  Country,
  { label: string; currency: string; symbol: string; locale: string }
> = {
  AU: { label: "Australia", currency: "AUD", symbol: "A$", locale: "en-AU" },
  NZ: { label: "New Zealand", currency: "NZD", symbol: "NZ$", locale: "en-NZ" },
  IN: { label: "India", currency: "INR", symbol: "₹", locale: "en-IN" },
};

export const CountryContext = createContext<{
  country: Country;
  setCountry: (c: Country) => void;
}>({ country: "AU", setCountry: () => {} });

export function useCountry() {
  return useContext(CountryContext);
}

export function priceFor(
  country: Country,
  priceCountry: Record<string, number> | null | undefined,
  priceUsd: number,
): number {
  const v = priceCountry?.[country];
  if (typeof v === "number") return v;
  // sensible fallback multipliers
  const mult: Record<Country, number> = { AU: 1.55, NZ: 1.7, IN: 84 };
  return Math.round(priceUsd * mult[country]);
}

export function formatPrice(country: Country, amount: number): string {
  const { currency, locale } = COUNTRIES[country];
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
