---
layout: home

hero:
  name: Web Admin Kit
  text: 面向中后台项目的 TypeScript 工具包与共享 SDK
  tagline: 各包在本地维护文档结构，根级 VitePress 统一聚合构建与检索。
---

<!-- markdownlint-disable MD033 MD041 -->
<script setup lang="ts">
import HomePackageFeatures from '../.vitepress/components/HomePackageFeatures.vue'
import { data as packageDocs } from '../.vitepress/package-docs.data'
</script>

<HomePackageFeatures :packages="packageDocs" />
<!-- markdownlint-enable MD033 MD041 -->
