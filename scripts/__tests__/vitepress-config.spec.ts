import type { DefaultTheme } from "vitepress";
import { describe, expect, it } from "vitest";

import config from "../../.vitepress/config";
import { listPackageDocs } from "../../.vitepress/package-docs";

function getThemeConfig() {
  return config.themeConfig as DefaultTheme.Config;
}

describe("vitepress docs config", () => {
  it("为每个包提供 API 文档下拉入口", () => {
    const themeConfig = getThemeConfig();
    const navItems = themeConfig.nav ?? [];
    const packageDocs = listPackageDocs();

    expect(navItems).toEqual([
      {
        text: "API 文档",
        items: packageDocs.map((pkg) => ({
          text: pkg.displayName,
          link: pkg.pages[0].routePath,
        })),
      },
      { text: "贡献手册", link: "/development" },
    ]);
  });

  it("为每个包生成独立的 sidebar，并保留页面大纲配置", () => {
    const themeConfig = getThemeConfig();
    const sidebar = themeConfig.sidebar as DefaultTheme.SidebarMulti;
    const packageDocs = listPackageDocs();

    expect(sidebar["/packages/"]).toEqual([
      {
        text: "包文档",
        items: [
          { text: "总览", link: "/packages/" },
          ...packageDocs.map((pkg) => ({
            text: pkg.displayName,
            link: pkg.pages[0].routePath,
          })),
        ],
      },
    ]);

    for (const pkg of packageDocs) {
      expect(sidebar[`/packages/${pkg.routeSegment}/`]).toEqual([
        {
          text: pkg.displayName,
          items: pkg.pages.map((page) => ({
            text: page.title,
            link: page.routePath,
          })),
        },
      ]);
    }

    expect(themeConfig.outline).toEqual({
      level: [2, 3],
      label: "本页目录",
    });
  });
});
