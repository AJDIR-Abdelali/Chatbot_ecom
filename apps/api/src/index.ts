import { Hono } from "hono";
import { cors } from "hono/cors";
import { webhookRoutes } from "./routes/webhooks";
import { chatRoutes } from "./routes/chat";
import { dashboardRoutes } from "./routes/dashboard";

const app = new Hono<{ Bindings: any }>();
app.use("*", cors());

app.get("/health", (c) => c.json({ ok: true }));
app.route("/api/chat", chatRoutes);
app.route("/api/webhooks", webhookRoutes);
app.route("/api/dashboard", dashboardRoutes);

export default app;
