<template>
  <div
    :class="[
      [isAccent ? 'bg-blue-600 ' : 'bg-slate-900'],
      {
        'w-4 h-4': size == 'small',
        'w-6 h-6': size == 'medium',
        'w-8 h-8': size == 'large',
        'w-10 h-10': size == 'very large',
      },
    ]"
    class="flex items-center justify-center rounded-full shrink-0"
  >
    <!-- ICON -->
    <IconCustom :type="iconType" :size="size" :color="color" />
    <!-- NOTIFICATIONS -->
    <!-- <NotificationAlert v-if="numNotifications" :size="notificationAlertSize" :numNotifications="numNotifications" class="absolute bottom-0 right-0" /> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  iconType?: string;
  color?: string;
  numNotifications?: number;
  isAccent?: boolean;
}>();

const notificationAlertSize = computed(() => {
  switch (props.size) {
    case "large":
      return "medium";
    default:
      return props.size;
  }
});
</script>
