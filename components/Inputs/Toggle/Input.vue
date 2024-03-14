<template>
  <div class="flex items-center gap-x-2">
    <!-- LEFT TEXT -->
    <!-- <p class="text-white font-medium text-sm">{{ text.left }}</p> -->
    <!-- TOGGLE SWITCH -->
    <button
      @click="$emit('toggle', !answer.selected)"
      :class="[!answer.selected ? 'bg-white' : ' bg-blue-600']"
      class="flex items-center relative w-14 h-7 transition-colors duration-300 rounded-full"
    >
      <!-- INDICATOR -->
      <IconNoButton
        :class="[!answer.selected ? 'left-0.5' : 'left-[30px]']"
        :size="'medium'"
        iconType=""
        class="absolute transition-all duration-300"
      />
    </button>
    <!-- RIGHT TEXT -->
    <!-- <p class="text-white font-medium text-sm">{{ text.right }}</p> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  answer: ToggleInput;
}>();

const emits = defineEmits<{
  (e: "toggle", selected: boolean): void;
}>();
</script>
