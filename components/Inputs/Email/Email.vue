<template>
  <InputsBase :size="size" :answer="answer">
    <!-- ANSWER INPUT SLOT CONTENT -->
    <template #input>
      <!-- EMAIL INPUT -->
      <InputsEmailInput
        @updateInput="$emit('updateInput', { answer: answer, input: $event })"
        :size="size"
        :input="answer.input"
        :placeholder="answer.placeholder"
        :id="answer.id"
      />
    </template>
  </InputsBase>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  answer: TextInput;
}>();

defineEmits<{
  (e: "updateInput", args: { answer: TextInput; input: string }): void;
}>();
</script>
