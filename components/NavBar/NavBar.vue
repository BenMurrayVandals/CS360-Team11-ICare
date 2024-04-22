<template>
  <header class="sticky top-0 flex items-center justify-between bg-slate-900 w-full p-4 sm:px-6">
    <div class="flex items-center justify-start gap-x-6">
      <NavBarButton v-if="userStore.isLoggedIn && route.path === '/matches'" @click="$emit('toggleSidePanel')" data="Toggle Side Panel" />
    </div>
    <!-- RIGHT -->
    <div class="flex items-center justify-end gap-x-6">
      <!-- LOGIN -->
      <NavBarButton v-if="!userStore.isLoggedIn" data="Login" path="/login" />
      <!-- SIGNUP -->
      <NavBarButton v-if="!userStore.isLoggedIn" data="Signup" path="/signup" />
      <!-- MATCHES -->
      <NavBarButton v-if="userStore.isLoggedIn" :data="route.path === '/' ? 'Matches' : 'Home'" :path="route.path === '/' ? '/matches' : '/'" />
      <!-- LOGOUT -->
      <NavBarButton v-if="userStore.isLoggedIn" @click="logout" data="Logout" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/store/user";

const { logout } = useAuth();

const emits = defineEmits<{
  (e: 'toggleSidePanel')
}>()

const userStore = useUserStore();

/* ROUTING */
const route = useRoute();
</script>
