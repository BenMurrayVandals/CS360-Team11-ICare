<template>
  <div class="flex items-center justify-center">
    <!-- SPINNER -->
    <div
      :class="{
        'border-white border-l-white/50 border-b-white/50': color === 'white',
        'border-slate-950 border-l-slate-950/50 border-b-slate-950/50': color === 'very dark',
        'border-slate-900 border-l-slate-900/50 border-b-slate-900/50': color === 'dark',
        'border-slate-800 border-l-slate-800/50 border-b-slate-800/50': color === 'normal',
        'border-slate-500 border-l-slate-500/50 border-b-slate-500/50': color === 'light',
        'border-very-light border-l-very-light/50 border-b-very-light/50': color === 'very light',
      }"
      class="min-w-[24px] h-6 border-4 border-solid animate-spin rounded-full"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  color?: string;
}>();
</script>
