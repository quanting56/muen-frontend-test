<!-- components/DateRangePicker.vue -->
<template>
  <div ref="root" class="relative">
    <!-- trigger -->
    <button
      type="button"
      class="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-1.5 text-sm shadow-sm hover:bg-neutral-50 cursor-pointer"
      @click="open = !open"
      :disabled="!allDates.length"
      :title="allDates.length ? 'Select range' : 'No data'"
    >
      <span class="tabular-nums text-neutral-800">{{ label }}</span>

      <!-- calendar icon -->
      <svg class="h-4 w-4 text-neutral-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path
          fill-rule="evenodd"
          d="M6 2a1 1 0 0 1 1 1v1h6V3a1 1 0 1 1 2 0v1h1a2 2 0 0 1 2 2v2H2V6a2 2 0 0 1 2-2h1V3a1 1 0 0 1 1-1Zm12 8H2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6Z"
          clip-rule="evenodd"
        />
      </svg>

      <!-- 分隔符號 -->
      <div class="w-1 h-4 m-1 border-l border-neutral-300"></div>

      <!-- mini timeline -->
      <div
        v-if="allDates.length"
        class="relative h-4 w-55 cursor-pointer"
        :title="'Adjust range'"
      >
        <!-- base track -->
        <div class="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.75 rounded-full bg-neutral-200"></div>

        <!-- selected range -->
        <div
          class="absolute top-1/2 -translate-y-1/2 h-0.75 rounded-full bg-orange-400"
          :style="{ left: `${startPct * 100}%`, width: `${Math.max(0, (endPct - startPct) * 100)}%` }"
        ></div>

        <!-- start handle -->
        <div
          class="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-orange-500 border-2 border-white shadow"
          :style="{ left: `calc(${startPct * 100}% - 7px)` }"
        ></div>

        <!-- end handle -->
        <div
          class="absolute top-1/2 -translate-y-1/2 h-3.5 w-3.5 rounded-full bg-orange-500 border-2 border-white shadow"
          :style="{ left: `calc(${endPct * 100}% - 7px)` }"
        ></div>
      </div>
    </button>

    <!-- popover -->
    <div
      v-if="open"
      class="absolute left-0 mt-2 z-50 w-130 rounded-2xl bg-neutral-800 text-white shadow-2xl border border-neutral-700 overflow-hidden"
    >
      <div class="grid grid-cols-[180px_1fr]">
        <!-- presets -->
        <div class="p-4 border-r border-neutral-700">
          <div class="text-xs text-white/70 mb-2">Presets</div>
          <div class="space-y-2">
            <button class="w-full text-left rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2" @click="applyPreset(-1)">
              Past 1 month
            </button>
            <button class="w-full text-left rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2" @click="applyPreset(-6)">
              Past 6 months
            </button>
            <button class="w-full text-left rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2" @click="applyPreset(-12)">
              Past 1 year
            </button>
            <button class="w-full text-left rounded-lg bg-white/10 hover:bg-white/15 px-3 py-2" @click="applyPreset(-36)">
              Past 3 years
            </button>
          </div>
        </div>

        <!-- form -->
        <div class="p-4">
          <div class="text-sm font-semibold mb-3">Start date</div>
          <input
            type="date"
            v-model="draftStart"
            class="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white"
          />

          <div class="mt-4 text-sm font-semibold mb-3">End date</div>
          <div class="space-y-2">
            <label class="flex items-center gap-2 text-sm">
              <input type="radio" value="max" v-model="endMode" />
              <span>Today (latest in dataset)</span>
            </label>

            <label class="flex items-center gap-2 text-sm">
              <input type="radio" value="custom" v-model="endMode" />
              <span>Pick date</span>
            </label>

            <input
              v-if="endMode === 'custom'"
              type="date"
              v-model="draftEnd"
              class="w-full rounded-lg bg-white/10 border border-white/10 px-3 py-2 text-white"
            />
          </div>

          <div class="mt-5 flex items-center justify-end gap-2">
            <button
              class="rounded-full px-3 py-2 bg-white/10 hover:bg-white/15"
              @click="open = false"
            >
              Cancel
            </button>
            <button
              class="rounded-full px-4 py-2 bg-orange-500 hover:bg-orange-400 font-semibold"
              @click="commit"
            >
              Set range
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  modelValue: { type: Object, default: () => ({ start: null, end: null }) },
  allDates: { type: Array, default: () => [] }, // sorted "YYYY-MM-DD"
});
const emit = defineEmits(["update:modelValue"]);

