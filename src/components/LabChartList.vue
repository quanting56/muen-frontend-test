<template>
  <td
    :colspan="allDates.length"
    class="px-2 py-2"
  >
    <!-- 內部用固定欄寬的 grid，以「每個日期等距」 -->
    <div class="relative" :style="{ minWidth: minWidthPx, height: heightPx }">

      <!-- baseline -->
      <div class="absolute left-0 right-0 h-px bg-neutral-200" :style="{ top: axisTopPx }"></div>

      <!-- expanded 時用 SVG 畫折線（依數值縮放） -->
      <svg
        v-if="expanded"
        class="absolute left-0 top-0 pointer-events-none"
        :width="totalWidth"
        :height="height"
        :viewBox="`0 0 ${totalWidth} ${height}`"
        preserveAspectRatio="none"
      >
        <line x1="0" :y1="axisY" :x2="totalWidth" :y2="axisY" class="stroke-neutral-200" stroke-width="1" />

        <template v-for="(s, i) in segments" :key="i">
          <line
            :x1="s.a.x"
            :y1="s.a.y"
            :x2="s.b.x"
            :y2="s.b.y"
            stroke-linecap="round"
            stroke-width="2.5"
            :class="s.alert ? 'stroke-rose-400' : 'stroke-emerald-300'"
          />
        </template>
      </svg>

      <div
        class="grid"
        :style="{ gridTemplateColumns: gridCols }"
      >
        <div
          v-for="d in allDates"
          :key="d"
          class="relative"
          :style="{ height: heightPx }"
        >
          <template v-if="recByDate.get(d)">
            <div
              class="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 group"
              :style="{ top: markerTopPx(d) }"
            >
              <!-- tooltip -->
              <div
                class="pointer-events-none absolute -top-11 left-1/2 -translate-x-1/2
                       rounded-md bg-white px-2 py-1 text-xs shadow border
                       opacity-0 group-hover:opacity-100 transition"
              >
                {{ d }}
              </div>

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

              <div
                v-if="expanded"
                class="absolute left-1/2 -translate-x-1/2 text-[11px] text-neutral-500 whitespace-nowrap"
                :style="{ top: dateLabelTopPx }"
              >
                {{ formatMD(d) }}
              </div>
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
  lab: { type: Object, required: true },          // 一列一個 lab
  allDates: { type: Array, default: () => [] },
  colWidth: { type: Number, default: 92 },        // 欄距
  expanded: { type: Boolean, default: false },
});

const expanded = computed(() => props.expanded);

// 用 lab.records 建一個 date -> record 的 Map，避免一直 find()
const recByDate = computed(() => {
  const m = new Map();
  (props.lab?.records ?? []).forEach(r => m.set(r.lab_date, r));
  return m;
});

// 尺寸（展開時更高、baseline 移到底部）
const height = computed(() => (expanded.value ? 92 : 64));
const heightPx = computed(() => `${height.value}px`);

const totalWidth = computed(() => Math.max(props.allDates.length, 1) * props.colWidth);
const minWidthPx = computed(() => `${totalWidth.value}px`);
const gridCols = computed(() => `repeat(${props.allDates.length}, ${props.colWidth}px)`);

const axisY = computed(() => (expanded.value ? height.value - 22 : Math.round(height.value / 2)));
const axisTopPx = computed(() => `${axisY.value}px`);
const dateLabelTopPx = computed(() => `${axisY.value + 8}px`);

function toNum(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// 展開時做 y 縮放（min/max）
const domain = computed(() => {
  const vals = (props.lab?.records ?? [])
    .map((r) => toNum(r.lab_value))
    .filter((v) => v !== null);

  if (!vals.length) return [0, 1];

  let min = Math.min(...vals);
  let max = Math.max(...vals);
  if (min === max) {
    min -= 1;
    max += 1;
  }
  return [min, max];
});

function yForValue(v) {
  const [min, max] = domain.value;
  const top = 10;
  const bottom = expanded.value ? 30 : 10; // 留給日期
  const plotH = Math.max(1, height.value - top - bottom);
  return top + ((max - v) / (max - min)) * plotH; // 值越大越靠上
}

// 每個有值的日期 -> point（含 x,y）
const points = computed(() => {
  const pts = [];
  props.allDates.forEach((d, idx) => {
    const rec = recByDate.value.get(d);
    if (!rec) return;

    const v = toNum(rec.lab_value);
    if (v === null) return;

    pts.push({
      date: d,
      idx,
      x: idx * props.colWidth + props.colWidth / 2,
      y: expanded.value ? yForValue(v) : axisY.value,
      abnormal: rec.abnormal ?? null,
    });
  });
  return pts;
});

const pointByDate = computed(() => {
  const m = new Map();
  points.value.forEach((p) => m.set(p.date, p));
  return m;
});

function markerTopPx(d) {
  const p = pointByDate.value.get(d);
  return `${(p?.y ?? axisY.value)}px`;
}

// 折線段（相鄰點連線；若端點有異常就用紅色段）
const segments = computed(() => {
  const pts = [...points.value].sort((a, b) => a.idx - b.idx);
  const segs = [];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const alert = !!(a.abnormal || b.abnormal);
    segs.push({ a, b, alert });
  }
  return segs;
});

function valueTextClass(abn) {
  if (abn === "L") return "text-red-600";
  if (abn === "H") return "text-orange-600";
  return "text-emerald-600";
}

function formatMD(iso) {
  const [, m, d] = (iso ?? "").split("-");
  if (!m || !d) return iso;
  return `${Number(m)}/${Number(d)}`;
}
</script>
