export interface Acquisition {
  consent: true;
  version: string;
  source: "google_business_profile" | "google_organic" | "bing_organic" | "duckduckgo_organic";
  at: number;
  page?: string;
  locale?: "fr" | "en";
}
export const ACQUISITION_VERSION: string;
export const ACQUISITION_LIFETIME: number;
export const GBP_PARAMETERS: Record<string, string>;
export const ACQUISITION_LABELS: Record<Acquisition["source"], string>;
export function hasCampaign(params: URLSearchParams): boolean;
export function organicSearchSource(referrer: string): Acquisition["source"] | undefined;
export function isGbpCampaign(params: URLSearchParams): boolean;
export function acquisitionAttribution(value: unknown, now?: number): Acquisition | undefined;
