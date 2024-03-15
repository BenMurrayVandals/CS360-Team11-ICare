<template>
  <div>
    <h6 v-if="size === 'small'" class="text-white font-bold text-xs uppercase">{{ text }}</h6>
    <h5 v-else-if="size === 'medium'" class="text-white font-bold text-sm uppercase">{{ text }}</h5>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  text: string;
}>();
</script>
