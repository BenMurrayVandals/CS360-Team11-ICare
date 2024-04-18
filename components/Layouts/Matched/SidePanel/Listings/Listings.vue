<template>
    <div
      class="flex flex-col gap-y-4 h-full p-4 sm:px-6 overflow-y-auto scrollbar-thin scroll-track-transparent scroll-thumb-dark"
    >
      <TransitionCustom name="no-results-fade" mode="out-in">
        <div v-if="!noListings" class="flex flex-col gap-y-4">
          <!-- LISTINGS SLOT OUTLET -->
          <slot name="listings"></slot>
        </div>
        <div v-else class="flex flex-col items-center justify-center h-full">
          <!-- NO LISTINGS SLOT OUTLET -->
          <slot name="no-listings"></slot>
        </div>
      </TransitionCustom>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    noListings?: boolean;
  }>();
  </script>