<template>
  <div ref="content" class="flex items-center justify-center">
    <Transition @before-leave="setWidthFixed" name="loading" mode="out-in">
      <!-- NOT-LOADING CONTENT SLOT OUT -->
      <div v-if="!isLoading" class="flex items-center justify-center max-w-xl overflow-hidden">
        <slot></slot>
      </div>
      <!-- LOADING SPINNER -->
      <GeneralLoadingSpinner v-else :color="color" class="max-w-xl overflow-hidden" />
    </Transition>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  color?: string;
  isLoading?: boolean;
}>();

// Template Ref for this Component's content.
const content = ref<HTMLElement>(null);

// If the leaving element is the non-loading slot content, set the width of this Component to be fixed so that the width doesn't shrink to fit
// the size of the loading spinner.
// TODO: Potentially fix issue where if this Component is first displayed (not mounted) when the loading spinner is visible, instead of the
// non-loading slot content, the Component's width will fit the spinner because the not-loading slot content hasn't been displayed yet.
const setWidthFixed = (el: HTMLElement) => {
  // If either this element is hidden (offsetParent is null) or the leaving element is the loading spinner (isLoading is false), return.
  // This guarantees that this Component's width is only set to be fixed if this element is visible and the leaving element is the
  // non-loading slot content.
  if (el.offsetParent === null || !props.isLoading) return;

  // Sets the width of this Component to be its current fixed width.
  content.value.style.width = window.getComputedStyle(content.value).getPropertyValue("width");
};
</script>

<style scoped>
.loading-enter-active,
.loading-leave-active {
  transition: max-width 0.5s ease-in-out, opacity 0.5s ease;
}

/* Opacity needs to be greater than 0 otherwise the element is hidden before the width transition is applied */
.loading-enter-from,
.loading-leave-to {
  max-width: 0px;
  opacity: 0.5;
}
</style>
