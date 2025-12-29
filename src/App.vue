<template>
  <div>
    <header class="bg-white border-b border-neutral-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-baseline gap-4">
        <span class="text-4xl font-black tracking-tight text-orange-600">Hopes</span>
        <span class="text-3xl text-neutral-900">Patient Journey</span>
      </div>
    </header>

    <main class="p-3">
      <div class="text-xl">Dashboard Content</div>
      <button
        @click="isModalOpen = true"
        class="px-2 py-1 mt-2 rounded-full border border-orange-400 cursor-pointer hover:bg-amber-400"
      >
        打開遮罩
      </button>
    </main>

    <!-- Modal -->
    <Teleport to="body">
      <div
        class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6"
        :class="isModalOpen ? 'block' : 'hidden'"  
      >
        <div class="w-full max-w-6xl bg-neutral-50 rounded-2xl shadow-xl overflow-auto">
          <section class="rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <div class="flex items-center justify-between gap-4 mb-4">
              <div class="px-4 pt-4 flex items-center gap-4">
                <h1 class="text-4xl font-semibold tracking-tight text-orange-500">Analytics</h1>

                <!-- 日期範圍選擇器（顯示 label + timeline + popover） -->
                <DateRangePicker v-model="dateRange" :all-dates="allDatesAll" />
              </div>
  
              <div>
                <ModeToggle v-model="mode" />
                <button
                  @click="isModalOpen = false"
                  class="mx-4 text-xl cursor-pointer text-gray-500 hover:text-black"
                >✕</button>
              </div>
            </div>
  
            <div class="overflow-auto bg-white">
              <table class="min-w-225 w-full text-sm border-collapse">
                <thead class="bg-neutral-500">
                  <tr>
                    <th class="px-3 py-2 text-white w-30 border-b">Trend</th>
                    <th class="px-3 py-2 text-white border-b">Name</th>
                    <th class="px-3 py-2 text-white w-20 border-b">Unit</th>
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
                      {{ mode === "table" ? "table" : "chart" }}
                    </th>
                    <th
                      v-if="mode === 'chart'"
                      class="px-3 py-2 text-white border-b w-17.5"
                    ></th>
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
                  
                    <template v-if="mode === 'table'">
                      <LabTable
                        :lab="lab"
                        :all-dates="allDates"
                        :record-map="recordMap"
                      />
                    </template>

                    <template v-if="mode === 'chart'">
                      <LabChartList
                        :lab="lab"
                        :all-dates="allDates"
                        :expanded="expandedLabCode === lab.lab_code"
                      />
                    </template>
                  
                    <td
                      v-if="mode === 'chart'"
                      class="px-3 py-2 text-center"
                    >
                      <button
                        class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-400 hover:bg-orange-400/50 cursor-pointer"
                        :class="expandedLabCode === lab.lab_code ? 'bg-orange-500 text-white' : 'bg-orange-400 hover:bg-orange-400/50'"
                        @click="toggleExpand(lab)"
                        :title="expandedLabCode === lab.lab_code ? 'Collapse' : 'Expand'"
                      >
                        🔍
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

          </section>
        </div>
      
        <!-- <ChartModal :open="isModalOpen" :lab="selected" @close="closeChart" /> -->
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

import mock from "./data/mock_data.json";

import DateRangePicker from "./components/DateRangePicker.vue";
import ModeToggle from "./components/ModeToggle.vue";
import LabTable from "./components/LabTable.vue";
import LabChartList from "./components/LabChartList.vue";
import Sparkline from "./components/Sparkline.vue";

import { getAllDates, buildRecordMap, toSeries } from "./utils/labs";

const labs = ref(mock.data ?? []);
const mode = ref("table");

const isModalOpen = ref(true);

const allDatesAll = computed(() => getAllDates(labs.value)); // 全部日期（資料全集）

// date range state（預設 null 代表用全範圍）
const dateRange = ref({ start: null, end: null });

// 依 dateRange 過濾 dates（字串 YYYY-MM-DD 可直接比大小）
const allDates = computed(() => {
  const dates = allDatesAll.value ?? [];
  if (!dates.length) return [];

  let start = dateRange.value?.start || dates[0];
  let end = dateRange.value?.end || dates.at(-1);
  if (start > end) [start, end] = [end, start];
  // clamp
  if (start < dates[0]) start = dates[0];
  if (end > dates.at(-1)) end = dates.at(-1);

  const filtered = dates.filter((d) => d >= start && d <= end);
  return filtered.length ? filtered : dates;
});

const recordMap = computed(() => buildRecordMap(labs.value));

const expandedLabCode = ref(null);

function toggleExpand(lab) {
  expandedLabCode.value = expandedLabCode.value === lab.lab_code ? null : lab.lab_code;
}

watch(mode, (m) => {
  if (m !== "chart") expandedLabCode.value = null;
});
</script>
