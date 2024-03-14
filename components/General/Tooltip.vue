<template>
  <!-- TOOLTIP WRAPPER -->
  <div
    ref="anchor"
    @mouseenter="showTooltip"
    @mouseleave="hideTooltip"
    @click="hideTooltip"
    @focus="showTooltip"
    @blur="hideTooltip"
    @wheel="hideTooltip"
    @scroll="hideTooltip"
    @touchmove="hideTooltip"
    :aria-label="data"
    class="flex truncate"
  >
    <!-- TOOLTIP ANCHOR -->
    <slot></slot>
  </div>
  <!-- This is needed to Teleport anywhere that isn't the Body -->
  <ClientOnly>
    <!-- We aren't teleporting to the Body because then we need to add an overflow of hidden to the Body to prevent the Tooltips from overflowing, but doing so causes
        an issue on mobile where the bottom of the screen is clipped -->
    <Teleport to="#teleport-anchor">
      <Transition>
        <!-- TOOLTIP -->
        <div
          ref="tooltip"
          v-show="tooltipVisible"
          class="absolute top-0 left-0 bg-white text-slate-950 font-medium text-xs whitespace-pre-line break-words text-left leading-tight max-w-xs p-2 border-2 border-slate-950 shadow-xl rounded-md z-[70]"
        >
          {{ data }}
          <!-- TOOLTIP ARROW -->
          <div
            ref="tooltipArrow"
            :class="{
              'border-r-2 border-b-2': directionUpdated == 'top',
              'border-b-2 border-l-2': directionUpdated == 'right',
              'border-t-2 border-l-2': directionUpdated == 'bottom',
              'border-t-2 border-r-2': directionUpdated == 'left',
            }"
            class="absolute bg-white w-2 h-2 rotate-45 border-slate-950"
          ></div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { computePosition, offset, flip, shift, arrow } from "@floating-ui/dom";

const props = defineProps<{
  data: string;
  direction: Placement;
  offset?: number;
  isText?: boolean;
  textWidth?: number;
  textWidthClient?: number;
}>();

// Template Ref for the DOM Element which the Tooltip will be anchored to
const anchor = ref<HTMLElement>(null);
// Template Ref for the Tooltip
const tooltip = ref<HTMLElement>(null);
// Template Ref for the Tooltip's Arrow
const tooltipArrow = ref<HTMLElement>(null);

// Keeps track of if the Tooltip is visible or not
const tooltipVisible = ref(false);

// Keeps track of if the Anchor is currently being hovered/selected or not
const isAnchorSelected = ref(false);

// Keeps track of the value of 'placement' in the 'calculatePosition' function
// We use this value to apply Class Bindings for the Tooltip's Arrow border width
// We use this value instead of the 'direction' Prop because 'placement', and therefore this variable, updates if the Tooltip is flipped, whereas 'direction' does not
const directionUpdated = ref<Placement | string>(props.direction);

// Used to store the 'autoUpdate' function, learn more here - https://floating-ui.com/docs/autoUpdate
// I'M KEEPING THE CODE FOR THIS COMMENTED OUT IN CASE I WANT TO INCLUDE IT AGAIN LATER
// let cleanup;

// Used to store the 'setTimeout()' function execution
// This is used so that if the Anchor is unselected before the 'setTimeout()' function finishes (AKA if the 'hideTooltip' function is called), the timeout can be cleared
let timeout: ReturnType<typeof setTimeout>;

// Displays the Tooltip
const showTooltip = () => {
  // When the Anchor is selected, set to true
  isAnchorSelected.value = true;

  // Check if the Tooltip should be displayed after a specified amount of time from the 'timeout' setTimeout function instance
  timeout = setTimeout(() => {
    // If the Anchor is still Mounted and is still being hovered/selected by the time the 'setTimeout' function finishes, display the Tooltip
    if (anchor.value && isAnchorSelected.value == true) {
      // If the Anchor being hovered/selected is truncatable text, only display the Tooltip if the text is truncated
      if (props.isText) {
        // If the truncatable text isn't the first child element of the Anchor Element and has it's Width and Client Width passed as props
        if (props.textWidth && props.textWidthClient) {
          tooltipVisible.value = props.textWidth > props.textWidthClient;
        }
        // If the truncatable text is the first child element of the Anchor Element
        else {
          tooltipVisible.value = anchor.value.children[0].scrollWidth > anchor.value.children[0].clientWidth;
        }

        if (tooltipVisible.value) {
          calculatePosition();
        }
      }
      // If the Anchor being hovered/selected isn't text
      else {
        tooltipVisible.value = true;
        calculatePosition();
      }

      // Sets 'cleanup' equal to the 'autoUpdate' function which calls 'calculatePostion' to find the position of the Tooltip
      // This will also automatically update the position of the Tooltip whenever the window is scrolled or resized so long as the Tooltip is visible
      // cleanup = autoUpdate(element.value, tooltip.value, () => {
      //   calculatePosition();
      // });
    }
  }, 500);
};

