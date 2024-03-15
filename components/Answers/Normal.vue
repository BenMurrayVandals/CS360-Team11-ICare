<template>
  <AnswersBase :size="size" :title="title">
    <!-- ANSWER SLOT CONTENT -->
    <template #answer>
      <!-- ANSWER -->
      <AnswersText v-if="text" :size="size" :text="text" />
      <!-- BLANK -->
      <AnswersBlank v-else />
    </template>
  </AnswersBase>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  title: string;
  text?: string;
}>();
</script>
