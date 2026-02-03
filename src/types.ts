/**
 * Phone masking options
 * All options are optional and use flat structure for simplicity
 */
export interface MaskOptions {
  /**
   * Character used for masking
   * @default '*'
   * @example '#', 'X', '•'
   */
  maskChar?: string;

  /**
   * Number of characters to show from the start
   * @example 3 → '628*******'
   */
  showFirst?: number;

  /**
   * Number of characters to show from the end (most common pattern)
   * @default 4
   * @example 4 → '******7890'
   */
  showLast?: number;

  /**
   * Alias for showFirst (for clarity)
   * @example 2 → '62********'
   */
  showStart?: number;

  /**
   * Alias for showLast (for clarity)
   * @example 4 → '******7890'
   */
  showEnd?: number;

  /**
   * Specific ranges to keep visible
   * Array of [startIndex, endIndex] (inclusive)
   * @example [[0, 2], [8, 10]] → '628****789*'
   */
  visibleRanges?: Array<[number, number]>;

  /**
   * Preserve formatting characters (spaces, dashes, parentheses, etc.)
   * When true: '+1 (555) 123-4567' → '+* (***) ***-4567'
   * When false: '+1 (555) 123-4567' → '**************' (strips then masks)
   * @default false
   */
  preserveFormat?: boolean;

  /**
   * Custom masking function for full control
   * Overrides all other options
   * @param char - Current character
   * @param index - Position in the phone string
   * @param phone - Full phone string
   * @returns Masked character or original
   * @example (char, idx) => idx % 2 === 0 ? '*' : char
   */
  customMask?: (char: string, index: number, phone: string) => string;
}

/**
 * Input type for phone parameter
 * Accepts both string and number for flexibility
 */
export type PhoneInput = string | number;

/**
 * Default masking options
 */
export const DEFAULT_OPTIONS: Required<
  Omit<
    MaskOptions,
    "showFirst" | "showStart" | "showEnd" | "visibleRanges" | "customMask"
  >
> = {
  maskChar: "*",
  showLast: 4,
  preserveFormat: false,
};

/**
 * Type guard to check if value is a valid phone input
 */
export function isValidPhoneInput(value: unknown): value is PhoneInput {
  return typeof value === "string" || typeof value === "number";
}

/**
 * Normalized options after resolving aliases and defaults
 * Internal use only
 */
export interface NormalizedOptions {
  maskChar: string;
  showFirst: number;
  showLast: number;
  visibleRanges?: Array<[number, number]>;
  preserveFormat: boolean;
  customMask?: (char: string, index: number, phone: string) => string;
}
