<template>
  <div class="flex flex-col gap-y-2 break-inside-avoid-column ring-offset-inherit">
    <!-- TITLE -->
    <InputsTitle :size="size" :title="answer?.title" :required="answer?.required" />
    <!-- ALERTS -->
    <InputsAlerts :size="size" :errors="answer?.errors" :warnings="answer?.warnings" :notes="answer?.notes" />
    <!-- ANSWER INPUT SLOT OUTLET -->
    <slot name="input"></slot>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  answer: Form;
}>();
</script>
