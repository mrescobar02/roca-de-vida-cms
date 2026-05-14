// Shared field constraints for public-facing form collections.
// These limits mirror the Zod schemas in the web app's server actions.

export const NAME_MAX      = 100;
export const PHONE_MAX     = 30;
export const EMAIL_MAX     = 255;
export const SHORT_MAX     = 100;   // district, country, subject
export const MESSAGE_MAX   = 5000;
export const LONG_MAX      = 3000;  // testimony, long messages
export const NOTES_MAX     = 2000;  // internal notes
export const AGE_MAX       = 120;
export const AMOUNT_MAX    = 10000;
