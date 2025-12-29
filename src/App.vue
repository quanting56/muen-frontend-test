<template>
  <div>
    <header class="bg-white border-b border-neutral-200">
      <div class="max-w-6xl mx-auto px-6 py-4 flex items-baseline gap-4">
        <span class="text-4xl font-black tracking-tight text-orange-600">Hopes</span>
        <span class="text-3xl text-neutral-900">Patient Journey</span>
      </div>
    </header>

    <main>Dashboard Content（待補）</main>

    <!-- Modal -->
    <Teleport to="body">
      <div class="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-6">
        <div class="w-full max-w-6xl bg-neutral-50 rounded-2xl shadow-xl overflow-auto">
          <section class="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4">
            <div class="flex items-end justify-between gap-4 mb-4">
              <div>
                <h1 class="text-4xl font-semibold tracking-tight text-orange-500">Analytics</h1>
              </div>
  
              <ModeToggle v-model="mode" />
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
                      <LabChartList :lab="lab" :all-dates="allDates" />
                    </template>
                  
                    <td
                      v-if="mode === 'chart'"
                      class="px-3 py-2 text-center"
                    >
                      <button
                        class="inline-flex items-center justify-center w-9 h-9 rounded-full bg-orange-400 hover:bg-orange-400/50 cursor-pointer"
                        @click="openChart(lab)"
                        title="Expand"
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
      
        <ChartModal :open="isModalOpen" :lab="selected" @close="closeChart" />
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

import mock from "./data/mock_data.json";
import ModeToggle from "./components/ModeToggle.vue";
import LabTable from "./components/LabTable.vue";
import LabChartList from "./components/LabChartList.vue";
import ChartModal from "./components/ChartModal.vue";
import Sparkline from "./components/Sparkline.vue";

import { getAllDates, buildRecordMap, toSeries } from "./utils/labs";

const labs = ref(mock.data ?? []);
const mode = ref("table");

const allDates = computed(() => getAllDates(labs.value));
const recordMap = computed(() => buildRecordMap(labs.value));

const selected = ref(null);
const isModalOpen = computed(() => !!selected.value);

function openChart(lab) {
  selected.value = lab;
}
function closeChart() {
  selected.value = null;
}
</script>
