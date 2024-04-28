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

  const oppositeUserType = computed<UserType>(() => (isCustomer.value ? "business" : "customer"));

  // Computes whether or not there is a Logged In User.
  const isLoggedIn = computed(() => (user.value ? true : false));

  /* MATCHES */
  const matched = ref<Matched[]>([
    {
      id: "1",
      customerId: "customer",
      businessId: "220bf860-afee-4993-b129-6ba4de1b67cd",
      serviceType: "Lawn",
      cserivceId: "CustomerLawn",
      bserviceId: "5168172d-74f8-49c0-927b-a5b51c4d04ab",
      matchScore: 100,
      updatedAt: new Date(Date.now()),
      notified: false,
      acceptStatus: false,
      business: {
        id: "220bf860-afee-4993-b129-6ba4de1b67cd",
        businessName: "Business1",
      },
    },
    {
      id: "2",
      customerId: "customer",
      businessId: "220bf860-afee-4993-b129-6ba4de1b67cd",
      serviceType: "Interior",
      cserivceId: "CustomerInterior",
      bserviceId: "58a6c06d-ebf3-471a-92e3-1dc54c776371",
      matchScore: 50,
      updatedAt: new Date(Date.now()),
      notified: true,
      acceptStatus: true,
      business: {
        id: "220bf860-afee-4993-b129-6ba4de1b67cd",
        businessName: "Business1",
      },
    },
    {
      id: "3",
      customerId: "customer",
      businessId: "a4470d6a-9bd4-4836-addc-85767df00f2f",
      serviceType: "Internet",
      cserivceId: "InternetCustomer",
      bserviceId: "e8576ac7-9e5d-4e06-b257-9aa222de4e21",
      matchScore: 75,
      updatedAt: new Date(Date.now()),
      notified: false,
      acceptStatus: false,
      business: {
        id: "a4470d6a-9bd4-4836-addc-85767df00f2f",
        businessName: "Business2",
      },
    },
    {
      id: "4",
      customerId: "customer",
      businessId: "a4470d6a-9bd4-4836-addc-85767df00f2f",
      serviceType: "Internet",
      cserivceId: "InternetCustomer",
      bserviceId: "e709856a-d390-4e7d-8b3d-4f08a67f8692",
      matchScore: 75,
      updatedAt: new Date(Date.now()),
      notified: false,
      acceptStatus: false,
      business: {
        id: "a4470d6a-9bd4-4836-addc-85767df00f2f",
        businessName: "Business2",
      },
    },
    {
      id: "3",
      customerId: "customer",
      businessId: "a4470d6a-9bd4-4836-addc-85767df00f2f",
      serviceType: "Cell",
      cserivceId: "CellCustomer",
      bserviceId: "b6f43eef-0658-499e-bdf8-6de2786e9644",
      matchScore: 75,
      updatedAt: new Date(Date.now()),
      notified: false,
      acceptStatus: false,
      business: {
        id: "a4470d6a-9bd4-4836-addc-85767df00f2f",
        businessName: "Business2",
      },
    },
  ]);

  const getAllMatches = async (requestHeaders = useRequestHeaders(["cookie"])): Promise<Matched[] | undefined> => {
    try {
      const allMatches = await $fetch<Matched[]>(`/api/${user.value?.userType}/getMatched`, {
        headers: requestHeaders,
      });

      // console.log(allMatches)

      if (allMatches) {
        matched.value = allMatches;
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }

    return matched.value;
  };

  /* RESET USER STATE */
  // Resets the User State
  const $reset = () => {
    user.value = null;
    matched.value = null;
  };

  return {
    user,
    customer,
    isCustomer,
    business,
    isBusiness,
    oppositeUserType,
    isLoggedIn,
    matched,
    getAllMatches,
    $reset,
  };
});
