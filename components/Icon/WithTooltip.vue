<template>
  <div>
    <GeneralTooltip :data="tooltipText" :direction="tooltipDirection ?? 'top'">
      <IconButton
        :size="size"
        :iconType="iconType"
        :color="color"
        :numNotifications="numNotifications"
        :isAccent="isAccent"
        :isLoading="isLoading"
        type="button"
      />
    </GeneralTooltip>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  iconType: string;
  color: string;
  tooltipText: string;
  tooltipDirection?: Placement;
  numNotifications?: number;
  isAccent?: boolean;
  isLoading?: boolean;
}>();
</script>
