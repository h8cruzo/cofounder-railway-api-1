export type AgentRequest = {
  phone: string;               // E.164 phone from Twilio (e.g. +15551234567)
  latest: string;              // latest user message text
  history?: string | any[];    // optional: prior dialog
  meta?: Record<string, any>;  // optional: twilioSid, channel, etc
};

export type AgentResponse = {
  reply: string;
};
