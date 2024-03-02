import { defineStore } from "pinia";

export const useUserStore = defineStore("user", () => {
  /* USER */
  // The Logged In User's data
  const user = ref<IUser>(null);

  // If the Logged In User is a customer, use this to access their data.
  const customer = computed<ICustomer>(() => (user.value?.userType === "customer" ? user.value : null) as ICustomer);

  // Compites whether the Logged In User is a customer.
  const isCustomer = computed(() => user.value?.userType === "customer");

  // If the Logged In User is a business, use this to access their data.
  const business = computed<IBusiness>(() => (user.value?.userType === "business" ? user.value : null) as IBusiness);

  // Compites whether the Logged In User is a business.
  const isBusiness = computed(() => user.value?.userType === "business");

  // Computes whether or not there is a Logged In User.
  const isLoggedIn = computed(() => (user.value ? true : false));

  /* RESET USER STATE */
  // Resets the User State
  const $reset = () => {
    user.value = null;
  };

  return {
    user,
    customer,
    isCustomer,
    business,
    isBusiness,
    isLoggedIn,
    $reset,
  };
});
