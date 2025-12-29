<template>
  <div class="overflow-auto rounded-xl border bg-white">
    <table class="min-w-225 w-full text-sm">
      <thead class="bg-neutral-50 text-neutral-600">
        <tr>
          <th class="px-3 py-2 text-left w-27.5">Trend</th>
          <th class="px-3 py-2 text-left w-65">Name</th>
          <th class="px-3 py-2 text-left w-22.5">Unit</th>
          <th v-for="d in allDates" :key="d" class="px-3 py-2 text-center whitespace-nowrap">
            {{ d }}
          </th>
          <th class="px-3 py-2 text-center w-17.5"></th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="lab in labs" :key="lab.lab_code" class="border-t">
          <td class="px-3 py-2 text-neutral-700">
            <Sparkline :values="toSeries(lab).map(p => p.value)" class="text-emerald-500" />
          </td>

          <td class="px-3 py-2">
            <div class="font-semibold">{{ lab.lab_name_ch }}</div>
            <div class="text-xs text-neutral-500">{{ lab.lab_name_en }}</div>
          </td>

          <td class="px-3 py-2 text-neutral-600">{{ lab.lab_unit }}</td>

          <td
            v-for="d in allDates"
            :key="lab.lab_code + d"
            class="px-2 py-2 text-center"
          >
            <template v-if="recordMap.get(lab.lab_code)?.get(d)">
              <span
                class="inline-flex items-center justify-center min-w-11 px-2 py-1 rounded-md font-semibold"
                :class="cellClass(recordMap.get(lab.lab_code).get(d).abnormal)"
                :title="recordMap.get(lab.lab_code).get(d).abnormal || ''"
              >
                {{ recordMap.get(lab.lab_code).get(d).lab_value }}
              </span>
            </template>
            <template v-else>
              <span class="text-neutral-300">—</span>
            </template>
          </td>

          <td class="px-3 py-2 text-center">
            <button
              class="inline-flex items-center justify-center w-9 h-9 rounded-full border hover:bg-neutral-50"
              @click="emit('open-chart', lab)"
              title="Expand"
            >
              🔍
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Sparkline from "./Sparkline.vue";
import { getLatestRecord, toSeries } from "../utils/labs";

const props = defineProps({
  labs: { type: Array, default: () => [] },
  allDates: { type: Array, default: () => [] },
  recordMap: { type: Object, required: true }, // Map
});
const emit = defineEmits(["open-chart"]);

function cellClass(abn) {
  // 你可依 Figma 調色；先用最直覺
  if (abn === "L") return "bg-red-50 text-red-700";
  if (abn === "H") return "bg-orange-50 text-orange-700";
  return "bg-emerald-50 text-emerald-700";
}
</script>
