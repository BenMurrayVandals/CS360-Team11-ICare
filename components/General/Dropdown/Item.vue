<template>
  <li
    :class="{
      'h-8': size === 'medium',
      'h-10': size === 'large' || size === 'very large',
      'rounded-md': isRounded,
      'cursor-pointer hover:bg-slate-800 hover:fill-white hover:stroke-white hover:text-white  ': !isDisabled,
    }"
    class="flex items-center justify-between gap-x-2 bg-white w-full px-2 fill-slate-900 stroke-slate-900 text-slate-900"
  >
    <!-- LEFT -->
    <div class="flex items-center justify-center">
      <!-- LEFT ICON -->
      <div
        v-if="iconTypeLeft"
        :class="{
          'w-6': size === 'medium',
          'w-10': size === 'large' || size === 'very large',
        }"
        class="flex items-center justify-start"
      >
        <IconCustom :type="iconTypeLeft" :size="leftIconSize" />
      </div>
      <!-- TEXT -->
      <p
        :class="[
          [isDisabled ? 'text-slate-950/[0.5] select-none' : 'text-inherit'],
          {
            'text-xs': size === 'medium',
            'text-sm': size === 'large' || size === 'very large',
          },
        ]"
        class="font-medium whitespace-normal break-words text-left leading-none pr-4"
      >
        {{ data }}
      </p>
    </div>
    <!-- RIGHT -->
    <div v-if="iconTypeRight || numNotifications" class="flex items-center gap-x-2">
      <!-- RIGHT ICON -->
      <IconCustom v-if="iconTypeRight" :type="iconTypeRight" :size="rightIconSize" />
      <!-- NOTIFICATIONS -->
      <!-- <NotificationAlert v-if="numNotifications" :size="size" :numNotifications="numNotifications" /> -->
    </div>
  </li>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  data: string;
  iconTypeLeft?: string;
  iconTypeRight?: string;
  numNotifications?: number;
  isRounded?: boolean;
  isDisabled?: boolean;
}>();

const leftIconSize = computed(() => {
  if (props.size === "very large") {
    return "large";
  } else {
    return props.size;
  }
});

const rightIconSize = computed(() => {
  if (props.size === "medium") {
    return "small";
  } else if (props.size === "large") {
    return "medium";
  } else {
    return "medium";
  }
});
</script>
