import { useServiceStore } from "~~/store/service";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const serviceStore = useServiceStore();
  await serviceStore.getAllServices();
});
