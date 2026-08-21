import { PRE_LOGIN_SCENARIOS } from "../types/auth";

const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

export const AUTH_MOCK_CONFIG = {
  preLoginScenario: PRE_LOGIN_SCENARIOS.SMART,
  acceptedOtp: "123456",
  acceptedPassword: "password"
};

export async function validatePreLogin(email) {
  await delay();
  const normalizedEmail = email.trim().toLowerCase();
  const scenario = AUTH_MOCK_CONFIG.preLoginScenario;

  if (scenario === PRE_LOGIN_SCENARIOS.BACKEND_ERROR || normalizedEmail === "error@regents.school") {
    return {
      success: false,
      userExists: false,
      message: "Unable to validate your details. Please try again."
    };
  }

  if (scenario === PRE_LOGIN_SCENARIOS.EXISTING_USER || normalizedEmail === "regentsschool@gmail.com") {
    return { success: true, userExists: true };
  }

  if (
    scenario === PRE_LOGIN_SCENARIOS.NEW_USER ||
    normalizedEmail === "newuser@regents.school" ||
    normalizedEmail.endsWith("@new.test")
  ) {
    return { success: true, userExists: false };
  }

  return {
    success: false,
    userExists: false,
    message: "We couldn't find an invitation for this email address.",
    detail: "Please enter the email ID that you received in your invitation."
  };
}

export async function login(email, password) {
  await delay();
  if (email.trim().toLowerCase() === "error@regents.school") {
    return { success: false, message: "Unable to login right now. Please try again." };
  }
  if (!password) return { success: false, message: "Please enter your password." };
  return {
    success: true,
    token: "mock-regent-token",
    user: {
      name: "Regents User",
      email: email.trim().toLowerCase()
    }
  };
}

export async function sendOtp(email) {
  await delay(500);
  if (!email.trim()) return { success: false, message: "Email address is required." };
  return { success: true, message: "OTP sent successfully." };
}

export async function register(payload) {
  await delay();
  if (payload.email.trim().toLowerCase() === "error@regents.school") {
    return { success: false, message: "Unable to create account. Please try again." };
  }
  if (payload.otp !== AUTH_MOCK_CONFIG.acceptedOtp) {
    return { success: false, message: "Invalid OTP. Use 123456 for the mock flow." };
  }
  return { success: true };
}

export async function logout() {
  await delay(350);
  return { success: true };
}

export async function updatePersonalInformation(payload) {
  await delay(650);
  if (payload.email?.trim().toLowerCase() === "error@regents.school") {
    return { success: false, message: "Unable to update personal information." };
  }
  return { success: true, user: payload };
}

export async function changePassword({ currentPassword, newPassword }) {
  await delay(650);
  if (!currentPassword || !newPassword) {
    return { success: false, message: "Please complete both password fields." };
  }
  if (currentPassword === "wrongpassword") {
    return { success: false, message: "Current password is incorrect." };
  }
  return { success: true };
}

export async function deactivateAccount() {
  await delay(700);
  return { success: true };
}
