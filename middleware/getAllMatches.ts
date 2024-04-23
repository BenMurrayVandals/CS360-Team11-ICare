import { useUserStore } from "~~/store/user";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const userStore = useUserStore();
  await userStore.getAllMatches();
});
