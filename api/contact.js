const allowedOrigins = new Set([
  "https://rainbowhole.github.io",
  "https://rainbowhole.github.io/todough-landing",
]);

function setCorsHeaders(req, res) {
  const origin = req.headers.origin || "";

  if (allowedOrigins.has(origin) || origin.endsWith(".vercel.app")) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else if (!origin || origin === "null") {
    res.setHeader("Access-Control-Allow-Origin", "*");
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function sanitize(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

export default async function handler(req, res) {
  setCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  if (!webhookUrl) {
    return res.status(500).json({ error: "Contact endpoint is not configured" });
  }

  const name = sanitize(req.body?.name, 120);
  const email = sanitize(req.body?.email, 180);
  const message = sanitize(req.body?.message, 1500);
  const locale = sanitize(req.body?.locale, 40);
  const platform = sanitize(req.body?.platform, 40);
  const sentAt = sanitize(req.body?.sentAt, 80);

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const discordPayload = {
    username: "TODOUGH Contact",
    embeds: [
      {
        title: "New TODOUGH contact message",
        color: 16744565,
        fields: [
          { name: "Name", value: name, inline: true },
          { name: "Email", value: email, inline: true },
          { name: "Platform", value: platform || "web", inline: true },
          { name: "Locale", value: locale || "unknown", inline: true },
          { name: "Sent at", value: sentAt || new Date().toISOString(), inline: true },
          { name: "Message", value: message },
        ],
      },
    ],
  };

  const discordResponse = await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(discordPayload),
  });

  if (!discordResponse.ok) {
    return res.status(502).json({ error: "Discord webhook request failed" });
  }

  return res.status(200).json({ ok: true });
}
