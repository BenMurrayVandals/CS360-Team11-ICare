export const useRouteMiddleware = () => {
    // Prevents navigation from the passed 'to' Route to the passed 'from' Route.
    const preventNavigation = (to, from) => {
      // If the Route Path being routed to is not the same as the Route Path being routed from, reroute the User to the Route Path being routed from.
      // This essentially keeps the User on their current Page when they try to route to a prohibited Route through the App.
      // The If check is needed because if the App is Mounted with a Route that is prohibited (So if the User tries to manually alter the URL to access a prohibited route),
      // both the 'to' and 'from' Routes will be the same so there will be no 'from' Route that could be rerouted back to.
      // In that case, reroute to the Home page.
      if (to.fullPath !== from.fullPath) {
        return navigateTo(from.fullPath);
      } else {
        return navigateTo("/");
      }
    };
  
    return { preventNavigation };
  };