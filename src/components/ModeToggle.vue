<template>
  <div class="inline-flex rounded-full bg-orange-500 p-1">
    <button
      class="px-3 py-1 font-bold rounded-full cursor-pointer"
      :class="modelValue === 'chart' ? 'bg-white/80 shadow text-orange-500' : 'text-white'"
      @click="emit('update:modelValue', 'chart')"
    >
      Chart
    </button>
    <button
      class="px-3 py-1 font-bold rounded-full cursor-pointer"
      :class="modelValue === 'table' ? 'bg-white/80 shadow text-orange-500' : 'text-white'"
      @click="emit('update:modelValue', 'table')"
    >
      Table
    </button>
  </div>
</template>

<script setup>
const props = defineProps({ modelValue: { type: String, default: "chart" } });
const emit = defineEmits(["update:modelValue"]);
</script>
