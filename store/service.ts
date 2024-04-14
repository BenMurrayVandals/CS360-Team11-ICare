import { defineStore } from "pinia";
import { useUserStore } from "~~/store/user";

export const useServiceStore = defineStore("service", () => {
  const { matchPreferenceNumToStr } = useForm();

  const userStore = useUserStore();

  const services = ref<Service[]>(null);

  const getAllServices = async (): Promise<Service[] | undefined> => {
    if (!services.value) {
      try {
        const allServices = await $fetch<Service[]>(`/api/${userStore.user?.userType}/services/getAllServices`, {
          headers: useRequestHeaders(["cookie"]),
        });

        if (allServices) {
          services.value = allServices;
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    }

    return services.value;
  }

  const profile = computed<Profile>(() => ({
    id: "profile",
    serviceType: "Profile",
    matchPreference: userStore.isCustomer
      ? matchPreferenceNumToStr((userStore.user as ICustomer)?.matchPreference) ?? "Good"
      : "None",
    phoneNumber: userStore.user?.phoneNumber ?? "",
    email: userStore.user?.email,
  }));

  /* RESET USER STATE */
  // Resets the User State
  const $reset = () => {
    services.value = null;
  };

  return {
    services,
    getAllServices,
    profile,
    $reset,
  };
});
