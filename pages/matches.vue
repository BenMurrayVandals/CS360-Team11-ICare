<template>
  <div>
    <!-- MAIN CONTAINER -->
    <div class="flex flex-col items-center justify-start bg-slate-950 h-screen overflow-hidden">
      <!-- NAVBAR -->
      <NavBar />
      <!-- BODY -->
      <div
        class="flex w-full h-full overflow-hidden [&>:first-child>:first-child]:flex [&>:first-child>:first-child]:flex-col [&>:first-child>:first-child]:h-full [&>:first-child>:first-child]:overflow-hidden"
      >
        <!-- SIDE PANEL -->
        <LayoutsMatchedSidePanel :size="'large'" :showSidePanel="showSidePanel" alwaysVisibleBreakpoint="lg">
          <!-- FRIEND LISTINGS -->
          <!-- <LayoutsMatchedSidePanelListings :noListings="friendsFiltered.length <= 0"> -->
          <LayoutsMatchedSidePanelListings>
            <!-- LISTINGS SLOT CONTENT -->
            <template #listings>
              <div class="flex flex-col gap-y-6">
                <!-- NOTE: Do not add a comment as a sibling of a Transition Group element, it will cause a Hydration error -->
                <TransitionCustom name="users-section">
                  <div v-if="pendingMatches.length > 0" class="flex flex-col gap-y-4">
                    <TransitionGroup @beforeLeave="positionLeavingElement" name="users">
                      <LayoutsMatchedSidePanelListingsDivider
                        key="onlineUsersTitle"
                        :title="`Pending - ${numPendingMatches}`"
                      />
                      <LayoutsMatchedSidePanelListingsUser
                        v-for="match in pendingMatches"
                        @click="openUser(match.id, false)"
                        :key="match.id"
                        :userInfo="match"
                        :subText="`${match?.matched?.length} pending matches`"
                      />
                    </TransitionGroup>
                  </div>
                </TransitionCustom>
                <!-- OFFLINE USER LISTINGS -->
                <TransitionCustom name="users-section">
                  <div v-if="acceptedMatches.length > 0" class="flex flex-col gap-y-4">
                    <TransitionGroup @beforeLeave="positionLeavingElement" :name="'users'">
                      <LayoutsMatchedSidePanelListingsDivider
                        key="offlineUsersTitle"
                        :title="`Accepted - ${numAcceptedMatches}`"
                      />
                      <LayoutsMatchedSidePanelListingsUser
                        v-for="match in acceptedMatches"
                        @click="openUser(match.id, true)"
                        :key="match.id"
                        :userInfo="match"
                        :subText="`${match?.matched?.length} matches`"
                        isAccepted
                      />
                    </TransitionGroup>
                  </div>
                </TransitionCustom>
              </div>
            </template>
            <!-- NO LISTINGS SLOT CONTENT -->
            <template #no-listings>
              <!-- NO LISTINGS MESSAGE -->
              <TransitionCustom name="no-results-fade" mode="out-in">
                <div v-if="true" class="flex flex-col gap-y-10 h-5/6 side-panel-lg:h-2/3">
                  <!-- TOP -->
                  <p class="text-light-brown text-base font-bold text-center tracking-wide">
                    Looks like you haven't made any friends yet!
                  </p>
                  <!-- MIDDLE -->
                  <div class="flex flex-col gap-y-2 side-panel-lg:gap-y-4">
                    <!-- YOU CAN GET STARTED BY FINDING A -->
                    <p class="text-light-brown text-base font-bold text-center tracking-wide">
                      You can get started by finding a
                    </p>
                    <div class="flex flex-col items-center justify-center gap-2 side-panel-lg:flex-row">
                      <!-- PLAYER -->
                      <NuxtLink to="/find-a-player" class="flex items-center justify-center">
                        <GeneralButton :data="'Player'" iconType="player" color="brown" />
                      </NuxtLink>
                      <!-- OR -->
                      <p class="text-light-brown text-base font-bold text-center tracking-wide">or</p>
                      <!-- GAME MASTER -->
                      <NuxtLink to="/find-a-game-master" class="flex items-center justify-center">
                        <GeneralButton :data="'Game Master'" iconType="game master" color="brown" />
                      </NuxtLink>
                    </div>
                  </div>
                  <!-- BOTTOM -->
                  <div class="flex flex-col items-center justify-center gap-2 side-panel-lg:flex-row">
                    <!-- OR YOU CAN -->
                    <p class="text-light-brown text-base font-bold text-center tracking-wide">Or you can</p>
                    <!-- FIND FRIENDS -->
                    <div class="flex items-center justify-center">
                      <GeneralButton :data="'Find Friends'" iconType="add friend" color="brown" />
                    </div>
                    <!-- DIRECTLY! -->
                    <p class="text-light-brown text-base font-bold text-center tracking-wide">directly!</p>
                  </div>
                </div>
                <!-- NO LISTINGS THAT MATCH SEARCH -->
                <div v-else class="flex flex-col h-1/2">
                  <p class="text-light-brown text-base font-bold text-center tracking-wide">
                    Looks like you don't have any friends with that username!
                  </p>
                </div>
              </TransitionCustom>
            </template>
          </LayoutsMatchedSidePanelListings>
        </LayoutsMatchedSidePanel>
        <!-- MAIN -->
        <LayoutsMatchedBody
          @acceptMatch="acceptMatch"
          @denyMatch="denyMatch"
          :userInfo="selectedUser"
          :isAccepted="isSelectedUserAccepted"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useUserStore } from "~~/store/user";

