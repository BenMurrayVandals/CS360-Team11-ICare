<template>
  <InputsBase :size="size" :answer="answer">
    <!-- ANSWER INPUT SLOT CONTENT -->
    <template #input>
      <InputsPhoneNumberInput
        @changeSelected="$emit('changeSelected', { answer: answer, selected: $event })"
        :size="size"
        :answer="answer"
      />
    </template>
  </InputsBase>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  answer: PhoneNumberInput;
}>();

defineEmits<{
  (e: "changeSelected", args: { answer: PhoneNumberInput; selected: PhoneNumberSelected }): void;
}>();
</script>
