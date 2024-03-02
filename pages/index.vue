<template>
  <div class="flex flex-col items-center justify-start gap-y-12 bg-slate-950 h-screen">
    <NavBar />
    <div class="flex flex-col items-center gap-y-6 w-1/2"></div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/store/user";

useSeoMeta({
  title: "Home",
});

const userStore = useUserStore();
</script>
