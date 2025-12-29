<template>
  <div v-if="open" class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6" @click="onBackdrop">
    <div class="w-full max-w-3xl rounded-2xl bg-white shadow-xl overflow-hidden">
      <div class="flex items-start justify-between gap-4 p-5 border-b">
        <div>
          <div class="text-lg font-extrabold">
            {{ lab?.lab_name_ch }}
            <span class="ml-2 text-sm font-medium text-neutral-500">{{ lab?.lab_name_en }}</span>
          </div>
          <div class="text-sm text-neutral-500 mt-1">Unit: {{ lab?.lab_unit }}</div>
        </div>

        <button class="w-9 h-9 rounded-full border hover:bg-neutral-50" @click="emit('close')">✕</button>
      </div>

      <div class="p-5">
        <LineChartECharts v-if="lab" :lab="lab" />
      </div>
    </div>
  </div>
</template>

<script setup>
import LineChartECharts from "./LineChartECharts.vue";

const props = defineProps({
  open: { type: Boolean, default: false },
  lab: { type: Object, default: null },
});
const emit = defineEmits(["close"]);

function onBackdrop(e) {
  if (e.target === e.currentTarget) emit("close");
}
</script>
