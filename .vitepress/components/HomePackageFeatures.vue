<script setup lang="ts">
import type { PackageDocData } from "../package-docs.data";

defineProps<{
  packages: PackageDocData[];
}>();
</script>

<template>
  <section class="package-overview">
    <header class="package-overview__header">
      <h2 class="package-overview__title">项目组成</h2>
    </header>

    <div class="package-overview__grid">
      <a
        v-for="pkg in packages"
        :key="pkg.name"
        :href="pkg.link"
        class="package-overview__card"
      >
        <div class="package-overview__meta">
          <h3 class="package-overview__name">{{ pkg.name }}</h3>
          <span class="package-overview__badge">v{{ pkg.version }}</span>
        </div>
        <p class="package-overview__summary">{{ pkg.summary }}</p>
      </a>
    </div>
  </section>
</template>

<style scoped>
.package-overview {
  margin: 0 auto;
  max-width: 1152px;
  padding: 24px;
}

.package-overview__header {
  margin-bottom: 24px;
}

.package-overview__title {
  margin: 0;
  font-size: 28px;
  line-height: 1.2;
  font-weight: 600;
}

.package-overview__description {
  margin: 12px 0 0;
  color: var(--vp-c-text-2);
  font-size: 16px;
  line-height: 1.6;
}

.package-overview__grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.package-overview__card {
  display: flex;
  min-height: 220px;
  flex-direction: column;
  gap: 16px;
  color: inherit;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 16px;
  background: var(--vp-c-bg-soft);
  padding: 24px;
  text-decoration: none;
  transition:
    border-color 0.25s ease,
    background-color 0.25s ease,
    transform 0.25s ease;
}

.package-overview__card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-bg-soft-up);
  text-decoration: none;
  transform: translateY(-2px);
}

.package-overview__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.package-overview__name {
  margin: 0;
  color: var(--vp-c-text-1);
  font-size: 20px;
  line-height: 1.4;
  font-weight: 600;
}

.package-overview__badge {
  flex-shrink: 0;
  border: 1px solid color-mix(in srgb, var(--vp-c-brand-1) 30%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--vp-c-brand-1) 12%, transparent);
  color: var(--vp-c-brand-1);
  padding: 4px 10px;
  font-size: 12px;
  line-height: 1;
  font-weight: 600;
}

.package-overview__summary {
  margin: 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.7;
}

.package-overview__count {
  margin-top: auto;
  color: var(--vp-c-text-3);
  font-size: 13px;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .package-overview {
    padding: 16px;
  }

  .package-overview__grid {
    grid-template-columns: 1fr;
  }

  .package-overview__card {
    min-height: 0;
  }

  .package-overview__meta {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
