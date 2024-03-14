<template>
  <InputsBase :size="size" :answer="answer">
    <!-- ANSWER INPUT SLOT CONTENT -->
    <template #input>
      <!-- COUNTER INPUT -->
      <InputsCounterInput
        @updateCounter="$emit('changeSelected', { answer: answer, selected: $event })"
        :size="size"
        :answer="answer"
      />
    </template>
  </InputsBase>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  answer: Counter;
}>();

defineEmits<{
  (e: "changeSelected", args: { answer: Counter; selected: number }): void;
}>();
</script>
