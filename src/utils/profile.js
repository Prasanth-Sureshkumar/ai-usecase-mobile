export const getUserFullName = user => {
  return [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim();
};
export const getDisplayName = (user, fallback = "User") => {
  return getUserFullName(user) || user?.email || fallback;
};
export const getDisplayDate = value => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};
export const toApiDate = value => {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
};
export const calculateProfileCompletion = user => {
  const profileFields = [
    user?.firstName,
    user?.lastName,
    user?.email,
    user?.dateOfBirth,
    user?.gender,
    user?.phoneNumber,
    user?.picture,
  ];

  const completedFields = profileFields.filter(
    value => value !== null && value !== undefined && value !== "",
  ).length;

  return Math.round((completedFields / profileFields.length) * 100);
};
export const getMissingProfileFields = user => {
  const fields = [
    ["First name", user?.firstName],
    ["Last name", user?.lastName],
    ["Email", user?.email],
    ["Date of birth", user?.dateOfBirth],
    ["Gender", user?.gender],
    ["Phone number", user?.phoneNumber],
    ["Profile picture", user?.picture],
  ];

  return fields
    .filter(
      ([, value]) => value === null || value === undefined || value === "",
    )
    .map(([label]) => label);
};
