<template>
  <div :class="{ truncate: !noTruncate }">
    <!-- ANSWER -->
    <GeneralTooltip :data="text" direction="top" isText>
      <p
        :class="{
          'text-xs': size === 'very small',
          'text-sm': size === 'small',
          'text-base': size === 'medium',
          truncate: !noTruncate,
        }"
        class="text-white"
      >
        {{ text }}
      </p>
    </GeneralTooltip>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: Size;
  text?: string;
  noTruncate?: boolean;
}>();
</script>
