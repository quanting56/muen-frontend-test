<template>
  <td
    v-for="d in allDates"
    :key="lab.lab_code + d"
    class="px-2 py-2 text-center border border-gray-300 tabular-nums"
    :class="getRec(lab.lab_code, d) ? cellClass(getRec(lab.lab_code, d).abnormal) : ''"
  >
    <template v-if="getRec(lab.lab_code, d)">
      <span
        class="inline-flex items-center justify-center min-w-11 px-2 py-1 rounded-md font-semibold"
        :class="cellClass(getRec(lab.lab_code, d).abnormal)"
        :title="getRec(lab.lab_code, d).abnormal || ''"
      >
        {{ getRec(lab.lab_code, d).lab_value }}
      </span>
    </template>
    <template v-else>
      <span class="text-neutral-300">—</span>
    </template>
  </td>
</template>

<script setup>
const props = defineProps({
  lab: { type: Object, required: true },
  allDates: { type: Array, default: () => [] },
  recordMap: { type: Object, required: true }, // Map
});

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
