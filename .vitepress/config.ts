import { defineConfig, type DefaultTheme } from 'vitepress'
import { listPackageDocs } from './package-docs'

const packageDocs = listPackageDocs()

const packageRewrites = packageDocs.reduce<Record<string, string>>((rewrites, pkg) => {
  for (const page of pkg.pages) {
    rewrites[`packages/${pkg.dirName}/docs/${page.relativePath}`] =
      page.routePath.replace(/^\//, '').replace(/\/$/, '/index') + '.md'
  }

  return rewrites
}, {})

const packageSidebarItems: DefaultTheme.SidebarItem[] = packageDocs.map((pkg) => ({
  text: pkg.displayName,
  collapsed: false,
  items: pkg.pages.map((page) => ({
    text: page.title,
    link: page.routePath
  }))
}))

export default defineConfig({
  title: 'Web Admin Kit',
  description: 'Framework-agnostic TypeScript utilities and SDKs for web admin products.',
  lang: 'zh-CN',
  cleanUrls: true,
  srcExclude: [
    '.vitepress/cache/**',
    '.vitepress/dist/**',
    'coverage/**',
    'node_modules/**',
    'packages/*/dist/**'
  ],
  vite: {
    server: {
      watch: {
        ignored: [
          '**/.vitepress/cache/**',
          '**/.vitepress/dist/**',
          '**/coverage/**',
          '**/packages/*/dist/**'
        ]
      }
    }
  },
  lastUpdated: true,
  rewrites: packageRewrites,
  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Packages', link: '/packages/' }
    ],
    sidebar: {
      '/packages/': [
        {
          text: 'Packages',
          items: [
            { text: 'Overview', link: '/packages/' },
            ...packageSidebarItems
          ]
        }
      ]
    },
    search: {
      provider: 'local'
    },
    outline: {
      level: [2, 3],
      label: 'On this page'
    },
    docFooter: {
      prev: 'Previous page',
      next: 'Next page'
    },
    lastUpdated: {
      text: 'Updated at'
    }
  }
})
