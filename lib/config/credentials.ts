// Single source of truth for legal/regulatory identifiers.
//
// A claim like "Ministry of Transport certified" or "ZATCA VAT compliant" must
// NEVER be rendered unless the matching real number is present here. Leave a
// value `null` and the UI shows nothing (no unbacked claim). Fill it in the day
// you have the actual number and the claim appears automatically.

export const credentials = {
  /** Commercial Registration (السجل التجاري). */
  commercialRegistration: null as string | null, // TODO: add CR number
  /** Ministry of Transport / TGA operator licence number. */
  motLicenseNumber: null as string | null, // TODO: add TGA/MoT operator licence
  /** VAT registration number (ZATCA), 15 digits. */
  vatNumber: null as string | null, // TODO: add ZATCA VAT number
  /** Registered legal trade name for Terms/Privacy. */
  legalEntityName: null as string | null, // TODO: add registered company name
};

/** True only when a credential string is actually present. */
export function hasCredential(value: string | null | undefined): value is string {
  return typeof value === "string" && value.trim().length > 0;
}
