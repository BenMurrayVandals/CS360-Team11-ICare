<template>
  <div class="w-full min-w-full h-full overflow-y-auto lg:min-w-0">
    <div v-if="userInfo?.user?.id">
      <!-- HEADER -->
      <div class="flex items-center justify-between gap-x-2 bg-dark-brown p-6 z-30 sm:p-8">
        <!-- LEFT -->
        <div class="flex items-center gap-x-2 min-w-0 sm:gap-x-4">
          <!-- USERNAME INFO -->
          <div class="truncate">
            <!-- USERNAME -->
            <div class="flex items-center gap-x-2 bg-dark-brown h-14 sm:gap-x-4">
              <!-- DESKTOP -->
              <GeneralTitle
                size="very large"
                :text="userInfo?.user?.userType === 'customer' ? `${(userInfo?.user as ICustomer)?.firstName} ${(userInfo?.user as ICustomer)?.lastName}` : (userInfo.user as IBusiness)?.businessName"
                color="white"
                class="hidden sm:flex"
              />
              <!-- MOBILE -->
              <GeneralTitle
                size="medium"
                :text="userInfo?.user?.userType === 'customer' ? `${(userInfo?.user as ICustomer)?.firstName} ${(userInfo?.user as ICustomer)?.lastName}` : (userInfo.user as IBusiness)?.businessName"
                color="white"
                class="block sm:hidden"
              />
            </div>
          </div>
        </div>
        <!-- RIGHT -->
        <div v-if="!isAccepted && false" class="flex items-center gap-x-4">
          <GeneralButton type="button" color="white" data="Accept All" />
          <GeneralButton type="button" color="white" data="Deny All" />
        </div>
      </div>
      <!-- SERVICES -->
      <div class="flex flex-col items-start gap-y-6 w-full px-6 sm:p-8">
        <TransitionGroup @beforeLeave="positionLeavingElement" name="users">
          <LayoutsService
            @acceptMatch="$emit('acceptMatch', $event)"
            @denyMatch="$emit('denyMatch', $event)"
            v-for="service in userInfo?.services"
            :key="service?.id"
            :service="service"
            :isAcceptedMatch="isAccepted"
            isReadOnly
            isOppositeUserType
          />
        </TransitionGroup>
      </div>
    </div>
    <!-- NO USER SELECTED -->
    <div v-else class="flex items-center justify-center h-full px-4 sm:px-6">
      <h4 class="text-white text-lg font-bold">No user selected</h4>
    </div>
  </div>
</template>

<script setup lang="ts">
const { positionLeavingElement } = useTransitions();

const props = defineProps<{
  userInfo: UserSideInfo;
  isAccepted: boolean;
}>();

const emits = defineEmits<{
  (e: "acceptMatch", serviceID: string);
  (e: "denyMatch", serviceID: string);
}>();
</script>
