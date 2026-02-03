import { describe, it, expect } from "vitest";
import { maskPhone } from "../src/index";

describe("maskPhone", () => {
  describe("Basic functionality", () => {
    it("should mask phone with default options (show last 4 digits)", () => {
      expect(maskPhone("1234567890")).toBe("******7890");
    });

    it("should accept number input", () => {
      expect(maskPhone(1234567890)).toBe("******7890");
    });

    it("should handle different phone lengths", () => {
      expect(maskPhone("628123456789")).toBe("********6789"); // 12 digits (Indonesia)
      expect(maskPhone("+14155552671")).toBe("+*******2671"); // 11 digits with + (US)
      expect(maskPhone("442071234567")).toBe("********4567"); // 12 digits (UK)
      expect(maskPhone("33123456789")).toBe("*******6789"); // 11 digits (France)
    });
  });

  describe("Input handling", () => {
    it("should handle null input", () => {
      expect(maskPhone(null as any)).toBe("");
    });

    it("should handle undefined input", () => {
      expect(maskPhone(undefined as any)).toBe("");
    });

    it("should handle empty string", () => {
      expect(maskPhone("")).toBe("");
    });

    it("should strip non-digit characters (preserveFormat: false)", () => {
      expect(maskPhone("+1-234-567-8901")).toBe("+*******8901");
      expect(maskPhone("+1 (234) 567-8901")).toBe("+*******8901");
      expect(maskPhone("+62 812 3456 7890")).toBe("+*********7890");
    });

    it("should handle input with only non-digits", () => {
      expect(maskPhone("abcd-efgh")).toBe("abcd-efgh");
    });

    it("should preserve + sign in international format", () => {
      expect(maskPhone("+1234567890")).toBe("+******7890");
    });
  });

  describe("maskChar option", () => {
    it("should use custom mask character", () => {
      expect(maskPhone("1234567890", { maskChar: "•" })).toBe("••••••7890");
    });

    it("should use X as mask character", () => {
      expect(maskPhone("1234567890", { maskChar: "X" })).toBe("XXXXXX7890");
    });

    it("should use # as mask character", () => {
      expect(maskPhone("1234567890", { maskChar: "#" })).toBe("######7890");
    });
  });

  describe("showFirst option", () => {
    it("should show first 3 digits", () => {
      expect(maskPhone("1234567890", { showFirst: 3 })).toBe("123***7890");
    });

    it("should show first 2 digits", () => {
      expect(maskPhone("628123456789", { showFirst: 2 })).toBe("62******6789");
    });

    it("should show only first digit", () => {
      expect(maskPhone("1234567890", { showFirst: 1, showLast: 0 })).toBe(
        "1*********",
      );
    });

    it("should handle showFirst larger than phone length", () => {
      expect(maskPhone("1234567890", { showFirst: 20 })).toBe("1234567890");
    });
  });

  describe("showLast option", () => {
    it("should show last 2 digits", () => {
      expect(maskPhone("1234567890", { showLast: 2 })).toBe("********90");
    });

    it("should show last 6 digits", () => {
      expect(maskPhone("628123456789", { showLast: 6 })).toBe("******456789");
    });

    it("should hide all digits", () => {
      expect(maskPhone("1234567890", { showFirst: 0, showLast: 0 })).toBe(
        "**********",
      );
    });

    it("should handle showLast larger than phone length", () => {
      expect(maskPhone("1234567890", { showLast: 20 })).toBe("1234567890");
    });
  });

  describe("showStart and showEnd aliases", () => {
    it("showStart should work as alias for showFirst", () => {
      expect(maskPhone("1234567890", { showStart: 3 })).toBe("123***7890");
    });

    it("showEnd should work as alias for showLast", () => {
      expect(maskPhone("1234567890", { showEnd: 2 })).toBe("********90");
    });

    it("should prioritize showFirst over showStart", () => {
      expect(maskPhone("1234567890", { showFirst: 2, showStart: 3 })).toBe(
        "12****7890",
      );
    });

    it("should prioritize showLast over showEnd", () => {
      expect(maskPhone("1234567890", { showLast: 2, showEnd: 3 })).toBe(
        "********90",
      );
    });
  });

  describe("Combined showFirst and showLast", () => {
    it("should show first 3 and last 4 (most common)", () => {
      expect(maskPhone("628123456789", { showFirst: 3, showLast: 4 })).toBe(
        "628*****6789",
      );
    });

    it("should show first 2 and last 2", () => {
      expect(maskPhone("1234567890", { showFirst: 2, showLast: 2 })).toBe(
        "12******90",
      );
    });

    it("should handle when showFirst + showLast equals total length", () => {
      expect(maskPhone("1234567890", { showFirst: 5, showLast: 5 })).toBe(
        "1234567890",
      );
    });

    it("should handle when showFirst + showLast exceeds total length", () => {
      expect(maskPhone("1234567890", { showFirst: 6, showLast: 6 })).toBe(
        "1234567890",
      );
    });
  });

  describe("preserveFormat option", () => {
    it("should preserve spacing", () => {
      expect(maskPhone("+1 555 123 4567", { preserveFormat: true })).toBe(
        "+* *** *** 4567",
      );
    });

    it("should preserve dashes", () => {
      expect(maskPhone("+1-555-123-4567", { preserveFormat: true })).toBe(
        "+*-***-***-4567",
      );
    });

    it("should preserve parentheses (US format)", () => {
      expect(maskPhone("+1 (555) 123-4567", { preserveFormat: true })).toBe(
        "+* (***) ***-4567",
      );
    });

    it("should preserve dots", () => {
      expect(maskPhone("+62.812.3456.7890", { preserveFormat: true })).toBe(
        "+**.***.****.7890",
      );
    });

    it("should preserve mixed separators", () => {
      expect(maskPhone("+1 (555) 123-4567", { preserveFormat: true })).toBe(
        "+* (***) ***-4567",
      );
    });

    it("should preserve format with custom showFirst", () => {
      expect(
        maskPhone("+62 812 3456 7890", {
          preserveFormat: true,
          showFirst: 3,
        }),
      ).toBe("+62 8** **** 7890");
    });

    it("should handle input without formatting", () => {
      expect(maskPhone("1234567890", { preserveFormat: true })).toBe(
        "******7890",
      );
    });

    it("should preserve + in international numbers", () => {
      expect(maskPhone("+1234567890", { preserveFormat: true })).toBe(
        "+******7890",
      );
    });
  });

  describe("visibleRanges option", () => {
    it("should show specific ranges", () => {
      expect(
        maskPhone("628123456789", {
          visibleRanges: [
            [0, 2],
            [8, 11],
          ],
        }),
      ).toBe("628*****6789");
    });

    it("should show single range", () => {
      expect(maskPhone("1234567890", { visibleRanges: [[0, 2]] })).toBe(
        "123*******",
      );
    });

    it("should show multiple non-contiguous ranges", () => {
      expect(
        maskPhone("+441234567890", {
          visibleRanges: [
            [0, 2],
            [6, 8],
          ],
        }),
      ).toBe("+44***456****");
    });

    it("should handle overlapping ranges", () => {
      expect(
        maskPhone("1234567890", {
          visibleRanges: [
            [0, 3],
            [2, 5],
          ],
        }),
      ).toBe("123456****");
    });

    it("should work with preserveFormat", () => {
      expect(
        maskPhone("+1 (555) 123-4567", {
          visibleRanges: [
            [0, 3],
            [12, 15],
          ],
          preserveFormat: true,
        }),
      ).toBe("+1 (555) ***-****");
    });

    it("visibleRanges should override showFirst/showLast", () => {
      expect(
        maskPhone("1234567890", {
          showFirst: 2,
          showLast: 2,
          visibleRanges: [[4, 6]],
        }),
      ).toBe("****567***");
    });
  });

  describe("customMask option", () => {
    it("should use custom masking function", () => {
      expect(
        maskPhone("1234567890", {
          customMask: (char, idx) => (idx % 2 === 0 ? "*" : char),
        }),
      ).toBe("*2*4*6*8*0");
    });

    it("should mask only vowels", () => {
      expect(
        maskPhone("1234567890", {
          customMask: (char, idx) =>
            ["1", "3", "5", "7", "9"].includes(char) ? "*" : char,
        }),
      ).toBe("*2*4*6*8*0");
    });

    it("should access full phone string in customMask", () => {
      expect(
        maskPhone("1234567890", {
          customMask: (char, idx, phone) =>
            idx < phone.length / 2 ? "*" : char,
        }),
      ).toBe("*****67890");
    });

    it("customMask should override all other options", () => {
      expect(
        maskPhone("1234567890", {
          showFirst: 3,
          showLast: 3,
          customMask: (char) => "#",
        }),
      ).toBe("##########");
    });

    it("should work with preserveFormat", () => {
      expect(
        maskPhone("+1 (555) 123-4567", {
          preserveFormat: true,
          customMask: (char, idx) =>
            char.match(/\d/) && idx % 2 === 0 ? "X" : char,
        }),
      ).toBe("+1 (X5X) 1X3-4X6X");
    });
  });

  describe("Real phone formats (international)", () => {
    it("should mask US phone number", () => {
      expect(maskPhone("+1 (415) 555-2671")).toBe("+*******2671");
      expect(maskPhone("+1 (415) 555-2671", { preserveFormat: true })).toBe(
        "+* (***) ***-2671",
      );
    });

    it("should mask UK phone number", () => {
      expect(maskPhone("+44 20 7123 4567")).toBe("+********4567");
      expect(maskPhone("+44 20 7123 4567", { preserveFormat: true })).toBe(
        "+** ** **** 4567",
      );
    });

    it("should mask Indonesia phone number", () => {
      expect(maskPhone("+62 812 3456 7890")).toBe("+*********7890");
      expect(maskPhone("+62 812 3456 7890", { preserveFormat: true })).toBe(
        "+** *** **** 7890",
      );
    });

    it("should mask France phone number", () => {
      expect(maskPhone("+33 1 23 45 67 89")).toBe("+*******6789");
      expect(maskPhone("+33 1 23 45 67 89", { preserveFormat: true })).toBe(
        "+** * ** ** 67 89",
      );
    });

    it("should mask Japan phone number", () => {
      expect(maskPhone("+81 3-1234-5678")).toBe("+*******5678");
      expect(maskPhone("+81 3-1234-5678", { preserveFormat: true })).toBe(
        "+** *-****-5678",
      );
    });

    it("should mask Australia phone number", () => {
      expect(maskPhone("+61 2 1234 5678")).toBe("+*******5678");
      expect(maskPhone("+61 2 1234 5678", { preserveFormat: true })).toBe(
        "+** * **** 5678",
      );
    });
  });

  describe("Complex scenarios", () => {
    it("should handle multiple options together", () => {
      expect(
        maskPhone("+628123456789", {
          maskChar: "•",
          showFirst: 3,
          preserveFormat: false,
        }),
      ).toBe("+62••••••6789");
    });

    it("should combine preserveFormat with custom mask char", () => {
      expect(
        maskPhone("+1 (555) 123-4567", {
          preserveFormat: true,
          maskChar: "X",
        }),
      ).toBe("+X (XXX) XXX-4567");
    });

    it("should handle all basic options combined", () => {
      expect(
        maskPhone("628123456789", {
          maskChar: "#",
          showFirst: 3,
          showLast: 4,
        }),
      ).toBe("628#####6789");
    });

    it("should prioritize customMask over everything", () => {
      expect(
        maskPhone("+1 (555) 123-4567", {
          showFirst: 3,
          showLast: 4,
          preserveFormat: true,
          customMask: (char) => (char.match(/\d/) ? "9" : char),
        }),
      ).toBe("+9 (999) 999-9999");
    });
  });

  describe("Edge cases", () => {
    it("should handle very short phone number", () => {
      expect(maskPhone("12345")).toBe("*2345");
    });

    it("should handle single digit", () => {
      expect(maskPhone("4")).toBe("4");
    });

    it("should handle two digits", () => {
      expect(maskPhone("45")).toBe("45");
    });

    it("should handle three digits", () => {
      expect(maskPhone("453")).toBe("453");
    });

    it("should handle four digits (exactly showLast default)", () => {
      expect(maskPhone("4532")).toBe("4532");
    });

    it("should handle five digits", () => {
      expect(maskPhone("45321")).toBe("*5321");
    });

    it("should handle whitespace only", () => {
      expect(maskPhone("   ")).toBe("");
    });

    it("should handle mixed valid and invalid characters", () => {
      expect(maskPhone("1a2b3c4d5e6f7g8h9i0j")).toBe("******7890");
    });

    it("should handle phone with only + sign", () => {
      expect(maskPhone("+")).toBe("+");
    });

    it("should handle multiple + signs (keep only first)", () => {
      expect(maskPhone("++1234567890")).toBe("++******7890");
    });

    it("should handle very long phone number", () => {
      expect(maskPhone("123456789012345678901234567890")).toBe(
        "**************************7890",
      );
    });
  });

  describe("Security considerations", () => {
    it("should not expose internal implementation details", () => {
      const result = maskPhone("1234567890");
      expect(result).not.toContain("1234");
      expect(result).toContain("7890");
    });

    it("should handle potential injection in customMask", () => {
      const maliciousInput = "1234567890";
      expect(() =>
        maskPhone(maliciousInput, {
          customMask: (char) => char,
        }),
      ).not.toThrow();
    });

    it("should safely handle extremely large showFirst/showLast", () => {
      expect(
        maskPhone("1234567890", {
          showFirst: Number.MAX_SAFE_INTEGER,
          showLast: Number.MAX_SAFE_INTEGER,
        }),
      ).toBe("1234567890");
    });

    it("should handle negative showFirst/showLast gracefully", () => {
      expect(maskPhone("1234567890", { showFirst: -1, showLast: -1 })).toBe(
        "**********",
      );
    });
  });

  describe("Type coercion", () => {
    it("should handle BigInt input", () => {
      expect(maskPhone(1234567890n as any)).toBe("******7890");
    });

    it("should handle boolean input", () => {
      expect(maskPhone(true as any)).toBe("true");
    });

    it("should handle object input", () => {
      expect(maskPhone({ phone: "123" } as any)).toBe("123");
    });
  });

  describe("Performance edge cases", () => {
    it("should handle very long phone numbers efficiently", () => {
      const longPhone = "1".repeat(1000);
      const start = Date.now();
      maskPhone(longPhone);
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100); // Should complete in less than 100ms
    });

    it("should handle many format characters efficiently", () => {
      const formattedPhone = "+1-2-3-4-5-6-7-8-9-0-1-2-3-4-5-6-7-8-9-0";
      const start = Date.now();
      maskPhone(formattedPhone, { preserveFormat: true });
      const duration = Date.now() - start;
      expect(duration).toBeLessThan(100);
    });
  });

  describe("Locale-agnostic behavior", () => {
    it("should work with any country format without assumptions", () => {
      // Brazil
      expect(maskPhone("+55 11 91234-5678")).toBe("+*********5678");

      // Germany
      expect(maskPhone("+49 30 12345678")).toBe("+********5678");

      // China
      expect(maskPhone("+86 138 0013 8000")).toBe("+*********8000");

      // Russia
      expect(maskPhone("+7 495 123-45-67")).toBe("+*******4567");
    });

    it("should not make assumptions about number length", () => {
      expect(maskPhone("123")).toBe("123"); // Too short to mask
      expect(maskPhone("12345")).toBe("*2345");
      expect(maskPhone("123456789012345")).toBe("***********2345");
    });
  });
});
