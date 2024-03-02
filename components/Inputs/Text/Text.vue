<template>
  <InputsBase :size="size" :answer="answer">
    <!-- ANSWER INPUT SLOT CONTENT -->
    <template #input>
      <ClientOnly>
        <!-- TEXT INPUT -->
        <InputsTextInput
          @updateInput="$emit('updateInput', { answer: answer, input: $event })"
          :size="size"
          :input="answer.input"
          :placeholder="answer.placeholder"
          :id="answer.id"
        />
      </ClientOnly>
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
