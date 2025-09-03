import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { AgentRequest, AgentResponse } from "./types";
import { logMessage } from "./supa";

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

// Health checks
app.get("/", (_, res) => res.json({ ok: true, service: "cofounder-railway-api" }));
app.get("/healthz", (_, res) => res.send("ok"));

// Main endpoint Make calls
app.post("/agent/reply", async (req: Request, res: Response<AgentResponse | any>) => {
  const body = req.body as Partial<AgentRequest>;

  const phone = (body.phone ?? "").toString().trim();
  const latest = (body.latest ?? "").toString();
  const history = body.history ?? null;
  const meta = body.meta ?? null;
  const runId = (meta && (meta.twSid || meta.tw_sid || meta.MessageSid)) || null;

  if (!phone || !latest) {
    return res.status(400).json({ error: "Missing 'phone' or 'latest' in body" });
  }

  // 1) log inbound
  await logMessage({
    phone,
    direction: "inbound",
    text: latest,
    run_id: runId,
    meta: { history, ...meta }
  });

  // 2) generate a reply
  // === Placeholder: safe + predictable ===
  // (Replace this with your Lovable/OpenAI call later)
  const replyText = craftReply(latest, history);

  // 3) log outbound
  await logMessage({
    phone,
    direction: "outbound",
    text: replyText,
    run_id: runId,
    meta: { history, ...meta }
  });

  // 4) return to Make (which sends to Twilio)
  return res.json({ reply: replyText });
});

// ===== Simple deterministic reply for now =====
function craftReply(latest: string, history: any): string {
  const trimmed = latest.trim();
  if (!trimmed) return "Hey! Can you resend that?";
  if (/hello|hey|hi/i.test(trimmed)) return "Hey! How can I help today?";
  if (/help|support/i.test(trimmed)) return "I’ve got you. What do you need help with?";
  return `You said: "${trimmed}"`;
}

const PORT = Number(process.env.PORT || 8080);
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
});
