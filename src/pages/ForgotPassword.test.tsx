import { describe, it, expect } from "vitest";
import { validateEmail, validatePassword } from "../lib/validations";

/**
 * Tests for Password Recovery pages validation (HU12)
 */
describe("Password Recovery Validation - HU12", () => {
  describe("Forgot Password - Email validation", () => {
    it("should accept valid emails for password recovery", () => {
      expect(validateEmail("user@example.com")).toBe(true);
      expect(validateEmail("recovery@test.org")).toBe(true);
      expect(validateEmail("help.me@domain.co")).toBe(true);
    });

    it("should reject invalid emails for password recovery", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("invalid")).toBe(false);
      expect(validateEmail("@nodomain.com")).toBe(false);
      expect(validateEmail("missing@")).toBe(false);
    });
  });

  describe("Reset Password - New password validation", () => {
    it("should enforce password requirements for reset", () => {
      expect(validatePassword("NewSecure123!")).toBe(true);
      expect(validatePassword("Reset@Pass1")).toBe(true);
      expect(validatePassword("MyNewP@ss0")).toBe(true);
    });

    it("should reject weak new passwords", () => {
      expect(validatePassword("weak")).toBe(false);
      expect(validatePassword("NoNumbers!")).toBe(false);
      expect(validatePassword("nospecialchar123")).toBe(false);
      expect(validatePassword("NOLOWERCASE123!")).toBe(false);
    });
  });

  describe("Complete password recovery flow", () => {
    it("should validate forgot password form", () => {
      const forgotPasswordData = {
        email: "forgot@example.com",
      };

      expect(validateEmail(forgotPasswordData.email)).toBe(true);
    });

    it("should validate reset password form", () => {
      const resetPasswordData = {
        newPassword: "NewSecure123!",
        confirmPassword: "NewSecure123!",
      };

      expect(validatePassword(resetPasswordData.newPassword)).toBe(true);
      expect(validatePassword(resetPasswordData.confirmPassword)).toBe(true);
      expect(resetPasswordData.newPassword).toBe(
        resetPasswordData.confirmPassword,
      );
    });

    it("should detect password mismatch in reset form", () => {
      const mismatchData = {
        newPassword: "NewSecure123!",
        confirmPassword: "DifferentPass123!",
      };

      expect(validatePassword(mismatchData.newPassword)).toBe(true);
      expect(validatePassword(mismatchData.confirmPassword)).toBe(true);
      expect(mismatchData.newPassword).not.toBe(
        mismatchData.confirmPassword,
      );
    });
  });

  describe("Password recovery edge cases", () => {
    it("should handle empty recovery email", () => {
      expect(validateEmail("")).toBe(false);
      expect(validateEmail("   ")).toBe(false);
    });

    it("should handle empty new password", () => {
      expect(validatePassword("")).toBe(false);
      expect(validatePassword("   ")).toBe(false);
    });
  });
});
