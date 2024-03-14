<template>
    <div class="truncate">
      <!-- TITLE -->
      <AnswersTitle :size="size" :text="title" />
      <!-- ANSWER SLOT OUTLET -->
      <slot name="answer"></slot>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps<{
    size: Size;
    title: string;
  }>();
  </script>