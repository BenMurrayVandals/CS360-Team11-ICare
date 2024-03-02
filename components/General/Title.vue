<template>
  <div
    :class="[
      [
        isClickable
          ? 'flex flex-col hover:cursor-pointer [&:hover>:last-child]:block [&:hover>:first-child]:bg-right-bottom'
          : '',
      ],
      [textWrap ? '[&>:first-child]:whitespace-normal' : '[&>:first-child]:truncate truncate'],
      {
        'h-[90px]': size === 'insanely large' && isClickable,
        'h-[70px]': size === 'extremely large' && isClickable,
        'h-[50px]': size === 'very large' && isClickable,
        'h-[40px]': size === 'large' && isClickable,
        'h-[30px]': size === 'medium' && isClickable,
        'h-[22.5px]': size === 'small' && isClickable,
        'h-[20px]': size === 'base' && isClickable,
        'h-[17.5px]': size === 'very small' && isClickable,
        'h-[15px]': size === 'extremely small' && isClickable,
        '[&>:first-child]:text-white': color === 'white',
        '[&>:first-child]:text-very-light': color === 'very light',
        '[&>:first-child]:text-slate-500': color === 'light',
        '[&>:first-child]:text-slate-700': color === 'normal',
        '[&>:first-child]:text-slate-900': color === 'dark',
        '[&>:first-child]:text-slate-950': color === 'very dark',
        '[&>:first-child]:text-blue-600': color === 'accent',
      },
    ]"
    class="[&>:first-child]:font-bold [&>:first-child]:leading-tight"
  >
    <h1
      v-if="size === 'extremely large' || size === 'very large' || size === 'insanely large'"
      :class="{
        'text-7xl': size === 'insanely large',
        'text-[56px]': size === 'extremely large',
        'text-[40px]': size === 'very large',
      }"
    >
      {{ text }}
    </h1>
    <!-- LARGE -->
    <h2 v-else-if="size === 'large'" class="text-[32px]">
      {{ text }}
    </h2>
    <!-- MEDIUM -->
    <h3 v-else-if="size === 'medium'" class="text-2xl">
      {{ text }}
    </h3>
    <!-- SMALL -->
    <h4 v-else-if="size === 'small'" class="text-lg">
      {{ text }}
    </h4>
    <!-- BASE & VERY SMALL -->
    <h5
      v-else-if="size === 'base' || size === 'very small'"
      :class="{
        'text-base': size === 'base',
        'text-sm': size === 'very small',
      }"
    >
      {{ text }}
    </h5>
    <!-- EXTREMELY SMALL -->
    <h6 v-else-if="size === 'extremely small'" class="text-xs">
      {{ text }}
    </h6>
    <!-- UNDERLINE -->
    <div
      v-if="isClickable"
      :class="{
        'h-1': size === 'very large' || size === 'extremely large' || size === 'insanely large',
        'h-0.5': size === 'large' || size === 'medium' || size === 'small' || size === 'base',
        'h-px': size === 'very small' || size === 'extremely small',
        'bg-white': color === 'white',
        'bg-very-light': color === 'very light',
        'bg-slate-500': color === 'light',
        'bg-slate-700': color === 'normal',
        'bg-slate-900': color === 'dark',
        'bg-slate-950': color === 'very dark',
        'bg-blue-600': color === 'accent',
      }"
      class="hidden w-auto rounded-full"
    ></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  size: TitleSize;
  text: string;
  color: string;
  isClickable?: boolean;
  textWrap?: boolean;
}>();
</script>
