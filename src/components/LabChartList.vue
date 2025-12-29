<template>
  <div class="space-y-3">
    <div
      v-for="lab in labs"
      :key="lab.lab_code"
      class="flex items-center justify-between gap-4 rounded-xl border bg-white p-4"
    >
      <div class="flex items-center gap-4 min-w-0">
        <div class="text-emerald-500">
          <Sparkline :values="toSeries(lab).map(p => p.value)" />
        </div>
        <div class="min-w-0">
          <div class="font-semibold truncate">{{ lab.lab_name_ch }}</div>
          <div class="text-xs text-neutral-500 truncate">{{ lab.lab_name_en }}</div>
        </div>
      </div>

      <div class="flex items-center gap-3">
        <div class="text-right">
          <div class="text-xs text-neutral-500">{{ getLatestRecord(lab.records)?.lab_date ?? "-" }}</div>
          <div class="font-bold">
            {{ getLatestRecord(lab.records)?.lab_value ?? "-" }}
            <span class="text-xs text-neutral-500 ml-1">{{ lab.lab_unit }}</span>
          </div>
        </div>

        <button
          class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-400 hover:bg-orange-400/50 cursor-pointer"
          @click="emit('open-chart', lab)"
          title="Expand"
        >
          🔍
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Sparkline from "./Sparkline.vue";
import { getLatestRecord, toSeries } from "../utils/labs";

defineProps({ labs: { type: Array, default: () => [] } });
const emit = defineEmits(["open-chart"]);
</script>