// const { getUser } = useUser();
const { positionLeavingElement } = useTransitions();

definePageMeta({
  middleware: ["is-logged-in"],
});

const userStore = useUserStore();

/* ROUTING */
const route = useRoute();

/* SIDE PANEL */
const showSidePanel = ref(true);

const toggleSidePanel = () => {
  showSidePanel.value = !showSidePanel.value;
};

/* MATCHED */
const { matched, isCustomer } = storeToRefs(userStore);

const matchesCondensed = computed<UserSidePanel[]>(
  () =>
    [
      ...new Map(
        matched.value?.map((match) => [
          match?.business?.id,
          [
            match?.business?.id,
            {
              id: match?.business?.id,
              name: match?.business?.businessName,
            },
          ],
        ])
      ).values(),
    ]?.map(([key, value]) => ({
      ...(value as Object),
      matched: matched.value.filter((match) => match.business?.id === key),
    })) as UserSidePanel[]
);

const pendingMatches = computed<UserSidePanel[]>(() =>
  matchesCondensed.value
    ?.filter((curMatch) => curMatch.matched.some((match) => !match.notified))
    ?.map((curMatch) => ({ ...curMatch, matched: curMatch.matched.filter((match) => !match.notified) }))
);

const numPendingMatches = computed(() => matched.value.filter((curMatch) => !curMatch.notified)?.length);

const acceptedMatches = computed<UserSidePanel[]>(() =>
  matchesCondensed.value
    ?.filter((curMatch) => curMatch.matched.some((match) => match.notified && match.acceptStatus))
    ?.map((curMatch) => ({
      ...curMatch,
      matched: curMatch.matched.filter((match) => match.notified && match.acceptStatus),
    }))
);

const numAcceptedMatches = computed(
  () => matched.value.filter((curMatch) => curMatch.notified && curMatch.acceptStatus)?.length
);

const acceptMatch = async (serviceID: string) => {
  await markMatch(serviceID, true);
};

const denyMatch = async (serviceID: string) => {
  await markMatch(serviceID, false);
};

const markMatch = async (serviceID: string, isAccepted: boolean) => {
  const index = matched.value.findIndex(
    (curMatch) => (isCustomer.value ? curMatch.bserviceId : curMatch.cserviceId) === serviceID
  );

  if (index !== -1) {
    let updatedMatch;
    // const updatedMatch = await $fetch<Matched>(`/api/system/matched/${isAccepted ? "accept" : "reject"}Match`, {
    //   method: "PATCH",
    //   body: {
    //     matchedId: matched.value[index]?.id,
    //   },
    // });

    // if (!updatedMatch) return;

    matched.value[index].notified = updatedMatch?.notified ?? true;
    matched.value[index].acceptStatus = updatedMatch?.acceptStatus ?? isAccepted;

    const serviceIndex = selectedUser.value?.services?.findIndex((curService) => curService.id === serviceID);
    if (serviceIndex !== -1) selectedUser.value?.services?.splice(serviceIndex, 1);

    if (
      selectedUser.value?.user?.id === matched.value[index].business?.id &&
      pendingMatches.value.every((curMatch) => curMatch?.id !== matched.value[index].business?.id)
    ) {
      closeUser();
    }
  }
};

/* SELECTED USERS */
const selectedUser = ref<UserSideInfo>(null);

const isSelectedUserAccepted = ref(false);

