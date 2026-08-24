import { IconMap } from "../components/Icons";

export const mockMenus = [
  {
    id: "my-docs",
    name: "My Docs",
    icon: IconMap.document,
    url: "https://www.youtube.com",
  },
  {
    id: "regent-ai",
    name: "Regent AI",
    icon: IconMap.regentSprinke,
    url: "https://chatgpt.com/share/6a874c29-a0ac-83ee-bfc4-a787307faee2",
  },
];
export const getMenus = async () => {
  return mockMenus;
};
