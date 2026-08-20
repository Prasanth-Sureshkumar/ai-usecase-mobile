const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockMenus = [
  {
    id: "regent-ai",
    name: "Regent AI",
    icon: "sparkles",
    url: "https://www.youtube.com/",
    home: true
  },
  {
    id: "my-docs",
    name: "My Docs",
    icon: "file-text",
    url: "https://www.youtube.com/"
  }
];

export async function getMenus() {
  await delay();
  return mockMenus;
}