// Fetches and opens the details/messages for the selected User, and adds the User's ID as a Hash to the URL if needed
const openUser = async (id: string, isAccepted: boolean) => {
  // If the Logged In User and the User being opened aren't friends, don't open the User details.
  // if (!userStore.user.users.friends.some((curFriend) => curFriend.toString() === id)) return;
  const match = (isAccepted ? acceptedMatches : pendingMatches).value.find((curMatch) => curMatch.id === id);
  console.log("Match found: ", match);

  // If the User's ID is different than the current URL Hash (Or if the URL doesn't have a Hash)
  if (route.hash.slice(1) !== id) {
    // The URL needs to be rerouted to include the User's ID as a Hash
    // (Note: Hashes need to start with a letter, and can't start with a number)
    // (Note Updated: Apparently they can start with a number now, my User IDs start with numbers and they're working \_(._.)_/)
    await navigateTo({ path: route.path, hash: `#${id}${isAccepted ? "Accepted" : "Pending"}` });
  }

  await nextTick(async () => {
    if (isCustomer.value) {
      // Fetches the User's Details.
      const user = await $fetch(`/api/business/auth/getBusiness?businessId=${id}`);

      const services = Object.values(user.services as Record<string, Service[]>)
        ?.filter((service) => service?.length > 0)
        ?.flat();

      // Adds the User's Details and Messaging info to the end of the 'selectedUsers' Array only after they have both been fetched.
      selectedUser.value = {
        user: user.business as unknown as IUser,
        services: services.filter((curService) =>
          match?.matched?.some(
            (curMatch) =>
              curMatch.bserviceId === curService.id &&
              (isAccepted ? curMatch.notified && curMatch.acceptStatus : !curMatch.notified)
          )
        ),
      };
    } else {
      // Fetches the User's Details.
      const user = await $fetch(`/api/customer/auth/getCustomer?customerId=${id}`);

      const services = Object.values(user.services)?.filter((service) => service);

      // Adds the User's Details and Messaging info to the end of the 'selectedUsers' Array only after they have both been fetched.
      selectedUser.value = {
        user: user.customer as unknown as IUser,
        services: services.filter((curService) =>
          match?.matched?.some((curMatch) => curMatch.cserviceId === curService.id)
        ),
      };
    }
  });

  // Closes the Side Panel
  showSidePanel.value = false;
  isSelectedUserAccepted.value = isAccepted;
};

// Closes the details/messages about a selected User
const closeUser = () => {
  // Hides the currently selected User's info
  selectedUser.value = null;

  // Opens the Side Panel
  showSidePanel.value = true;

  // Reroute to the same page without the User's Hash in the URl.
  return navigateTo(route.path);
};

onMounted(async () => {
  /* ROUTE HASHES */
  // If the URL has a Hash in it when this Page is Mounted
  if (route.hash) {
    if (route.hash?.includes("Accepted")) {
      // Fetches and opens the details/messages for the User whose ID matches the Route Hash.
      await openUser(route.hash.slice(1, route.hash.length - 8), true);
    } else if (route.hash?.includes("Pending")) {
      await openUser(route.hash.slice(1, route.hash.length - 7), false);
    }
  }

  // Adds an Event Listener onto the Window that will execute a function whenever the Hash in the URl changes.
  // This seems to only trigger when navigating forwards or backwards in the History either between different Hashes or from having
  // a Hash to not having a Hash, but not when routing to a new Hash or loading the Page with a Hash in the URl already.
  window.addEventListener("hashchange", async () => {
    // When the Hash changes, if the new route has a Hash in the URL.
    // We need to use 'location.hash' here instead of 'route.hash' because when the Hash changes, which triggers this Event listener, this Page's
    // Route Middleware(s) reevaluate and doesn't allow us to access the updated Route info (I.E The Hash) until the Route Middleware(s) finish.
    // However, this Event Listener will trigger before the Route Middleware(s) finish, so if we were to use 'route.hash' we would be accessing the
    // old Hash instead of the updated Hash.
    // The only way I've found to get around this is to use 'location.hash', which is JavaScript's built in Route API. The 'location' Hash value will
    // update before the Route Middleware(s) finish so that's why I'm accessing the Hash from there. Think of it as us needing to use JavaScript's built in
    // Route API in order to access the Hash when we're also using JavaScript's built in Event Listeners.
    if (location.hash) {
      if (location.hash?.includes("Accepted")) {
        await openUser(location.hash.slice(1, location.hash.length - 8), true);
      } else if (location.hash?.includes("Pending")) {
        await openUser(location.hash.slice(1, location.hash.length - 7), false);
      }
    }
    // If the new Route doesn't have a Hash in it, that means that the previous Route did have a Hash but the new Route doesn't.
    else {
      // Closes the User's details/messages.
      closeUser();
    }
  });
});
</script>
