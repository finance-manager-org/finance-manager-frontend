import { describe, it, expect } from "vitest";
import {
  validateEmail,
  validatePassword,
  validateAge,
  validateName,
  getPasswordErrors,
} from "../lib/validations";

/**
 * Additional tests for Signup page validation (HU10)
 * These tests complement the main validation tests
 */
describe("Signup Page Validation - HU10", () => {
  describe("Email validation for signup", () => {
    it("should accept valid signup emails", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("newuser123@domain.co")).toBe(true);
    });

    it("should reject invalid signup emails", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("notanemail")).toBe(false);
      expect(validateEmail("@nodomain.com")).toBe(false);
    });
  });

  describe("Password validation for signup", () => {
    it("should enforce all password requirements", () => {
      expect(validatePassword("SecurePass123!")).toBe(true);
      expect(validatePassword("weak")).toBe(false);
      expect(validatePassword("NoNumbers!")).toBe(false);
    });

    it("should provide detailed password errors", () => {
      const errors = getPasswordErrors("weak");
      expect(errors.length).toBeGreaterThan(0);
      expect(errors).toContain("Mínimo 8 caracteres");
    });
  });

  describe("Age validation for signup", () => {
    it("should enforce minimum age of 13", () => {
      expect(validateAge("13")).toBe(true);
      expect(validateAge("18")).toBe(true);
      expect(validateAge("12")).toBe(false);
      expect(validateAge("5")).toBe(false);
    });

    it("should reject invalid age formats", () => {
      expect(validateAge("")).toBe(false);
      expect(validateAge("abc")).toBe(false);
      expect(validateAge("-5")).toBe(false);
    });
  });

  describe("Name validation for signup", () => {
    it("should require minimum 2 characters", () => {
      expect(validateName("Juan")).toBe(true);
      expect(validateName("María")).toBe(true);
      expect(validateName("A")).toBe(false);
      expect(validateName("")).toBe(false);
    });

    it("should accept names with spaces and accents", () => {
      expect(validateName("Juan Pérez")).toBe(true);
      expect(validateName("María José García")).toBe(true);
      expect(validateName("Sofía Rodríguez")).toBe(true);
    });

    it("should reject names with numbers or special characters", () => {
      expect(validateName("Juan123")).toBe(false);
      expect(validateName("User@Name")).toBe(false);
    });
  });

  describe("Complete signup form validation", () => {
    it("should validate all fields for a complete signup", () => {
      const signupData = {
        name: "Juan Pérez",
        email: "juan.perez@example.com",
        password: "SecurePass123!",
        age: "25",
      };

      expect(validateName(signupData.name)).toBe(true);
      expect(validateEmail(signupData.email)).toBe(true);
      expect(validatePassword(signupData.password)).toBe(true);
      expect(validateAge(signupData.age)).toBe(true);
    });

    it("should reject invalid signup data", () => {
      const invalidSignupData = {
        name: "J",
        email: "invalid-email",
        password: "weak",
        age: "10",
      };

      expect(validateName(invalidSignupData.name)).toBe(false);
      expect(validateEmail(invalidSignupData.email)).toBe(false);
      expect(validatePassword(invalidSignupData.password)).toBe(false);
      expect(validateAge(invalidSignupData.age)).toBe(false);
    });
  });
});

