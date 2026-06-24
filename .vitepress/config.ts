import { defineConfig, type DefaultTheme } from "vitepress";
import { listPackageDocs } from "./package-docs";

const packageDocs = listPackageDocs();
const docsBase = process.env.DOCS_BASE ?? "/";
const staticRewrites = {
  "docs/index.md": "index.md",
  "docs/guide.md": "guide.md",
  "docs/development.md": "development.md",
  "docs/release.md": "release.md",
  "docs/packages/README.md": "packages/index.md",
};

const packageRewrites = packageDocs.reduce<Record<string, string>>(
  (rewrites, pkg) => {
    for (const page of pkg.pages) {
      rewrites[`packages/${pkg.dirName}/docs/${page.relativePath}`] =
        page.routePath.replace(/^\//, "").replace(/\/$/, "/index") + ".md";
    }

    return rewrites;
  },
  {},
);

const packageNavItems = packageDocs.map((pkg) => ({
  text: pkg.displayName,
  link: pkg.pages[0].routePath,
}));

const packageSidebars = packageDocs.reduce<
  Record<string, DefaultTheme.SidebarItem[]>
>((sidebars, pkg) => {
  sidebars[`/packages/${pkg.routeSegment}/`] = [
    {
      text: pkg.displayName,
      items: pkg.pages.map((page) => ({
        text: page.title,
        link: page.routePath,
      })),
    },
  ];

  return sidebars;
}, {});

export default defineConfig({
  base: docsBase,
  title: "Web Admin Kit",
  description: "面向中后台项目的 TypeScript 工具包与共享 SDK 文档站。",
  lang: "zh-CN",
  cleanUrls: true,
  srcExclude: [
    ".vitepress/cache/**",
    ".vitepress/dist/**",
    "coverage/**",
    "node_modules/**",
    "packages/*/dist/**",
  ],
  vite: {
    server: {
      watch: {
        ignored: [
          "**/.vitepress/cache/**",
          "**/.vitepress/dist/**",
          "**/coverage/**",
          "**/packages/*/dist/**",
        ],
      },
    },
  },
  lastUpdated: true,
  rewrites: {
    ...staticRewrites,
    ...packageRewrites,
  },
  themeConfig: {
    nav: [
      {
        text: "API 文档",
        items: packageNavItems,
      },
      { text: "贡献手册", link: "/development" },
    ],
    sidebar: {
      "/": [
        {
          text: "贡献手册",
          items: [
            { text: "项目说明", link: "/guide" },
            { text: "参与开发", link: "/development" },
            { text: "发版说明", link: "/release" },
          ],
        },
      ],
      "/packages/": [
        {
          text: "包文档",
          items: [{ text: "总览", link: "/packages/" }, ...packageNavItems],
        },
      ],
      ...packageSidebars,
    },
    search: {
      provider: "local",
    },
    outline: {
      level: [2, 3],
      label: "本页目录",
    },
    docFooter: {
      prev: "上一页",
      next: "下一页",
    },
    lastUpdated: {
      text: "最后更新",
    },
  },
});
