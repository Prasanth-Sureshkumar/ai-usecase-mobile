import { IconMap } from "../components/Icons";

const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockMenus = [
  {
    id: "regent-ai",
    name: "Regent AI",
    icon: IconMap.regentSprinkle,
    url: "https://www.youtube.com/"
  },
  {
    id: "my-docs",
    name: "My Docs",
    icon: IconMap.document,
    url: "https://www.youtube.com/"
  }
];

export async function getMenus() {
  await delay();
  return mockMenus;
}
