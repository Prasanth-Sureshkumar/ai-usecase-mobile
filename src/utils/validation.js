export const validateEmail = value => {
  const email = value.trim();
  if (!email) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return "Enter a valid email address.";
  return "";
};
export const validateRequired = (value, label) => {
  if (!String(value || "").trim()) return `${label} is required.`;
  return "";
};
export const validatePassword = value => {
  if (!value) return "Password is required.";
  if (value.length < 8) return "Password must be at least 8 characters.";
  if (value.length > 128) return "Password must be 128 characters or less.";
  return "";
};
export const validateOtp = value => {
  if (!value.trim()) return "OTP is required.";
  if (!/^\d{6}$/.test(value.trim())) return "Enter a 6 digit OTP.";
  return "";
};
export const isValidUrl = url => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (error) {
    return false;
  }
};
