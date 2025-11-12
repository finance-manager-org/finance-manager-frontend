import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword } from "../lib/validations";

/**
 * Tests for Login page validation (HU11)
 */
describe("Login Page Validation - HU11", () => {
  describe("Email validation for login", () => {
    it("should accept valid login emails", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("admin@company.org")).toBe(true);
      expect(validateEmail("test.user+tag@domain.co.uk")).toBe(true);
    });

    it("should reject invalid login emails", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("notanemail")).toBe(false);
      expect(validateEmail("missing@domain")).toBe(false);
      expect(validateEmail("@nodomain.com")).toBe(false);
    });
  });

  describe("Password validation for login", () => {
    it("should validate password format for login", () => {
      // Login accepts any strong password that meets requirements
      expect(validatePassword("SecurePass123!")).toBe(true);
      expect(validatePassword("MyP@ssw0rd")).toBe(true);
      expect(validatePassword("Complex1ty!")).toBe(true);
    });

    it("should reject weak passwords on login", () => {
      expect(validatePassword("short")).toBe(false);
      expect(validatePassword("nouppercaseorno123!")).toBe(false);
      expect(validatePassword("NOLOWERCASE123!")).toBe(false);
    });
  });

  describe("Complete login form validation", () => {
    it("should validate credentials for existing user", () => {
      const loginData = {
        email: "existing.user@example.com",
        password: "UserPass123!",
      };

      expect(validateEmail(loginData.email)).toBe(true);
      expect(validatePassword(loginData.password)).toBe(true);
    });

    it("should reject invalid login credentials", () => {
      const invalidLoginData = {
        email: "invalid-email",
        password: "weak",
      };

      expect(validateEmail(invalidLoginData.email)).toBe(false);
      expect(validatePassword(invalidLoginData.password)).toBe(false);
    });
  });

  describe("Login edge cases", () => {
    it("should handle empty form submission", () => {
      expect(validateEmail("")).toBe(false);
      expect(validatePassword("")).toBe(false);
    });

    it("should handle whitespace-only inputs", () => {
      expect(validateEmail("   ")).toBe(false);
      expect(validatePassword("   ")).toBe(false);
    });
  });
});
