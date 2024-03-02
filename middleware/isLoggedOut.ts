export default defineNuxtRouteMiddleware(async (to, from) => {
  const { getLoggedInUser } = useAuth();
  const { preventNavigation } = useRouteMiddleware();

  // Returns the currently Logged In User, if there is one.
  const user = await getLoggedInUser();

  // If there is a currently Logged In User, then the Route Path being routed to is prohibited
  if (user) {
    // Prevents navigation to the Route Path being routed to.
    return preventNavigation(to, from);
  }
});