<template>
  <div
    :class="{
      'gap-x-2 pl-2 pr-2 py-1 border-2': size === 'small',
      'gap-x-3 pl-3 pr-2 py-1.5 border-[3px]': size === 'medium',
      'gap-x-4 pl-4 pr-4 py-2 border-4': size === 'large',
      'bg-red-100 border-red-500': alert.type === 'error',
      'bg-amber-100 border-amber-500': alert.type === 'warning',
      'bg-sky-100 border-blue-600': alert.type === 'note',
    }"
    class="flex items-center rounded-lg"
  >
    <p
      :class="{
        'text-xs font-medium': size === 'small',
        'text-sm font-medium': size === 'medium',
        'text-base leading-snug': size === 'large',
      }"
      class="text-slate-900 whitespace-pre-line break-words"
    >
      {{ alert.message }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  size: Size;
  alert: Alert;
}>();
</script>
