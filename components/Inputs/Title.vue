<template>
  <div class="flex items-center gap-x-2">
    <!-- TITLE -->
    <h5 class="flex gap-x-1 text-white font-bold text-sm whitespace-nowrap uppercase">
      {{ title }}
      <!-- REQUIRED -->
      <span v-if="required" class="text-red-500 font-medium">*</span>
    </h5>
    <!-- MORE INFO-->
    <!-- <IconWithTooltip v-if="moreInfo" :size="'small'" iconType="question mark" color="white" :tooltipText="moreInfo" /> -->
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  title: string;
  // moreInfo?: string;
  required?: boolean;
}>();
</script>
