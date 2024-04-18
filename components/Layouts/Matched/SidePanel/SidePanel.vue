<template>
  <Transition
    @beforeEnter="setSidePanelWidthFixed($event, size)"
    @afterEnter="setSidePanelWidthFull"
    @beforeLeave="setSidePanelWidthFixed($event, size)"
    :name="atAlwaysVisibleBreakpoint ? '' : 'side-panel'"
  >
    <!-- SIDE PANEL -->
    <div
      v-show="showSidePanel || atAlwaysVisibleBreakpoint"
      :class="{
        'overflow-hidden': !showSidePanel,
        'overflow-x-hidden overflow-y-auto scrollbar-thin scroll-track-transparent scroll-thumb-dark':
          showSidePanel,
        'w-64': size === 'small',
        'w-80': size === 'medium',
        'w-[28rem]': size === 'large',
        'xl:overflow-x-hidden xl:overflow-y-auto xl:scrollbar-thin xl:scroll-track-transparent xl:scroll-thumb-dark':
          alwaysVisibleBreakpoint === 'xl',
        'lg:overflow-x-hidden lg:overflow-y-auto lg:scrollbar-thin lg:scroll-track-transparent lg:scroll-thumb-dark':
          alwaysVisibleBreakpoint === 'lg',
        'md:overflow-x-hidden md:overflow-y-auto md:scrollbar-thin md:scroll-track-transparent md:scroll-thumb-dark':
          alwaysVisibleBreakpoint === 'md',
        'sm:overflow-x-hidden sm:overflow-y-auto sm:scrollbar-thin sm:scroll-track-transparent sm:scroll-thumb-dark':
          alwaysVisibleBreakpoint === 'sm',
      }"
      class="shrink-0 bg-slate-900 max-w-full border-r-2 border-slate-800 transition-none"
    >
      <div>
        <!-- SIDE PANEL CONTENT SLOT OUTLET -->
        <slot></slot>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Ref } from "vue";
const { setSidePanelWidthFixed, setSidePanelWidthFull } = useSidePanel();

const props = defineProps<{
  size: Size;
  showSidePanel: boolean;
  alwaysVisibleBreakpoint?: Breakpoint;
}>();

/* BREAKPOINTS */
// An Object of Boolean values for what CSS Breakpoints have/haven't been reached
const atBreakpoint: Ref<Breakpoints> = inject("atBreakpoint");

// Computes whether the Breakpoint where the Side Panel should always be visible at has been reached yet.
// If no Breakpoint is passed to this Component as a prop (Meaning that the Side Panel shouldn't be always visible at a certain Breakpoint), then this value will always be false.
const atAlwaysVisibleBreakpoint = computed(() => {
  if (props.alwaysVisibleBreakpoint === "xl") {
    return atBreakpoint.value.xl;
  } else if (props.alwaysVisibleBreakpoint === "lg") {
    return atBreakpoint.value.lg;
  } else if (props.alwaysVisibleBreakpoint === "md") {
    return atBreakpoint.value.md;
  } else if (props.alwaysVisibleBreakpoint === "sm") {
    return atBreakpoint.value.sm;
  } else {
    return false;
  }
});
</script>

<style scoped>
/* SIDE PANEL COLLAPSE/EXPAND TRANSITION */
.side-panel-enter-active,
.side-panel-leave-active {
  transition: width 0.5s ease-out;
}

.side-panel-enter-from,
.side-panel-leave-to {
  width: 0px;
}
</style>