// Hides the Tooltip
const hideTooltip = () => {
  // When the Anchor is unselected, set to false
  isAnchorSelected.value = false;

  // Clears the 'timeout' setTimeout instance
  clearTimeout(timeout);

  // Hide Tooltip
  tooltipVisible.value = false;

  // Calling the 'cleanup' function is required for the 'autoUpdate' function whenever the Tooltip is removed from the DOM
  // if (cleanup) {
  //   cleanup();
  //   cleanup = undefined;
  // }
};

// Calculates the position of the Tooltip relative to the Tooltip's Anchored element
const calculatePosition = async () => {
  // Learn more about this function here - https://floating-ui.com/docs/tutorial#positioning
  const { x, y, middlewareData, placement } = await computePosition(anchor.value, tooltip.value, {
    placement: props.direction,
    middleware: [
      offset(props.offset ? props.offset : 8),
      shift({ padding: 0 }),
      flip(),
      arrow({ element: tooltipArrow.value }),
    ],
  });
  // console.log("Tooltip Running");

  // Uses the 'x' and 'y' coordinates of the 'Anchor' Template Ref and assigns them to the 'left' and 'top' style properties for the Tooltip
  // This positions the Tooltip relative to the Anchor Element, even though the Tooltip has a positon of 'absolute'
  Object.assign(tooltip.value.style, {
    left: `${x}px`,
    top: `${y}px`,
  });

  // Uses the 'placement' value for the direction of the Tooltip (Using 'split()' to get the base direction of 'placement' because the placement can also have '-start' or '-end' attached to it which we don't want here)
  // We create an object of directions which flips the value of whatever the 'placement' value is
  // This is used to apply the placement of the Tooltip's Arrow and to set the direction of the 'transform-origin' property for the Tooltip's open/close Vue Transition
  // (For example, if the Tooltip's placement is 'top', the Arrow will be placed on the bottom of the Tooltip and the 'transform-origin' property for the Tooltip's animation will be set to 'bottom')
  const tooltipOrigin = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom",
  }[placement.split("-")[0]];

  // Sets the direction used for the 'transform-origin' property for the open/close Vue Transition to be the opposite of whatever the base direction of 'placement' is
  tooltip.value.style.transformOrigin = tooltipOrigin;

  /* ARROW */
  // Updates 'directionUpdated' to be equal to the base direction of 'placement' so that 'directionUpdated' can be used to style the Tooltip's Arrow border width
  directionUpdated.value = placement.split("-")[0];

  // Destructures the 'x' and 'y' coordinates of the Tooltip's Arrow, giving each variable aliases because 'x' and 'y' are already variables
  const { x: arrowX, y: arrowY } = middlewareData.arrow;

  // Uses the 'x' and 'y' coordinates for the Tooltip's Arrow that's been calculated and assigns them to the 'left' and 'top' style properties
  // This positions the Tooltip's Arrow relative to the anchored element, even though the Tooltip has a positon of 'absolute'
  // We also use 'tooltipOrigin' which we created to position the arrow on the side of the Tooltip opposite of the Tooltip's placement direction
  Object.assign(tooltipArrow.value.style, {
    left: arrowX != null ? `${arrowX}px` : "",
    top: arrowY != null ? `${arrowY}px` : "",
    bottom: "",
    right: "",
    [tooltipOrigin]: "-6px",
  });
};
</script>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: transform 0.15s ease;
}

.v-enter-from,
.v-leave-to {
  transform: scale(0, 0);
}
</style>
