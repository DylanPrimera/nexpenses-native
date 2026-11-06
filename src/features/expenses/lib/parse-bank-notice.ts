import type { PaymentType } from "@/core/types/domain";
import { parseCOPInput } from "@/core/utils/currency";

export type ParsedBankNotice = {
  amount: number | null;
  merchant: string | null;
  paymentType: Exclude<PaymentType, "cash"> | null;
  snippet: string;
  reference: string | null;
};

type FoundAmount = { amount: number; index: number };

const AMOUNT_RE =
  /(?:COP\s*\$?\s*|\$\s*)(\d{1,3}(?:,\d{3})+(?:\.\d{2})?|\d{1,3}(?:\.\d{3})+(?:,\d{2})?|\d+(?:,\d{2})?)/gi;
const MONEY_TOKEN = String.raw`\d{1,3}(?:,\d{3})+(?:\.\d{2})?|\d{1,3}(?:\.\d{3})+(?:,\d{2})?|\d+(?:[.,]\d{2})?`;
const LABELED_AMOUNT_RE = new RegExp(
  String.raw`(?:monto|valor\s+transacci[oó]n)[\s*:]+\$?\s*(${MONEY_TOKEN})`,
  "i",
);
const LABELED_DESTINATION_RE = /cuenta\s+destino[\s*:]+([^\n•]+)/i;
const BUY_RE = /compr|pagast|pag[oó]\b|valor/;
const SKIP_RE = /saldo|disponible|qued|cupo/;
const US_THOUSANDS_RE = /^\d{1,3}(?:,\d{3})+(?:\.\d{2})?$/;
const SNIPPET_MAX = 100;
const NAME_MAX = 80;

function cleanLabel(value: string): string {
  return value.replace(/\*/g, " ").replace(/\s+/g, " ").trim();
}

