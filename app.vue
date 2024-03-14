<template>
  <div v-resize="getWindowDimensionsThrottled" id="teleport-anchor" class="relative overflow-hidden">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
const { getLoggedInUser } = useAuth();
const { throttle } = getFuncDelays();

// Sets the User State to the Logged In User whose ID is encrypted and stored in the 'auth_token' Cookie, if it exists, and returns the Logged In User.
// This is used to persist the Logged In User across App refreshes because remounting the App would cause the current User State to be deleted, so we
// use a Cookie to store and persist the encrypted ID of the User who should be Logged In.
const user = await getLoggedInUser();

// Used to keep track of the width and height of the Window
// The reason we're defining this at App level is so that the Window dimensions will persist across all Pages and Components
// Otherwise we'd have to get the Window dimensions for every Page/Component that needs them when they're individually Mounted
// The problem with that is that any HTML Elements that conditionally rely on the Window dimensions (I.E Logic using CSS Breakpoints) will need to wait for the Page/Component to finish Mounting first
// Which will cause the conditional Element(s) to initially have an delayed display
const windowDimensions = ref({
  width: null,
  height: null,
});

// Computes an Object of Boolean values for what CSS Breakpoints have/haven't been reached depending on the width of the Window
const atBreakpoint = computed(() => {
  return {
    sm: windowDimensions.value.width > 640,
    md: windowDimensions.value.width > 768,
    lg: windowDimensions.value.width > 1024,
    xl: windowDimensions.value.width > 1280,
  };
});

// Provides the following data to all Pages/Components to be Injected
provide("windowDimensions", readonly(windowDimensions));
provide("atBreakpoint", readonly(atBreakpoint));

// Gets the width and height of the Window
const getWindowDimensions = (dimensions: { width: number; height: number }) => {
  dimensions.width = window.innerWidth;
  dimensions.height = window.innerHeight;
};

// Executes the 'getWindowDimensions', throttled by a specified amount of time
// This needs to be a seperately defined function because the final function that is called by 'v-resize', 'getWindowDimensions', includes parameters
// but JS and Vue Event Listeners require a function without parameters in order to correctly be added/removed
// 'throttle' returns a function, so 'getWindowDimensionsThrottled' is set equal to the function that is returned from 'throttle'
const getWindowDimensionsThrottled = throttle(() => {
  getWindowDimensions(windowDimensions.value);
}, 250);

onMounted(async () => {
  // Calls 'getWindowDimensions' to determine the width and height of the Window
  // This function needs to be called when the App is mounted because otherwise the value of the Window will be undefined
  getWindowDimensions(windowDimensions.value);
});
</script>
