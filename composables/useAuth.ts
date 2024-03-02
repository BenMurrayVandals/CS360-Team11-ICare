import { useUserStore } from "~~/store/user";

export const useAuth = () => {
  const { Alert } = useAlerts();

  const userStore = useUserStore();

  // Signs up a new Customer using the passed Username, First Name, Last Name, Email, and Password
  const signupCustomer = async ({
    username,
    firstName,
    lastName,
    email,
    password,
  }: {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      // Makes a Post Request to the 'signup' Server API Endpoint to create a new Customer using the passed info as the Body.
      const data = await $fetch<{ customer: ICustomer; errors: FormErrors }>("/api/customer/auth/signup", {
        method: "POST",
        body: { username, firstName, lastName, email, password },
      });

      // The destructured returned data.
      const { customer, errors } = data ?? {};

      // If a new Customer was successfully created with no Form Errors.
      if (customer && !errors) {
        // Assigns the created customer to the 'user' User State.
        userStore.user = customer;

        // Routes to the Home Page
        return navigateTo("/");
      }
      // If there are any Form Errors
      else if (errors) {
        return errors;
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  // Signs up a new Business using the passed Username, First Name, Last Name, Email, and Password
  const signupBusiness = async ({
    businessName,
    email,
    password,
  }: {
    businessName: string;
    email: string;
    password: string;
  }) => {
    try {
      // Makes a Post Request to the 'signup' Server API Endpoint to create a new Business using the passed info as the Body.
      const data = await $fetch<{ business: IBusiness; errors: FormErrors }>("/api/business/auth/signup", {
        method: "POST",
        body: { businessName, email, password },
      });

      // The destructured returned data.
      const { business, errors } = data ?? {};

      // If a new Business was successfully created with no Form Errors.
      if (business && !errors) {
        // Assigns the created business to the 'user' User State.
        userStore.user = business;

        // Routes to the Home Page
        return navigateTo("/");
      }
      // If there are any Form Errors
      else if (errors) {
        return errors;
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  // Logs in a Customer using the passed Email and Password
  const loginCustomer = async ({ email, password }: { email: string; password: string }) => {
    try {
      // Makes a Post Request to the 'login' Server API Endpoint to log in the Customer using the passed info as the Body.
      const data = await $fetch<{ customer: ICustomer; errors: FormErrors }>("/api/customer/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      // The destructured returned data.
      const { customer, errors } = data ?? {};

      // If the Customer was successfully logged in with no Form Errors.
      if (customer && !errors) {
        // Assigns the returned customer to the 'user' User State.
        userStore.user = customer;

        // Routes to the created Home page
        return navigateTo("/");
      }
      // If there are any Form Errors
      else if (errors) {
        return errors;
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  // Logs in a Business using the passed Email and Password
  const loginBusiness = async ({ email, password }: { email: string; password: string }) => {
    try {
      // Makes a Post Request to the 'login' Server API Endpoint to log in the Business using the passed info as the Body.
      const data = await $fetch<{ business: IBusiness; errors: FormErrors }>("/api/business/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      // The destructured returned data.
      const { business, errors } = data ?? {};

      // If the Business was successfully logged in with no Form Errors.
      if (business && !errors) {
        // Assigns the returned business to the 'user' User State.
        userStore.user = business;

        // Routes to the created Home page
        return navigateTo("/");
      }
      // If there are any Form Errors
      else if (errors) {
        return errors;
      }
    } catch (err) {
      console.log("ERROR: ", err);
    }
  };

  // Logs out the currently Logged In User
  const logout = async () => {
    // Makes a Get Request to the 'Logout' Server API Endpoint to Log the User out by deleting the 'auth_token' Cookie
    // This essentially logs the User out on the Server Side
    await $fetch("/api/logout");

    // Navigates to the Home page
    await navigateTo("/");

    // Resets all Stores
    // We're using 'setTimeout' in order to make this action asynchronous, because otherwise there would be an error where even after rerouting, the Logged In User's State data
    // for the Page before being rerouted will still be accessed, causing an error because that State data would be reset.
    setTimeout(() => {
      // Reset all Stores
      userStore.$reset();
    }, 0);
  };

  // Returns the 'auth_token' Cookie
  const getAuthCookie = () => useCookie("auth_token");

  // Returns the currently Logged In User that is stored in the User State.
  // If the User State is currently empty but there is an 'auth_token' Cookie which is used to persist the logged in User across App refreshes,
  // use the value of that Cookie to find the logged in User in the Server and set that User's info as the User State.
  const getLoggedInUser = async (): Promise<IUser | null> => {
    // Gets the 'auth_token' Cookie
    const authCookie = getAuthCookie();

    // If the 'auth_token' Cookie exists but no User is currently stored in the User State, this means that the App
    // is being Mounted for the first time so the User State is empty but the ID of the currently logged in User is
    // still stored in the 'auth_token' Cookie.
    // We need to use the value of the 'auth_token' Cookie to return the info of the currently logged in User and set the
    // User State equal to that User.
    if (authCookie.value && !userStore.user) {
      try {
        // This is required to be passed to the request in order for Cookies to be accessed for some reason
        const cookieHeaders = useRequestHeaders(["cookie"]);

        // Makes a Get Request to the 'getUserByAuthToken' Server API Endpoint to return the User info of the currently logged in User
        // whose ID is encrypted and stored in the 'auth_token' Cookie.
        const user = await $fetch<IUser>("/api/getUserByAuthToken", {
          headers: cookieHeaders,
        });

        // If a User with an ID matching the encrypted ID of the Logged In User stored in the 'auth_token' Cookie is found
        if (user) {
          userStore.user = user;
        }
      } catch (err) {
        console.log("ERROR: ", err);
      }
    }

    // Returns the User stored in the User State, which can either by a User or 'null'
    return userStore.user;
  };

  return { signupCustomer, signupBusiness, loginCustomer, loginBusiness, logout, getLoggedInUser, getAuthCookie };
};
