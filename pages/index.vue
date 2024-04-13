<template>
  <div class="flex flex-col items-center justify-start bg-slate-950 min-h-screen">
    <NavBar />
    <div v-if="userStore.isLoggedIn" class="flex flex-col items-center gap-y-12 py-12 w-2/3">
      <!-- PROFILE -->
      <LayoutsServiceProfile :profile="serviceStore.profile" />
      <!-- SERVICES -->
      <div class="flex flex-col items-start gap-y-6 w-full">
        <GeneralTitle size="very large" text="Services" color="white" />
        <TransitionGroup @beforeLeave="positionLeavingElement" name="users">
          <LayoutsService
            v-for="service in serviceStore.services"
            :key="service?.key ?? service?.id"
            :service="service"
          />
          <LayoutsServiceAddService @click="addService" key="addService" />
        </TransitionGroup>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from "~~/store/user";
import { useServiceStore } from "~~/store/service";

const { positionLeavingElement } = useTransitions();
const { generateID } = useUtilities();

useSeoMeta({
  title: "Home",
});

definePageMeta({
  middleware: ["is-logged-in", "get-all-services"],
});

const serviceStore = useServiceStore();
const userStore = useUserStore();

const addService = () => {
  const id = generateID();

  if(!serviceStore.services) serviceStore.services = []

  serviceStore.services?.push({
    id,
    [`${userStore.isCustomer ? "customer" : "business"}Id`]: userStore.user?.id,
    key: `new-${id}`,
    serviceType: null,
  });
};
</script>
