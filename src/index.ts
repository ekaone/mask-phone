import type { PhoneInput, MaskOptions, NormalizedOptions } from "./types";
import { DEFAULT_OPTIONS } from "./types";

/**
 * Normalize phone input to string safely
 * Handles string, number, null, undefined
 */
function normalizePhone(phone: PhoneInput): string {
  if (phone == null) return "";

  // Handle object
  if (typeof phone === "object" && phone !== null && "phone" in phone) {
    phone = (phone as any).phone;
  }

  // Convert to string safely
  const phoneStr = String(phone).trim();

  return phoneStr;
}

/**
 * Strip non-digit characters from phone string
 * Keeps only 0-9 and optionally '+'
 */
function stripFormatting(phone: string): string {
  // Keep digits and plus sign for international format
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Normalize and resolve option aliases
 * Priority: customMask > visibleRanges > showFirst/Last > defaults
 */
function normalizeOptions(options?: MaskOptions): NormalizedOptions {
  if (!options) {
    return {
      maskChar: DEFAULT_OPTIONS.maskChar,
      showFirst: 0,
      showLast: DEFAULT_OPTIONS.showLast,
      preserveFormat: DEFAULT_OPTIONS.preserveFormat,
    };
  }

  // Resolve aliases: showStart -> showFirst, showEnd -> showLast
  const showFirst = options.showFirst ?? options.showStart ?? 0;
  const showLast =
    options.showLast ?? options.showEnd ?? DEFAULT_OPTIONS.showLast;

  return {
    maskChar: options.maskChar ?? DEFAULT_OPTIONS.maskChar,
    showFirst,
    showLast,
    visibleRanges: options.visibleRanges,
    preserveFormat: options.preserveFormat ?? DEFAULT_OPTIONS.preserveFormat,
    customMask: options.customMask,
  };
}

/**
 * Check if character at index should be visible based on options
 */
function isCharVisible(
  index: number,
  length: number,
  options: NormalizedOptions,
): boolean {
  // Check visible ranges first (higher priority)
  if (options.visibleRanges && options.visibleRanges.length > 0) {
    return options.visibleRanges.some(
      ([start, end]) => index >= start && index <= end,
    );
  }

  // Check showFirst
  if (options.showFirst > 0 && index < options.showFirst) {
    return true;
  }

  // Check showLast
  if (options.showLast > 0 && index >= length - options.showLast) {
    return true;
  }

  return false;
}

/**
 * Check if character is a formatting character
 */
function isFormattingChar(char: string): boolean {
  // Common phone formatting: spaces, dashes, parentheses, dots, plus
  return /[\s\-().\+]/.test(char);
}

/**
 * Mask a phone string with format preservation
 */
function maskWithFormat(phone: string, options: NormalizedOptions): string {
  let digitIndex = -1; // Track position among digits only
  const digits = phone.replace(/\D/g, ""); // All digits for length calculation
  const totalDigits = digits.length;

  return phone
    .split("")
    .map((char, charIndex) => {
      // Custom mask function has highest priority
      if (options.customMask) {
        return options.customMask(char, charIndex, phone);
      }

      // If it's a formatting character, preserve it
      if (isFormattingChar(char)) {
        return char;
      }

      // It's a digit, increment our digit counter
      digitIndex++;

      // Check if this digit should be visible
      if (isCharVisible(digitIndex, totalDigits, options)) {
        return char;
      }

      // Mask the digit
      return options.maskChar;
    })
    .join("");
}

/**
 * Mask a phone string without format (digits only)
 */
function maskWithoutFormat(phone: string, options: NormalizedOptions): string {
  // Strip to digits only (keep + for international)
  const stripped = stripFormatting(phone);
  const length = stripped.length;

  return stripped
    .split("")
    .map((char, index) => {
      // Custom mask function has highest priority
      if (options.customMask) {
        return options.customMask(char, index, stripped);
      }

      // Always preserve + sign
      if (char === "+") {
        return char;
      }

      // Check if this position should be visible
      if (isCharVisible(index, length, options)) {
        return char;
      }

      // Mask the character
      return options.maskChar;
    })
    .join("");
}

/**
 * Main masking function
 * Masks phone numbers with flexible options
 *
 * @param phone - Phone number as string or number
 * @param options - Masking options
 * @returns Masked phone string
 *
 * @example
 * ```typescript
 * maskPhone('+1234567890', { showLast: 4 })
 * // Returns: '******7890'
 *
 * maskPhone('+1 (555) 123-4567', { showLast: 4, preserveFormat: true })
 * // Returns: '+* (***) ***-4567'
 *
 * maskPhone('628123456789', { showFirst: 3, showLast: 2 })
 * // Returns: '628*******89'
 * ```
 */
export const maskPhone = (phone: PhoneInput, options?: MaskOptions): string => {
  // Normalize input
  const phoneStr = normalizePhone(phone);

  // Handle empty input
  if (!phoneStr) return "";

  // Normalize options
  const normalizedOpts = normalizeOptions(options);

  // Edge case: if phone is shorter than or equal to showFirst + showLast, don't mask
  const stripped = stripFormatting(phoneStr);
  const totalVisible = normalizedOpts.showFirst + normalizedOpts.showLast;

  if (
    !options?.customMask &&
    !options?.visibleRanges &&
    stripped.length <= totalVisible
  ) {
    return phoneStr; // Return original if nothing to mask
  }

  // Choose masking strategy based on preserveFormat option
  if (normalizedOpts.preserveFormat) {
    return maskWithFormat(phoneStr, normalizedOpts);
  } else {
    return maskWithoutFormat(phoneStr, normalizedOpts);
  }
};

// Export types for consumers
export type { PhoneInput, MaskOptions } from "./types";
