<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup lang="ts">
const { getLoggedInUser } = useAuth();

// Sets the User State to the Logged In User whose ID is encrypted and stored in the 'auth_token' Cookie, if it exists, and returns the Logged In User.
// This is used to persist the Logged In User across App refreshes because remounting the App would cause the current User State to be deleted, so we
// use a Cookie to store and persist the encrypted ID of the User who should be Logged In.
const user = await getLoggedInUser();
</script>
