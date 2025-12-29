<template>
  <VChart class="h-90 w-full" :option="option" autoresize />
</template>

<script setup>
import { computed } from "vue";
import VChart from "vue-echarts";

import { use } from "echarts/core";
import { LineChart } from "echarts/charts";
import { GridComponent, TooltipComponent } from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";

import { toSeries } from "../utils/labs";

use([LineChart, GridComponent, TooltipComponent, CanvasRenderer]);

const props = defineProps({ lab: { type: Object, required: true } });

const series = computed(() => toSeries(props.lab));
const option = computed(() => ({
  grid: { left: 36, right: 18, top: 10, bottom: 28 },
  tooltip: { trigger: "axis" },
  xAxis: { type: "category", data: series.value.map(p => p.date) },
  yAxis: { type: "value" },
  series: [
    {
      type: "line",
      data: series.value.map(p => p.value),
      smooth: true,
      symbol: "circle",
      symbolSize: 7,
      lineStyle: { width: 3 },
    },
  ],
}));
</script>
