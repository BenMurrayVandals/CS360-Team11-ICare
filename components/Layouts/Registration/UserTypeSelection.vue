<template>
  <div class="flex flex-col gap-y-1 items-center justify-center pb-2">
    <!-- I AM A... -->
    <p class="text-white text-lg font-bold">I am a...</p>
    <!-- CUSTOMER/BUSINESS SELECT BUTTONS -->
    <div class="relative flex items-center justify-center w-full bg-slate-800 rounded-xl">
      <!-- CUSTOMER BUTTON -->
      <button
        @click="$emit('changeUserType', 'customer')"
        type="button"
        class="flex items-center justify-center p-4 w-full"
      >
        <p class="z-10 text-white text-base font-bold">Customer</p>
      </button>
      <!-- BUSINESS BUTTON -->
      <button
        @click="$emit('changeUserType', 'business')"
        type="button"
        class="flex items-center justify-center p-4 w-full"
      >
        <p class="z-10 text-white text-base font-bold">Business</p>
      </button>
      <!-- SELECTED BUTTON OVERLAY -->
      <div
        :class="[userType === 'customer' ? 'translate-x-[-50%]' : 'translate-x-[50%]']"
        class="absolute w-1/2 h-full bg-blue-600 transition-transform duration-300 rounded-xl"
      ></div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  userType: UserType;
}>();

defineEmits<{
  (e: "changeUserType", userType: UserType): void;
}>();
</script>
