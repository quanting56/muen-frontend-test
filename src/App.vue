<template>
  <div class="min-h-screen bg-neutral-50">
    <div class="max-w-6xl mx-auto px-6 py-8">
      <div class="flex items-end justify-between gap-4 mb-4">
        <div>
          <h1 class="text-5xl font-black tracking-tight">Analytics</h1>
          <div class="text-sm text-neutral-500 mt-2">Lab results overview</div>
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
    </div>

    <ChartModal :open="isModalOpen" :lab="selected" @close="closeChart" />
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
