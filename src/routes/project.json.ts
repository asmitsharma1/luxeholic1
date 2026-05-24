import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";

export const Route = createFileRoute("/project/json")({
  server: {
    handlers: {
      GET: async () => {
        const json = { schemaVersion: 1, template: "tanstack_start_ts_2026-05-12" };
        return new Response(JSON.stringify(json), {
          headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
