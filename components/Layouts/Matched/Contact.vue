<template>
  <div class="flex flex-col bg-slate-800 w-full px-10 py-8 rounded-lg">
    <!-- HEADER -->
    <header class="flex items-center justify-center gap-x-12">
      <!-- LEFT -->
      <div class="grow">
        <GeneralTitle size="very large" text="Contact" color="white" class="py-[5.75px]" />
      </div>
    </header>
    <main>
      <div class="gap-x-6 columns-2 pt-10 pb-3">
        <!-- PHONE NUMBER -->
        <AnswersNormal size="medium" title="Phone Number" :text="phoneNumber" />
        <!-- EMAIL -->
        <AnswersNormal size="medium" title="Email" :text="email" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  phoneNumber: string;
  email: string;
}>();
</script>
