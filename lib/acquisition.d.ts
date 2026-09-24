export interface Acquisition {
  consent: true;
  version: string;
  source: "google_business_profile";
  at: number;
}
export const ACQUISITION_VERSION: string;
export const ACQUISITION_LIFETIME: number;
export const GBP_PARAMETERS: Record<string, string>;
export function isGbpCampaign(params: URLSearchParams): boolean;
export function acquisitionAttribution(value: unknown, now?: number): Acquisition | undefined;
