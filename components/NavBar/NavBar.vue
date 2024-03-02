<template>
  <header class="sticky top-0 flex items-center justify-end gap-x-6 bg-slate-900 w-full p-4 sm:px-6">
    <!-- LOGIN -->
    <NavBarButton v-if="!userStore.isLoggedIn" data="Login" path="/login" />
    <!-- SIGNUP -->
    <NavBarButton v-if="!userStore.isLoggedIn" data="Signup" path="/signup" />
    <!-- LOGOUT -->
    <NavBarButton v-else @click="logout" data="Logout" />
  </header>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/store/user";

const { logout } = useAuth();

const userStore = useUserStore();
</script>
