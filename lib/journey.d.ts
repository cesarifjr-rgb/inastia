export interface Journey {
  consent: true;
  version: string;
  page: string;
  placement: string;
  locale: "fr" | "en";
  at: number;
}
export const JOURNEY_VERSION: string;
export const JOURNEY_LIFETIME: number;
export const CONTACT_PLACEMENTS: string[];
export function journeyPage(pathname: string): string | undefined;
export function journeyAttribution(value: unknown, now?: number): Journey | undefined;
