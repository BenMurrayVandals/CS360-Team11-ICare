import { defineStore } from "pinia";
import { useUserStore } from "~~/store/user";

export const useServiceStore = defineStore("service", () => {
  const { matchPreferenceNumToStr } = useForm();

  const userStore = useUserStore();

  const services = ref<Service[]>([
    {
      id: "internet",
      customerId: "682d8f2a-52b5-4f96-950c-0ca130f11bc4",
      type: "Internet",
      costPerMonth: 20,
      speed: 57,
      allowLessSpeed: true,
    },
  ]);

  const profile = computed<Profile>(() => ({
    id: "profile",
    type: "Profile",
    matchPreference: userStore.isCustomer
      ? matchPreferenceNumToStr((userStore.user as ICustomer)?.matchPreference) ?? "Good"
      : "None",
    phoneNumber: userStore.user?.phoneNumber ?? "(808)-278-7627",
    email: userStore.user?.email,
  }));

  /* RESET USER STATE */
  // Resets the User State
  const $reset = () => {
    services.value = null;
  };

  return {
    services,
    profile,
    $reset,
  };
});
