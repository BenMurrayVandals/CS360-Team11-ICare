<template>
  <button
    type="button"
    :class="[
      [isAccent ? ' bg-blue-600 hover:bg-blue-700' : 'bg-slate-900 hover:bg-slate-950'],
      {
        'w-4 h-4': size == 'small',
        'w-6 h-6': size == 'medium',
        'w-8 h-8': size == 'large',
        'w-10 h-10': size == 'very large',
        'hover:first-1:fill-white/[0.85] hover:first-1:stroke-white/[0.85] hover:first-1:text-white/[0.85]':
          color === 'white',
      },
    ]"
    class="relative flex items-center justify-center transition-colors duration-300 rounded-full shrink-0"
  >
    <!-- ICON -->
    <GeneralLoading :color="color" :isLoading="isLoading">
      <IconCustom :type="iconType" :size="size" :color="color" />
    </GeneralLoading>
    <!-- NOTIFICATIONS -->
    <!-- <NotificationAlert v-if="numNotifications" :size="notificationAlertSize" :numNotifications="numNotifications" class="absolute bottom-0 right-0" /> -->
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  iconType: string;
  color: string;
  numNotifications?: number;
  isAccent?: boolean;
  isLoading?: boolean;
}>();

const notificationAlertSize = computed(() => {
  switch (props.size) {
    case "large":
      return "medium";
    case "medium":
      return "small";
    default:
      return props.size;
  }
});
</script>
