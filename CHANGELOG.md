# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-02-03

### Added
- Initial release of `@ekaone/mask-phone`
- `maskPhone()` function for masking phone numbers
- Support for `string` and `number` inputs (`PhoneInput`)
- Flexible masking options via `MaskOptions`:
  - `maskChar` to customize the masking character
  - `showFirst` / `showStart` to control visible digits at the beginning
  - `showLast` / `showEnd` to control visible digits at the end (default: `4`)
  - `visibleRanges` for fine‑grained visible index ranges
  - `preserveFormat` to maintain original spacing/formatting (spaces, dashes, parentheses, dots, `+`, etc.)
  - `customMask` callback for fully custom masking logic
- Dual masking strategies:
  - Format‑preserving masking (keeps original separators)
  - Normalized "digits only" masking (with optional `+` prefix)
- Graceful handling of edge cases:
  - `null`, `undefined`, empty, and whitespace inputs
  - Very short phone numbers (auto‑bypass when nothing to mask)
  - Mixed characters and multiple `+` signs
- Full TypeScript support with exported types and utilities:
  - `MaskOptions`, `PhoneInput`, `DEFAULT_OPTIONS`, `isValidPhoneInput`
- Zero dependencies, tree‑shakeable build (`sideEffects: false`)
- Dual package support (CommonJS + ESM) with proper `exports` map
- README with API docs, usage examples, and security notes

### Security & Privacy
- Designed as a privacy‑focused masking utility for personal phone numbers
- Helps with GDPR‑aligned pseudonymization and PII minimization
- Encourages displaying only the minimum necessary digits (e.g. last 4 by default)
- Avoids logging or storing unmasked phone numbers in examples and documentation
- Clarifies scope as a **display‑only** utility (no validation, storage, hashing, or encryption)