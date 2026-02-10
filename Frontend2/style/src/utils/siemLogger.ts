export type SiemLogLevel = "info" | "warn" | "error";

type SiemLogEvent = {
  event: string;
  level?: SiemLogLevel;
  message?: string;
  context?: Record<string, unknown>;
  ts?: string;
};

const SIEM_URL = (import.meta as any).env?.VITE_SIEM_URL as string | undefined;
const SIEM_TOKEN = (import.meta as any).env?.VITE_SIEM_TOKEN as string | undefined;
const SIEM_DEBUG = (import.meta as any).env?.VITE_SIEM_DEBUG === "true";
const IP_LOOKUP_URL =
  ((import.meta as any).env?.VITE_IP_LOOKUP_URL as string | undefined) ||
  "http://localhost:3000/api/telemetry/ip";

type LocalLogRecord = {
  level: SiemLogLevel;
  event: string;
  message?: string;
  ts: string;
  context: Record<string, unknown>;
};

const queue: SiemLogEvent[] = [];
let flushTimer: number | undefined;
const FLUSH_INTERVAL_MS = 5000;
const MAX_BATCH = 10;
const localBuffer: LocalLogRecord[] = [];
let cachedClientIp: string | null | undefined;
let clientIpPromise: Promise<string | null> | null = null;

async function fetchClientIp() {
  if (cachedClientIp !== undefined) return cachedClientIp;
  if (!clientIpPromise) {
    clientIpPromise = (async () => {
      try {
        const res = await fetch(IP_LOOKUP_URL, { credentials: "include" });
        if (!res.ok) return null;
        const data = (await res.json()) as { ip?: string | null };
        return data?.ip ?? null;
      } catch {
        return null;
      }
    })();
  }
  cachedClientIp = await clientIpPromise;
  return cachedClientIp;
}

function buildBaseContext() {
  return {
    url: window.location.href,
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    clientIp: cachedClientIp ?? undefined,
  };
}

function canSend() {
  return Boolean(SIEM_URL);
}

function recordLocal(log: LocalLogRecord) {
  localBuffer.push(log);
  if (localBuffer.length > 200) {
    localBuffer.shift();
  }
  if (SIEM_DEBUG) {
    // eslint-disable-next-line no-console
    console.info("[SIEM]", log.level, log.event, log.message, log.context);
  }
}

async function flush() {
  if (!canSend() || queue.length === 0) return;

  await fetchClientIp();
  const batch = queue.splice(0, MAX_BATCH);
  const payload = {
    source: "frontend",
    sentAt: new Date().toISOString(),
    events: batch.map((e) => ({
      level: e.level || "info",
      ts: e.ts || new Date().toISOString(),
      event: e.event,
      message: e.message,
      context: {
        ...buildBaseContext(),
        ...(e.context || {}),
      },
    })),
  };

  try {
    await fetch(SIEM_URL as string, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(SIEM_TOKEN ? { Authorization: `Bearer ${SIEM_TOKEN}` } : {}),
      },
      body: JSON.stringify(payload),
      keepalive: true,
    });
  } catch {
    // Swallow errors to avoid breaking the UI
  }
}

function scheduleFlush() {
  if (flushTimer) return;
  flushTimer = window.setTimeout(async () => {
    flushTimer = undefined;
    await flush();
    if (queue.length > 0) scheduleFlush();
  }, FLUSH_INTERVAL_MS);
}

export function logEvent(event: string, message?: string, context?: Record<string, unknown>) {
  const log = {
    level: "info" as SiemLogLevel,
    event,
    message,
    ts: new Date().toISOString(),
    context: {
      ...buildBaseContext(),
      ...(context || {}),
    },
  };
  recordLocal(log);
  if (!canSend()) return;
  queue.push({ event, message, context, level: "info" });
  scheduleFlush();
}

export function logWarn(event: string, message?: string, context?: Record<string, unknown>) {
  const log = {
    level: "warn" as SiemLogLevel,
    event,
    message,
    ts: new Date().toISOString(),
    context: {
      ...buildBaseContext(),
      ...(context || {}),
    },
  };
  recordLocal(log);
  if (!canSend()) return;
  queue.push({ event, message, context, level: "warn" });
  scheduleFlush();
}

export function logError(event: string, message?: string, context?: Record<string, unknown>) {
  const log = {
    level: "error" as SiemLogLevel,
    event,
    message,
    ts: new Date().toISOString(),
    context: {
      ...buildBaseContext(),
      ...(context || {}),
    },
  };
  recordLocal(log);
  if (!canSend()) return;
  queue.push({ event, message, context, level: "error" });
  scheduleFlush();
}

export function logPageView(pathname: string) {
  logEvent("page_view", undefined, { pathname });
}

export function flushLogs() {
  return flush();
}

export function getLocalLogs() {
  return [...localBuffer];
}
