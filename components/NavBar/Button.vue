<template>
  <button
    @click="routeToPath"
    class="flex items-center justify-center bg-blue-600 px-6 py-3 rounded-lg transition-all duration-200 hover:bg-blue-700 hover:scale-105"
  >
    <!-- TEXT -->
    <h3 class="text-white font-bold text-base">
      {{ data }}
    </h3>
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: string;
  path?: string;
}>();

const routeToPath = () => {
  if (props.path) navigateTo(props.path);
};
</script>
