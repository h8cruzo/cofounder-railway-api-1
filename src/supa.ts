import { createClient } from "@supabase/supabase-js";

// Uses service role for server-side writes
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

export const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
    : null;

// minimal helper to insert a message row if client is configured
export async function logMessage(row: {
  phone: string;
  direction: "inbound" | "outbound";
  text: string;
  run_id?: string | null;
  meta?: any;
}) {
  if (!supabase) return;

  try {
    await supabase.from("messages").insert({
      phone: row.phone,
      direction: row.direction,
      text: row.text,
      run_id: row.run_id ?? null,
      meta: row.meta ?? null
    });
  } catch (err) {
    // swallow errors so logging never breaks the reply
    console.error("Supabase insert failed:", err);
  }
}
import { createClient } from "@supabase/supabase-js";

// Uses service role for server-side writes
const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE!;

export const supabase =
  SUPABASE_URL && SUPABASE_SERVICE_ROLE
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE)
    : null;

// minimal helper to insert a message row if client is configured
export async function logMessage(row: {
  phone: string;
  direction: "inbound" | "outbound";
  text: string;
  run_id?: string | null;
  meta?: any;
}) {
  if (!supabase) return;

  try {
    await supabase.from("messages").insert({
      phone: row.phone,
      direction: row.direction,
      text: row.text,
      run_id: row.run_id ?? null,
      meta: row.meta ?? null
    });
  } catch (err) {
    // swallow errors so logging never breaks the reply
    console.error("Supabase insert failed:", err);
  }
}
