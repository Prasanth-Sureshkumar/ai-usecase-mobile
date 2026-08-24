import { clearAuthSession } from "../api/tokenStorage";

const delay = (ms = 650) => new Promise((resolve) => setTimeout(resolve, ms));

export async function logout() {
  await clearAuthSession();
  return { success: true };
}

export async function updatePersonalInformation(payload) {
  await delay();
  return { success: true, user: payload };
}

export async function changePassword({ currentPassword, newPassword }) {
  await delay();
  if (!currentPassword || !newPassword) {
    return { success: false, message: "Please complete both password fields." };
  }
  return { success: true };
}

export async function deactivateAccount() {
  await delay();
  await clearAuthSession();
  return { success: true };
}
