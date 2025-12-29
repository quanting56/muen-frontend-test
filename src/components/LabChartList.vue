<template>
  <td
    :colspan="allDates.length"
    class="px-2 py-2"
  >
    <!-- 內部用固定欄寬的 grid，才能像 Figma 一樣「每個日期等距」 -->
    <div class="relative" :style="{ minWidth: minWidthPx }">
      <!-- baseline -->
      <div class="absolute left-0 right-0 top-1/2 h-px bg-neutral-200"></div>

      <div
        class="grid"
        :style="{ gridTemplateColumns: gridCols }"
      >
        <div
          v-for="d in allDates"
          :key="d"
          class="relative h-16"
        >
          <template v-if="recByDate.get(d)">
            <div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 group">
              <!-- 上方數值 -->
              <div
                class="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-semibold tabular-nums whitespace-nowrap"
                :class="valueTextClass(recByDate.get(d).abnormal)"
              >
                {{ recByDate.get(d).lab_value }}
              </div>

              <!-- 站點 marker：normal 圓點 / L 向下三角 / H 向上三角 -->
              <template v-if="recByDate.get(d).abnormal === 'L'">
                <svg
                  class="w-3 h-3 text-red-500 drop-shadow-sm transition-transform group-hover:scale-110"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <!-- down triangle -->
                  <path d="M1 3h10L6 10z" fill="currentColor" />
                </svg>
              </template>

              <template v-else-if="recByDate.get(d).abnormal === 'H'">
                <svg
                  class="w-3 h-3 text-orange-500 drop-shadow-sm transition-transform group-hover:scale-110"
                  viewBox="0 0 12 12"
                  aria-hidden="true"
                >
                  <!-- up triangle -->
                  <path d="M6 2l5 7H1z" fill="currentColor" />
                </svg>
              </template>

              <template v-else>
                <div
                  class="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white shadow-sm transition-transform group-hover:scale-110"
                ></div>
              </template>
            </div>
          </template>
        </div>
      </div>
    </div>
  </td>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  lab: { type: Object, required: true },          // ✅ CHANGED：一列一個 lab
  allDates: { type: Array, default: () => [] },
  colWidth: { type: Number, default: 92 },        // 欄距：你可調成更像 Figma
});

// ✅ CHANGED：用 lab.records 建一個 date -> record 的 Map，避免一直 find()
const recByDate = computed(() => {
  const m = new Map();
  (props.lab?.records ?? []).forEach(r => m.set(r.lab_date, r));
  return m;
});

const gridCols = computed(() => `repeat(${props.allDates.length}, ${props.colWidth}px)`);
const minWidthPx = computed(() => `${Math.max(props.allDates.length, 1) * props.colWidth}px`);

function valueTextClass(abn) {
  if (abn === "L") return "text-red-600";
  if (abn === "H") return "text-orange-600";
  return "text-emerald-600";
}
</script>
