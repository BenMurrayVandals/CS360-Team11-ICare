<template>
    <div class="flex items-center gap-x-4">
      <!-- TITLE -->
      <h6 class="text-very-light text-sm font-bold whitespace-nowrap uppercase">{{ title }}</h6>
      <!-- LINE -->
      <div class="bg-very-light w-full h-0.5 rounded-full"></div>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    title: string;
  }>();
  </script>