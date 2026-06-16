import type { AppMenuItem } from "./types";

const menuKeyMap = new WeakMap<object, string>();

function createFallbackUuid(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const random = Math.floor(Math.random() * 16);
    const value = char === "x" ? random : (random & 0x3) | 0x8;

    return value.toString(16);
  });
}

export function createMenuKey(): string {
  return globalThis.crypto?.randomUUID?.() ?? createFallbackUuid();
}

export function resolveMenuKey<TMeta>(menu: AppMenuItem<TMeta>): string {
  if (menu.key) {
    return menu.key;
  }

  const cachedKey = menuKeyMap.get(menu);

  if (cachedKey) {
    return cachedKey;
  }

  const generatedKey = createMenuKey();
  menuKeyMap.set(menu, generatedKey);

  return generatedKey;
}
