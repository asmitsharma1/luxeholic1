import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Sign In — Luxeholic" }] }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back");
        navigate({ to: "/account" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name },
          },
        });
        if (error) throw error;
        toast.success("Welcome to Luxeholic");
        navigate({ to: "/account" });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
    } catch (e: any) {
      toast.error(e?.message ?? "Google sign-in failed");
    }
  };

  return (
    <div className="container-luxe py-20 md:py-28 max-w-md mx-auto">
      <p className="eyebrow text-center">
        {mode === "signin" ? "Returning Client" : "Become a Client"}
      </p>
      <h1 className="display mt-4 text-center text-5xl md:text-6xl">
        {mode === "signin" ? "Sign In" : "Create Account"}
      </h1>

      <form onSubmit={onSubmit} className="mt-12 space-y-6">
        {mode === "signup" && (
          <div>
            <label className="eyebrow">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full border-b border-foreground bg-transparent py-3 text-sm outline-none focus:border-primary"
            />
          </div>
        )}
        <div>
          <label className="eyebrow">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full border-b border-foreground bg-transparent py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <div>
          <label className="eyebrow">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full border-b border-foreground bg-transparent py-3 text-sm outline-none focus:border-primary"
          />
        </div>

        <button
          disabled={busy}
          className="w-full bg-primary py-4 text-[11px] tracking-[0.35em] uppercase text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "…" : mode === "signin" ? "Sign In" : "Create Account"}
        </button>
      </form>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="eyebrow !text-[9px]">or</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <button
        onClick={onGoogle}
        className="w-full border border-foreground py-4 text-[11px] tracking-[0.35em] uppercase hover:bg-secondary"
      >
        Continue with Google
      </button>

      <p className="mt-8 text-center text-sm">
        {mode === "signin" ? "New to Luxeholic?" : "Already a client?"}{" "}
        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="underline hover:text-primary"
        >
          {mode === "signin" ? "Create account" : "Sign in"}
        </button>
      </p>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        <Link to="/">← Return home</Link>
      </p>
    </div>
  );
}
