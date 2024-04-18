<template>
  <div class="flex flex-col bg-slate-800 max-h-40 px-4 rounded-lg cursor-pointer">
    <!-- BODY -->
    <div class="flex items-center justify-between gap-x-2">
      <!-- LEFT -->
      <div class="flex items-center gap-x-2 min-w-0 py-5">
        <!-- USER INFO -->
        <div class="flex flex-col truncate">
          <!-- USERNAME -->
          <div class="flex items-center gap-x-2 truncate">
            <!-- USERNAME -->
            <div class="truncate">
              <GeneralTooltip :data="userInfo?.name" direction="top" isText>
                <h5 class="text-very-light font-bold text-base leading-snug truncate">{{ userInfo?.name }}</h5>
              </GeneralTooltip>
            </div>
          </div>
          <div class="truncate">
            <GeneralTooltip :data="subText" direction="top" isText>
              <p class="text-very-light text-sm leading-snug truncate">{{ subText }}</p>
            </GeneralTooltip>
          </div>
        </div>
      </div>
      <!-- RIGHT -->
      <div v-if="!isAccepted && false" class="flex items-center gap-x-1">
        <!-- ACCEPT -->
        <IconWithTooltip
          @click.stop=""
          :size="'medium'"
          iconType="checkmark"
          color="white"
          tooltipText="Accept All"
          isAccent
        />
        <!-- DENY -->
        <IconWithTooltip
          @click.stop=""
          :size="'medium'"
          iconType="remove"
          color="white"
          tooltipText="Deny All"
          isAccent
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  userInfo: UserSidePanel;
  subText?: string
  isAccepted?: boolean
}>();
</script>
