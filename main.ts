import { Hono } from "https://deno.land/x/hono@v3.2.5/mod.ts";
import { serve } from "https://deno.land/std@0.191.0/http/server.ts";

const port = +(Deno.env.get("PORT") ?? "8000");
const app = new Hono();

app.get("/", (c) => c.text("Hello"));

serve(app.fetch, { port });
