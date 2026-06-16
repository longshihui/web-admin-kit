# Packages

Package documentation is sourced from each `packages/*/docs` directory and exposed in this section.

<script setup lang="ts">
import { data as packages } from '../.vitepress/package-docs.data'
</script>

<ul>
  <li v-for="pkg in packages" :key="pkg.name">
    <a :href="pkg.link">{{ pkg.name }}</a>
    <span> - {{ pkg.pageCount }} page{{ pkg.pageCount === 1 ? '' : 's' }}</span>
  </li>
</ul>
