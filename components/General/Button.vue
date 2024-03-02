<template>
  <button
    class="flex items-center justify-center gap-x-2 bg-blue-600 max-h-[56px] p-4 rounded-xl transition-all duration-200 hover:bg-blue-700 hover:scale-105"
  >
    <p
      :class="{
        'text-white': color === 'white',
        'text-slate-950': color === 'very dark',
        'text-slate-900': color === 'dark',
        'text-slate-800': color === 'normal',
        'text-slate-500': color === 'light',
        'text-very-light': color === 'very light',
      }"
      class="font-bold text-base whitespace-nowrap"
    >
      {{ data }}
    </p>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  data: string;
  iconType?: string;
  color?: string;
}>();
</script>
