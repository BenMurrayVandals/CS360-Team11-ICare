<template>
  <InputsBase :size="size" :answer="answer">
    <!-- ANSWER INPUT SLOT CONTENT -->
    <template #input>
      <!-- TOGGLE INPUT -->
      <InputsToggleInput
        @toggle="$emit('changeSelected', { answer: answer, selected: $event })"
        :size="size"
        :answer="answer"
      />
    </template>
  </InputsBase>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  answer: ToggleInput;
}>();

defineEmits<{
  (e: "changeSelected", args: { answer: ToggleInput; selected: boolean }): void;
}>();
</script>
