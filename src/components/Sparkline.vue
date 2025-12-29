<template>
  <svg :width="width" :height="height" viewBox="0 0 70 26" class="opacity-90">
    <polyline v-if="points" :points="points" fill="none" stroke="currentColor" stroke-width="2" />
  </svg>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  values: { type: Array, default: () => [] },
  width: { type: Number, default: 70 },
  height: { type: Number, default: 26 },
});

const points = computed(() => {
  const vals = props.values.filter(v => typeof v === "number" && Number.isFinite(v));
  if (vals.length < 2) return "";

  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const range = max - min || 1;

  return vals
    .map((v, i) => {
      const x = (i / (vals.length - 1)) * props.width;
      const y = props.height - ((v - min) / range) * props.height;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
});
</script>
