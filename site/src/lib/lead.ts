/** Lead form rules shared by the contact form (client) and /api/lead (server). */

export const LEAD_SERVICES = ["cleaning", "polishing", "protection"] as const;
export type LeadService = (typeof LEAD_SERVICES)[number];

/** Submissions faster than this are treated as bots. */
export const MIN_FILL_MS = 3000;

export function isLeadService(value: unknown): value is LeadService {
  return LEAD_SERVICES.includes(value as LeadService);
}

/** Accepts +380XXXXXXXXX or 0XXXXXXXXX, ignoring spaces, dashes and brackets. */
export function isValidUaPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return /^380\d{9}$/.test(digits) || /^0\d{9}$/.test(digits);
}
