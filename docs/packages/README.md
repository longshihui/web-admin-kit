# 包文档总览

<!-- markdownlint-disable MD033 -->
<script setup lang="ts">
import { data as packageDocs } from '../../.vitepress/package-docs.data'
</script>

项目中的每个包都在自己的 `docs/` 目录维护文档，根级 `VitePress` 负责统一聚合路由、侧边栏和搜索索引。

## 结构约定

- 包文档统一放在 `packages/<name>/docs/`。
- 每个包使用 `docs/README.md` 作为文档入口。
- 每个包使用 `docs/config.json` 声明文档顺序和标题。
- 根级 `.vitepress` 只读取配置并构建站点，不再硬编码单个包结构。

## 包列表

<ul>
  <li v-for="pkg in packageDocs" :key="pkg.name">
    <a :href="pkg.link">{{ pkg.name }}</a>
    <span> - {{ pkg.summary }}（{{ pkg.pageCount }} 篇）</span>
  </li>
</ul>
<!-- markdownlint-enable MD033 -->