const root = ref(null);
const open = ref(false);

const minDate = computed(() => props.allDates?.[0] ?? null);
const maxDate = computed(() => props.allDates?.at(-1) ?? null);

const draftStart = ref(null);
const draftEnd = ref(null);
const endMode = ref("max"); // "max" | "custom"

const label = computed(() => {
  if (!props.allDates.length) return "—";
  const s = props.modelValue?.start ?? minDate.value;
  const e = props.modelValue?.end ?? maxDate.value;
  return `${s} ~ ${e}`;
});

function clampISO(d) {
  if (!d) return null;
  if (minDate.value && d < minDate.value) return minDate.value;
  if (maxDate.value && d > maxDate.value) return maxDate.value;
  return d;
}

function normalizeStartEnd(s, e) {
  let start = clampISO(s ?? minDate.value);
  let end = clampISO(e ?? maxDate.value);
  if (start && end && start > end) [start, end] = [end, start];
  return { start, end };
}

function setDraftFromModel() {
  const { start, end } = normalizeStartEnd(props.modelValue?.start, props.modelValue?.end);
  draftStart.value = start;
  draftEnd.value = end;
  endMode.value = props.modelValue?.end ? "custom" : "max";
}

watch(
  () => props.modelValue,
  () => setDraftFromModel(),
  { deep: true, immediate: true }
);

watch(
  () => props.allDates,
  () => {
    // 資料變動時，確保範圍仍在 bounds 內
    const { start, end } = normalizeStartEnd(props.modelValue?.start, props.modelValue?.end);
    emit("update:modelValue", { start, end });
    setDraftFromModel();
  }
);

function toUTCDate(iso) {
  // 避免 timezone 造成前後一天
  return new Date(`${iso}T00:00:00Z`);
}
function toISO(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}
function addMonths(iso, months) {
  const d = toUTCDate(iso);
  d.setUTCMonth(d.getUTCMonth() + months);
  return toISO(d);
}

function applyPreset(monthsBack) {
  if (!maxDate.value) return;
  const end = maxDate.value;
  const start = clampISO(addMonths(end, monthsBack));
  draftStart.value = start;
  draftEnd.value = end;
  endMode.value = "max";
}

function commit() {
  const end = endMode.value === "max" ? maxDate.value : draftEnd.value;
  const { start, end: normalizedEnd } = normalizeStartEnd(draftStart.value, end);
  emit("update:modelValue", { start, end: normalizedEnd });
  open.value = false;
}

// handle positions (use index-based percent)
function nearestIndex(iso) {
  const arr = props.allDates ?? [];
  if (!arr.length) return 0;
  // 找第一個 >= iso 的 index
  const i = arr.findIndex((d) => d >= iso);
  return i === -1 ? arr.length - 1 : i;
}

const startPct = computed(() => {
  const arr = props.allDates ?? [];
  if (arr.length <= 1) return 0;
  const s = props.modelValue?.start ?? minDate.value;
  return nearestIndex(s) / (arr.length - 1);
});

const endPct = computed(() => {
  const arr = props.allDates ?? [];
  if (arr.length <= 1) return 1;
  const e = props.modelValue?.end ?? maxDate.value;
  return nearestIndex(e) / (arr.length - 1);
});

// click outside to close
function onDocClick(e) {
  if (!open.value) return;
  if (!root.value) return;
  if (!root.value.contains(e.target)) open.value = false;
}
onMounted(() => document.addEventListener("click", onDocClick));
onUnmounted(() => document.removeEventListener("click", onDocClick));
</script>
