import { IconMap } from "../components/Icons";
import { ROUTES } from "../navigation/routes";

export const MENU_ICON_MAP = {
  regentSprinke: IconMap.regentSprinke,
  document: IconMap.document,
  more: IconMap.threedot,
};

export const getMenuIcon = icon => {
  if (typeof icon === "number") return icon;
  return MENU_ICON_MAP[icon] || IconMap.threedotAlt;
};

export const getActiveMenuItems = items => {
  return (items || []).filter(item => item?.active === true);
};

export const RESERVED_MORE_ITEM = {
  id: ROUTES.MORE,
  name: "More",
  icon: IconMap.threedot,
  isReserved: true,
};
