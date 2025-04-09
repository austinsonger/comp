/**
 * Evidence status types and constants
 */

import { EvidenceStatus } from "@comp/db/types";

// Status priority and type definitions
export const EVIDENCE_STATUS_PRIORITY: EvidenceStatus[] = [
	"draft",
	"not_relevant",
	"published",
] as const;
export type EvidenceStatusType = (typeof EVIDENCE_STATUS_PRIORITY)[number];

// Status color mapping for UI components
export const EVIDENCE_STATUS_COLORS = {
	draft: "bg-[var(--chart-open)]",
	not_relevant: "bg-[hsl(var(--destructive))]",
	published: "bg-[hsl(var(--destructive))]",
} as const;

// Status color hex values for charts
export const EVIDENCE_STATUS_HEX_COLORS: Record<EvidenceStatusType, string> = {
	draft: "#f59e0b",
	not_relevant: "#ef4444",
	published: "#10b981",
};

// Translation keys for evidence statuses
export const EVIDENCE_STATUS_TRANSLATION_KEYS: Record<
	EvidenceStatusType,
	string
> = {
	draft: "evidence.status.draft",
	not_relevant: "evidence.status.not_relevant",
	published: "evidence.status.published",
};
