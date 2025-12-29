<template>
  <div class="overflow-auto bg-white">
    <table class="min-w-225 w-full text-sm border-collapse">
      <thead class="bg-neutral-500">
        <tr>
          <th class="px-3 py-2 text-white w-min-30 border-b">Trend</th>
          <th class="px-3 py-2 text-white border-b">Name</th>
          <th class="px-3 py-2 text-white w-min-20 border-b">Unit</th>
          <!-- <th
            v-for="d in allDates"
            :key="d"
            class="px-3 py-2 text-center whitespace-nowrap border-b border-l"
          >
            {{ d }}
          </th> -->
          <th
            class="px-3 py-2 text-white border-b"
            :colspan="allDates.length"
          >
            table
          </th>
          <!-- <th class="px-3 py-2 text-center w-17.5"></th> -->
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="lab in labs"
          :key="lab.lab_code"
        >
          <td class="px-3 py-2 text-neutral-700">
            <Sparkline :values="toSeries(lab).map(p => p.value)" class="text-emerald-500" />
          </td>

          <td class="px-3 py-2 text-center">
            <div class="font-semibold">{{ lab.lab_name_ch }}</div>
            <div class="text-xs text-neutral-500">{{ lab.lab_name_en }}</div>
          </td>

          <td class="px-3 py-2 text-neutral-600 text-center">{{ lab.lab_unit }}</td>

          <td
            v-for="d in allDates"
            :key="lab.lab_code + d"
            class="px-2 py-2 text-center border border-gray-300 tabular-nums"
            :class="getRec(lab.lab_code, d) ? cellClass(getRec(lab.lab_code, d).abnormal) : ''"
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

          <!-- <td class="px-3 py-2 text-center">
            <button
              class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-400 hover:bg-orange-400/50 cursor-pointer"
              @click="emit('open-chart', lab)"
              title="Expand"
            >
              🔍
            </button>
          </td> -->
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import Sparkline from "./Sparkline.vue";
import { toSeries } from "../utils/labs";

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

function getRec(code, date) {
  return props.recordMap.get(code)?.get(date) ?? null;
}
</script>
