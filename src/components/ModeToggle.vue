<template>
  <div class="inline-flex rounded-full bg-neutral-100 p-1">
    <button
      class="px-3 py-1.5 text-sm rounded-full"
      :class="modelValue === 'chart' ? 'bg-white shadow' : 'text-neutral-500'"
      @click="emit('update:modelValue', 'chart')"
    >
      Chart
    </button>
    <button
      class="px-3 py-1.5 text-sm rounded-full"
      :class="modelValue === 'table' ? 'bg-white shadow' : 'text-neutral-500'"
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
