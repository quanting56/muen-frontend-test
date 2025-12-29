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
        <div class="w-full max-w-6xl bg-neutral-50 rounded-2xl shadow-xl overflow-hidden">
          <section class="rounded-2xl border border-neutral-200 bg-white shadow-sm p-4">
            <div class="flex items-end justify-between gap-4 mb-4">
              <div>
                <h1 class="text-4xl font-semibold tracking-tight text-neutral-900">Analytics</h1>
              </div>
  
              <ModeToggle v-model="mode" />
            </div>
  
            <div v-if="mode === 'table'">
              <LabTable
                :labs="labs"
                :all-dates="allDates"
                :record-map="recordMap"
                @open-chart="openChart"
              />
            </div>
          
            <div v-else>
              <LabChartList :labs="labs" @open-chart="openChart" />
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

import { getAllDates, buildRecordMap } from "./utils/labs";

const labs = ref(mock.data ?? []);
const mode = ref("chart");

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