export function normalizeBankNoticeText(raw: string): string {
  return raw
    .replace(/\*/g, " ")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

function toCop(token: string): number {
  if (US_THOUSANDS_RE.test(token)) {
    const whole = token.replace(/,/g, "").split(".")[0] ?? "";
    const amount = Number.parseInt(whole, 10);
    return Number.isFinite(amount) ? amount : 0;
  }
  const amount = parseCOPInput(token.split(",")[0] ?? "");
  return Number.isFinite(amount) ? amount : 0;
}

function labeledAmount(text: string): FoundAmount | null {
  const match = text.match(LABELED_AMOUNT_RE);
  if (!match?.[1] || match.index == null) return null;
  const amount = toCop(match[1]);
  return amount < 1 ? null : { amount, index: match.index };
}

function labeledDestination(text: string): string | null {
  const name = cleanLabel(text.match(LABELED_DESTINATION_RE)?.[1] ?? "");
  return name.length < 2 ? null : name.slice(0, NAME_MAX);
}

function bestAmount(text: string): FoundAmount | null {
  let best: (FoundAmount & { score: number }) | null = null;

  for (const match of text.matchAll(AMOUNT_RE)) {
    const index = match.index ?? 0;
    const before = text.slice(Math.max(0, index - 48), index).toLowerCase();
    let score = 0;
    if (BUY_RE.test(before)) score += 2;
    if (SKIP_RE.test(before)) score -= 3;
    const amount = toCop(match[1] ?? "");
    if (amount < 1) continue;
    if (!best || score > best.score) best = { amount, index, score };
  }

  if (!best || best.score < 0) return null;
  return { amount: best.amount, index: best.index };
}

function merchantFrom(text: string, from: number): string | null {
  const match = text.slice(from).match(/\b(?:en|a)\s+([^\n,.]{2,80})/i);
  if (!match?.[1]) return null;

  const head = match[1].split(/\s+(?:con|el|la|tu|desde|por|mediante)\b/i)[0] ?? "";
  const name = cleanLabel(head.replace(/^(?:el|la|los|las|tu|un|una)\s+/i, ""));
  if (name.length < 2 || /^(?:tu|tarjeta|t\.?\s*(?:deb|cred))/i.test(name)) return null;
  return name.slice(0, NAME_MAX);
}

function paymentTypeOf(text: string): ParsedBankNotice["paymentType"] {
  const normalized = text.toLowerCase();
  if (/cr[eé]dito|t\.?\s*cred/.test(normalized)) return "credit_card";
  if (/d[eé]bito|t\.?\s*deb|ahorros/.test(normalized)) return "debit_card";
  return null;
}

function field(text: string, label: RegExp): string | null {
  const value = cleanLabel(text.match(label)?.[1] ?? "");
  return value.length ? value : null;
}

function isTransfer(raw: string): boolean {
  return (
    /transferiste/i.test(raw) ||
    /monto\s*:/i.test(raw) ||
    /cuenta\s+destino\s*:/i.test(raw) ||
    /a la llave\s+/i.test(raw) ||
    /a su llave|abono\s+transferencia/i.test(raw)
  );
}

function labeledPlace(raw: string): string | null {
  const place = field(raw, /lugar\s+de\s+transacci[oó]n\s*:\s*([^\n]+)/i);
  return place?.replace(/\s+\.$/, "") ?? null;
}

function destinationOf(raw: string): { id: string; label: string } | null {
  const key = raw.match(/a la llave\s+(\S+)/i)?.[1]?.replace(/[.,]$/, "");
  if (key) return { id: key, label: `Llave ${key}` };
  const digits = raw.match(/a la cuenta\s+\*?(\d+)/i)?.[1];
  if (digits) return { id: `*${digits}`, label: `Cuenta *${digits}` };
  const labeled = labeledDestination(raw);
  if (labeled) return { id: labeled, label: `Cuenta ${labeled}` };
  const place = labeledPlace(raw);
  return place ? { id: place, label: place } : null;
}

function transferKind(raw: string): string {
  if (/bre-?b/i.test(raw)) return "Bre-b";
  return field(raw, /canal\s*:\s*([^\n•]+)/i) ?? "Transferencia";
}

function transferTime(raw: string): string | null {
  const clock = raw.match(/a las\s+(\d{1,2}:\d{2})/i)?.[1] ?? raw.match(/hora\s*:\s*(\d{1,2}:\d{2})/i)?.[1];
  if (clock) return clock;
  const ampm = raw.match(/(\d{1,2}:\d{2}\s*[ap]\.\s*m\.)/i)?.[1];
  return ampm ? ampm.replace(/\s+/g, " ") : null;
}

function transferDescription(raw: string): string {
  return [destinationOf(raw)?.label, transferKind(raw), transferTime(raw)]
    .filter((part): part is string => Boolean(part))
    .join(" · ")
    .slice(0, SNIPPET_MAX);
}

function transactionReference(raw: string): string | null {
  return (
    field(raw, /n[uú]mero\s+de\s+autorizaci[oó]n[\s*:]+([A-Za-z0-9]+)/i) ??
    field(raw, /referencia[\s*:]+([A-Za-z0-9-]+)/i) ??
    field(raw, /c[oó]digo\s+(?:de\s+)?(?:aprobaci[oó]n|autorizaci[oó]n)[\s*:]+([A-Za-z0-9]+)/i)
  );
}

function importantInfo(raw: string, merchant: string | null): string {
  if (merchant) return merchant.slice(0, SNIPPET_MAX);
  return raw.replace(/\s+/g, " ").trim().slice(0, SNIPPET_MAX);
}

export function parseBankNotice(raw: string): ParsedBankNotice {
  const text = normalizeBankNoticeText(raw);
  const found = labeledAmount(text) ?? bestAmount(text);

  if (isTransfer(text)) {
    return {
      amount: found?.amount ?? null,
      merchant: destinationOf(text)?.id ?? null,
      paymentType: "debit_card",
      snippet: transferDescription(text),
      reference: transactionReference(text),
    };
  }

  const merchant = labeledPlace(text) ?? (found ? (merchantFrom(text, found.index) ?? merchantFrom(text, 0)) : null);
  const snippet = importantInfo(text, merchant);

  if (!found) return { amount: null, merchant: null, paymentType: null, snippet, reference: null };

  return {
    amount: found.amount,
    merchant,
    paymentType: paymentTypeOf(text),
    snippet,
    reference: transactionReference(text),
  };
}
