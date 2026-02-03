A lightweight, zero-dependency TypeScript library for masking phone numbers to protect personal information.

[![npm version](https://img.shields.io/npm/v/@ekaone/mask-phone.svg)](https://www.npmjs.com/package/@ekaone/mask-phone)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)

## Features

- 🔒 **Privacy Compliant** - Follows GDPR and data protection standards
- ✨ **Lightweight** - Under 2KB, zero dependencies
- 📦 **TypeScript** - Full type safety and IntelliSense support
- ⚙️ **Flexible** - Extensive customization options
- 🌍 **Universal** - Supports all international phone formats (US, UK, EU, Asia, etc.)
- 🎯 **Locale-Agnostic** - No assumptions about phone number format
- 🚀 **Simple API** - Easy to use with sensible defaults

## Installation

```bash
npm install @ekaone/mask-phone
```

```bash
yarn add @ekaone/mask-phone
```

```bash
pnpm add @ekaone/mask-phone
```

## Quick Start

```typescript
import { maskPhone } from '@ekaone/mask-phone';

maskPhone('1234567890');
// Output: '******7890'

maskPhone('+62 812 3456 7890');
// Output: '+*********7890'
```

## Usage Examples

### Basic Usage

```typescript
import { maskPhone } from '@ekaone/mask-phone';

// Default masking (shows last 4 digits)
maskPhone('1234567890');
// Output: '******7890'

// Accepts number input
maskPhone(1234567890);
// Output: '******7890'

// Auto-strips formatting
maskPhone('+1-234-567-8901');
// Output: '+*******8901'

// Preserves international prefix
maskPhone('+1234567890');
// Output: '+******7890'
```

### Show Beginning Digits

Control how many digits to show at the start:

```typescript
// Show first 3 digits (country/area code)
maskPhone('628123456789', { showFirst: 3 });
// Output: '628*****6789'

// Show first 2 digits
maskPhone('+1234567890', { showFirst: 2 });
// Output: '+1*****7890'

// Show only first digit
maskPhone('1234567890', { showFirst: 1, showLast: 0 });
// Output: '1*********'
```

### Show Ending Digits

Control how many digits to show at the end:

```typescript
// Show last 2 digits
maskPhone('1234567890', { showLast: 2 });
// Output: '********90'

// Show last 6 digits
maskPhone('628123456789', { showLast: 6 });
// Output: '******456789'

// Hide all digits (complete masking)
maskPhone('1234567890', { showFirst: 0, showLast: 0 });
// Output: '**********'
```

### Using Aliases (showStart/showEnd)

Alternative names for clarity:

```typescript
// showStart is alias for showFirst
maskPhone('1234567890', { showStart: 3 });
// Output: '123****7890'

// showEnd is alias for showLast
maskPhone('1234567890', { showEnd: 2 });
// Output: '********90'

// Can be mixed (showFirst takes priority)
maskPhone('1234567890', { showStart: 2, showEnd: 3 });
// Output: '12*****890'
```

### Custom Mask Character

Change the masking character from the default `*`:

```typescript
maskPhone('1234567890', { maskChar: '•' });
// Output: '••••••7890'

maskPhone('1234567890', { maskChar: 'X' });
// Output: 'XXXXXX7890'

maskPhone('1234567890', { maskChar: '#' });
// Output: '######7890'
```

### Preserve Original Formatting

Maintain spaces, dashes, parentheses, and other separators from the input:

```typescript
// Preserve US format
maskPhone('+1 (555) 123-4567', { preserveFormat: true });
// Output: '+* (***) ***-4567'

// Preserve international spacing
maskPhone('+62 812 3456 7890', { preserveFormat: true });
// Output: '+** *** **** 7890'

// Preserve dashes
maskPhone('+1-555-123-4567', { preserveFormat: true });
// Output: '+*-***-***-4567'

// Preserve dots
maskPhone('+62.812.3456.7890', { preserveFormat: true });
// Output: '+**.***.****.7890'
```

### Visible Ranges

Show specific character ranges:

```typescript
// Show country code and last 4
maskPhone('628123456789', { visibleRanges: [[0, 2], [8, 11]] });
// Output: '628*****6789'

// Show only middle section
maskPhone('1234567890', { visibleRanges: [[3, 6]] });
// Output: '***4567***'

// Multiple non-contiguous ranges
maskPhone('+441234567890', { 
  visibleRanges: [[0, 2], [6, 8]] 
});
// Output: '+44***456****'

// Works with preserveFormat
maskPhone('+1 (555) 123-4567', {
  visibleRanges: [[0, 3], [12, 15]],
  preserveFormat: true
});
// Output: '+1 (555) ***-****'
```

### Custom Masking Function

Full control over masking logic:

```typescript
// Mask every other character
maskPhone('1234567890', {
  customMask: (char, idx) => idx % 2 === 0 ? '*' : char
});
// Output: '*2*4*6*8*0'

// Mask based on position
maskPhone('1234567890', {
  customMask: (char, idx, phone) => 
    idx < phone.length / 2 ? '*' : char
});
// Output: '*****67890'

// Conditional masking
maskPhone('1234567890', {
  customMask: (char, idx) => 
    ['1', '3', '5', '7', '9'].includes(char) ? '*' : char
});
// Output: '*2*4*6*8*0'

// Works with preserveFormat
maskPhone('+1 (555) 123-4567', {
  preserveFormat: true,
  customMask: (char, idx) => 
    char.match(/\d/) && idx % 2 === 0 ? 'X' : char
});
// Output: '+X (X5X) X2X-X5X7'
```

### Combined Options

Mix and match options for custom behavior:

```typescript
// Common pattern: show country code + last 4
maskPhone('628123456789', {
  maskChar: '•',
  showFirst: 3,
  showLast: 4
});
// Output: '628•••••6789'

// Preserve format with custom mask
maskPhone('+1 (555) 123-4567', {
  maskChar: 'X',
  preserveFormat: true
});
// Output: '+X (XXX) XXX-4567'

// Everything combined
maskPhone('628123456789', {
  maskChar: '#',
  showFirst: 3,
  showLast: 4
});
// Output: '628#####6789'
```

## API Reference

### `maskPhone(input, options?)`

Masks a phone number according to the provided options.

#### Parameters

- **input** (`string | number`) - The phone number to mask
- **options** (`MaskOptions`, optional) - Configuration options

#### Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maskChar` | `string` | `'*'` | Character used for masking |
| `showFirst` | `number` | `0` | Number of digits to show at the beginning |
| `showLast` | `number` | `4` | Number of digits to show at the end |
| `showStart` | `number` | - | Alias for `showFirst` (for clarity) |
| `showEnd` | `number` | - | Alias for `showLast` (for clarity) |
| `visibleRanges` | `Array<[number, number]>` | - | Specific ranges to keep visible `[[start, end], ...]` |
| `preserveFormat` | `boolean` | `false` | Maintain original spacing/formatting from input |
| `customMask` | `function` | - | Custom masking function `(char, index, phone) => string` |

#### Returns

- (`string`) - The masked phone number

#### TypeScript Types

All types and interfaces exported from the package:

```typescript
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
export const DEFAULT_OPTIONS: Required<Omit<MaskOptions, 'showFirst' | 'showStart' | 'showEnd' | 'visibleRanges' | 'customMask'>> = {
  maskChar: '*',
  showLast: 4,
  preserveFormat: false,
};

/**
 * Type guard to check if value is a valid phone input
 */
export function isValidPhoneInput(value: unknown): value is PhoneInput;
```

### Package Exports

The package exports the following members:

| Export | Type | Description |
|--------|------|-------------|
| `maskPhone` | `function` | Main masking function |
| `MaskOptions` | `interface` | Configuration options interface (type-only) |
| `PhoneInput` | `type` | Union type: `string \| number` (type-only) |
| `DEFAULT_OPTIONS` | `const` | Default configuration constants |
| `isValidPhoneInput` | `function` | Type guard for runtime validation |

**Import examples:**

```typescript
// Import only what you need (tree-shakeable)
import { maskPhone } from '@ekaone/mask-phone';

// Import with types (TypeScript)
import { 
  maskPhone, 
  type MaskOptions, 
  type PhoneInput 
} from '@ekaone/mask-phone';

// Import everything
import { 
  maskPhone,
  type MaskOptions,
  type PhoneInput,
  DEFAULT_OPTIONS,
  isValidPhoneInput
} from '@ekaone/mask-phone';
```

## Real-World Use Cases

### Customer Service Display

```typescript
const phoneNumber = '+62 812 3456 7890';
const maskedPhone = maskPhone(phoneNumber, { 
  showFirst: 3,
  preserveFormat: true 
});

console.log(`Contact: ${maskedPhone}`);
// Output: "Contact: +62 *** **** 7890"
```

### User Profile Display

```typescript
const userPhone = '1234567890';
const displayPhone = maskPhone(userPhone);

console.log(`Phone: ${displayPhone}`);
// Output: "Phone: ******7890"
```

### SMS Verification Display

```typescript
function showVerificationTarget(phone: string) {
  return maskPhone(phone, { 
    showLast: 4,
    preserveFormat: true 
  });
}

const phone = '+1 (555) 123-4567';
console.log(`Code sent to: ${showVerificationTarget(phone)}`);
// Output: "Code sent to: +* (***) ***-4567"
```

### Security Levels

```typescript
function maskPhoneBySecurityLevel(
  phone: string, 
  level: 'low' | 'medium' | 'high'
) {
  switch (level) {
    case 'low':
      return maskPhone(phone, { showFirst: 3, showLast: 4 });
    case 'medium':
      return maskPhone(phone, { showLast: 4 });
    case 'high':
      return maskPhone(phone, { showFirst: 0, showLast: 0 });
  }
}

const phone = '628123456789';
console.log('Low:   ', maskPhoneBySecurityLevel(phone, 'low'));
console.log('Medium:', maskPhoneBySecurityLevel(phone, 'medium'));
console.log('High:  ', maskPhoneBySecurityLevel(phone, 'high'));
// Output:
// Low:    628*****6789
// Medium: ********6789
// High:   ************
```

### Multi-User Contact List

```typescript
const contacts = [
  { name: 'Alice', phone: '+1 (415) 555-2671' },
  { name: 'Bob', phone: '+44 20 7123 4567' },
  { name: 'Charlie', phone: '+62 812 3456 7890' }
];

contacts.forEach(contact => {
  const masked = maskPhone(contact.phone, { 
    preserveFormat: true 
  });
  console.log(`${contact.name}: ${masked}`);
});
// Output:
// Alice: +* (***) ***-2671
// Bob: +** ** **** 4567
// Charlie: +** *** **** 7890
```

### Audit Logging

```typescript
function logPhoneAccess(phone: string, action: string) {
  const maskedPhone = maskPhone(phone, {
    showFirst: 2,
    showLast: 0
  });
  
  console.log(`[${new Date().toISOString()}] ${action}: ${maskedPhone}`);
}

logPhoneAccess('+1234567890', 'Phone number viewed');
// Output: "[2025-02-03T10:30:00.000Z] Phone number viewed: +1*********"
```

### Invoice/Receipt Display

```typescript
const receiptPhone = '+62 812 3456 7890';
const formatted = maskPhone(receiptPhone, {
  maskChar: '•',
  preserveFormat: true
});

console.log(`Contact: ${formatted}`);
// Output: "Contact: +•• ••• •••• 7890"
```

## International Phone Format Support

Works seamlessly with all international phone formats without any locale assumptions:

```typescript
// United States
maskPhone('+1 (415) 555-2671', { preserveFormat: true });
// Output: '+* (***) ***-2671'

// United Kingdom
maskPhone('+44 20 7123 4567', { preserveFormat: true });
// Output: '+** ** **** 4567'

// Indonesia
maskPhone('+62 812 3456 7890', { preserveFormat: true });
// Output: '+** *** **** 7890'

// France
maskPhone('+33 1 23 45 67 89', { preserveFormat: true });
// Output: '+** * ** ** 67 89'

// Japan
maskPhone('+81 3-1234-5678', { preserveFormat: true });
// Output: '+** *-****-5678'

// Australia
maskPhone('+61 2 1234 5678', { preserveFormat: true });
// Output: '+** * **** 5678'

// Germany
maskPhone('+49 30 12345678', { preserveFormat: true });
// Output: '+** ** ****5678'

// Brazil
maskPhone('+55 11 91234-5678', { preserveFormat: true });
// Output: '+** ** *****-5678'

// China
maskPhone('+86 138 0013 8000', { preserveFormat: true });
// Output: '+** *** **** 8000'

// Russia
maskPhone('+7 495 123-45-67', { preserveFormat: true });
// Output: '+* *** ***-**-67'
```

## Security & Privacy

### GDPR Compliance

This library helps comply with GDPR (General Data Protection Regulation) requirements for handling personal data:

📋 **GDPR Article 32 - Security of Processing**
- Pseudonymization and masking of personal data
- Phone number masking is a technical measure for privacy protection

**Recommended practices:**

```typescript
// ✅ GDPR Compliant (Last 4 only - Default)
maskPhone('+1234567890');
// Output: '+******7890'

// ✅ GDPR Compliant (Minimal disclosure)
maskPhone('+1234567890', { showLast: 2 });
// Output: '+*********90'

// ⚠️ Use with caution (more data disclosed)
maskPhone('+1234567890', { showFirst: 3, showLast: 4 });
// Output: '+12****7890'
```

### Privacy Best Practices

Following **OWASP** and **NIST SP 800-122** guidelines:

1. **Minimize data exposure** - Show only last 4 digits (default)
2. **Never log unmasked phone numbers** in production systems
3. **Use masking for display purposes** - Don't use for authentication
4. **This library is for display only** - Not for validation or storage
5. **Backend compliance** - Ensure server properly handles PII

### Important Notice

🔒 **This library is designed for display and logging purposes.** It does not:
- Store phone numbers securely
- Validate phone number format or authenticity
- Hash or encrypt phone data
- Handle actual telecommunications
- Provide country/carrier detection

This is a **pure masking utility** that works in both frontend and backend environments (Node.js, browser, serverless functions, etc.).

Always ensure your systems comply with GDPR, CCPA, and local data protection regulations when handling personal information.

## Edge Cases

The library handles various edge cases gracefully:

```typescript
// Very short numbers (won't mask if length ≤ showLast)
maskPhone('1234');
// Output: '1234'

maskPhone('12345');
// Output: '*2345'

// Empty input
maskPhone('');
// Output: ''

// Null/undefined
maskPhone(null);
// Output: ''

// Whitespace only
maskPhone('   ');
// Output: ''

// Mixed characters (auto-strips non-digits except +)
maskPhone('+1-ABC-234-5678');
// Output: '+******5678'

// Multiple + signs (keeps only digits and first +)
maskPhone('++1234567890');
// Output: '+******7890'

// Only + sign
maskPhone('+');
// Output: '+'

// Very long numbers
maskPhone('123456789012345678901234567890');
// Output: '**************************7890'
```

## Performance

- ⚡ Lightweight: < 2KB minified + gzipped
- 🚀 Zero dependencies
- 💨 Fast execution (< 1ms for typical phones)
- 🌳 Tree-shakeable with `sideEffects: false`
- 📦 Supports both CJS and ESM

## Browser Support

This library works in all modern browsers and Node.js environments that support ES2020+.

- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ✅ Node.js 14+
- ✅ Deno
- ✅ Bun

## Importing Types

All types and utilities are exported for TypeScript users:

```typescript
import { 
  maskPhone,                // Main function
  type MaskOptions,         // Options interface
  type PhoneInput,          // Input type (string | number)
  DEFAULT_OPTIONS,          // Default configuration constants
  isValidPhoneInput         // Type guard utility
} from '@ekaone/mask-phone';

// Using the type guard
function processPhone(input: unknown) {
  if (isValidPhoneInput(input)) {
    return maskPhone(input);
  }
  throw new Error('Invalid phone input');
}

// Using DEFAULT_OPTIONS
const customOptions: MaskOptions = {
  ...DEFAULT_OPTIONS,
  showFirst: 3,
};

// Strongly typed options
const options: MaskOptions = {
  maskChar: '•',
  showLast: 4,
  preserveFormat: true,
  visibleRanges: [[0, 2], [8, 10]],
  customMask: (char, idx, phone) => char === '5' ? 'X' : char
};

// Type-safe function wrapper
function safeMaskPhone(phone: PhoneInput, options?: MaskOptions): string {
  return maskPhone(phone, options);
}
```

## TypeScript Support

Full TypeScript support with comprehensive type definitions included.

```typescript
import { 
  maskPhone, 
  type MaskOptions, 
  type PhoneInput,
  DEFAULT_OPTIONS,
  isValidPhoneInput
} from '@ekaone/mask-phone';

// Basic usage with types
const phone: PhoneInput = '+1234567890';
const options: MaskOptions = {
  maskChar: '•',
  showLast: 4,
  preserveFormat: true
};
const masked: string = maskPhone(phone, options);

// Using type guard for runtime validation
function handleUserInput(input: unknown): string {
  if (!isValidPhoneInput(input)) {
    throw new Error('Invalid phone number format');
  }
  return maskPhone(input);
}

// Extending options with custom configuration
interface MyAppPhoneOptions extends MaskOptions {
  logAccess?: boolean;
}

function maskWithLogging(
  phone: PhoneInput, 
  options: MyAppPhoneOptions
): string {
  const masked = maskPhone(phone, options);
  if (options.logAccess) {
    console.log('Phone accessed:', masked);
  }
  return masked;
}

// Type-safe custom masking function
const customMask: MaskOptions['customMask'] = (
  char: string, 
  index: number, 
  phone: string
): string => {
  return index % 2 === 0 ? '*' : char;
};

maskPhone('1234567890', { customMask });
```

### IntelliSense Support

The package provides full IntelliSense support in various IDEs and other TypeScript-aware editors:

- 💡 Auto-completion for all options
- 📝 Inline documentation with examples
- 🔍 Type checking for function parameters
- ⚠️ Compile-time error detection

## Why Choose mask-phone?

### ✅ Locale-Agnostic Design
Unlike other phone masking libraries, we make **zero assumptions** about phone number format. Works with any country, any format, any length.

### ✅ Format Preservation
Keep your original formatting with `preserveFormat: true` - perfect for UI display.

### ✅ Maximum Flexibility
From simple last-4 masking to complex custom functions - you're in control.

### ✅ Security First
Follows GDPR, OWASP, and NIST guidelines for PII protection.

### ✅ Developer Experience
- Full TypeScript support
- Intuitive API
- Comprehensive documentation
- Extensive test coverage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Build
npm run build

# Type check
npm run type-check
```

## License

MIT © Eka Prasetia

## Links

- [npm Package](https://www.npmjs.com/package/@ekaone/mask-phone)
- [GitHub Repository](https://github.com/ekaone/mask-phone)
- [Issue Tracker](https://github.com/ekaone/mask-phone/issues)

## Related Packages

- [@ekaone/mask-card](https://www.npmjs.com/package/@ekaone/mask-card) - Credit card masking library
- [@ekaone/mask-email](https://www.npmjs.com/package/@ekaone/mask-email) - Email address masking library

---

⭐ If this library helps you, please consider giving it a star on GitHub!