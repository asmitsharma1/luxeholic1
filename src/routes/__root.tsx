import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState } from "react";

import appCss from "../styles.css?url";
import { CountryContext, type Country } from "@/lib/country";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow mb-4">404</p>
        <h1 className="display text-5xl text-foreground">Page not found</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          The page you're looking for has been moved or no longer exists.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary px-8 py-3 text-xs tracking-[0.3em] uppercase text-primary-foreground transition hover:opacity-90"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="display text-3xl">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong on our end.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="bg-primary px-6 py-2.5 text-xs tracking-[0.3em] uppercase text-primary-foreground hover:opacity-90"
          >
            Try again
          </button>
          <a
            href="/"
            className="border border-input px-6 py-2.5 text-xs tracking-[0.3em] uppercase hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Luxeholic — The Maison of Premium Houses" },
      {
        name: "description",
        content:
          "Luxeholic. Curated luxury from Gucci, Prada, Balenciaga, Saint Laurent and more. Shipping across Australia, New Zealand and India.",
      },
      { name: "author", content: "Luxeholic" },
      { property: "og:title", content: "Luxeholic — The Maison of Premium Houses" },
      {
        property: "og:description",
        content: "Curated luxury from the world's most coveted Maisons.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [country, setCountryState] = useState<Country>("AU");

  useEffect(() => {
    const saved = (typeof window !== "undefined" &&
      localStorage.getItem("luxeholic:country")) as Country | null;
    if (saved && ["AU", "NZ", "IN"].includes(saved)) setCountryState(saved);
  }, []);

  const setCountry = (c: Country) => {
    setCountryState(c);
    if (typeof window !== "undefined") localStorage.setItem("luxeholic:country", c);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <CountryContext.Provider value={{ country, setCountry }}>
        <div className="flex min-h-screen flex-col bg-background">
          <SiteHeader />
          <main className="flex-1">
            <Outlet />
          </main>
          <SiteFooter />
        </div>
        <Toaster />
      </CountryContext.Provider>
    </QueryClientProvider>
  );
}
