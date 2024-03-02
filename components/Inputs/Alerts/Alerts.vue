<template>
  <TransitionCustom name="alerts-fade">
    <div
      v-if="(errors?.length ?? 0) + (warnings?.length ?? 0) + (notes?.length ?? 0) > 0"
      class="flex flex-col gap-y-1"
    >
      <!-- ERRORS -->
      <TransitionGroup @beforeLeave="positionLeavingElement" name="alert">
        <InputsAlertsAlert v-for="error in errors" :key="error.id" :size="size" :alert="error" />
      </TransitionGroup>
      <!-- WARNINGS -->
      <TransitionGroup @beforeLeave="positionLeavingElement" name="alert">
        <InputsAlertsAlert v-for="warning in warnings" :key="warning.id" :size="size" :alert="warning" />
      </TransitionGroup>
      <!-- NOTES -->
      <TransitionGroup @beforeLeave="positionLeavingElement" name="alert">
        <InputsAlertsAlert v-for="note in notes" :key="note.id" :size="size" :alert="note" />
      </TransitionGroup>
    </div>
  </TransitionCustom>
</template>

<script setup lang="ts">
const { positionLeavingElement } = useTransitions();

defineProps<{
  size: Size;
  errors: Alert[];
  warnings: Alert[];
  notes?: Alert[];
}>();
</script>
