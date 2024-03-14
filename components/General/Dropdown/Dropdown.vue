<template>
  <div v-click-outside="clickOutsideDirectiveArgs">
    <!-- DROPDOWN ANCHOR WRAPPER -->
    <div ref="anchor" @click="toggleDropdown" class="cursor-pointer">
      <!-- ANCHOR ANCHOR SLOT OUTLET -->
      <slot name="anchor" :dropdownVisible="dropdownVisible" :closeDropdown="closeDropdown"></slot>
    </div>
    <!-- This is needed for Icons to work and in order to Teleport to anywhere that isn't the Body -->
    <ClientOnly>
      <!-- Teleports Dropdown to the first element within Body to escape any parent elements with position of 'relative' -->
      <!-- We aren't teleporting to the Body because then we need to add an overflow of hidden to the Body to prevent the Dropdowns from overflowing, but doing so causes
        an issue on mobile where the bottom of the screen is clipped -->
      <Teleport :disabled="disableTeleport || isModalOpen" to="#teleport-anchor">
        <!-- DROPDOWN -->
        <Transition name="dropdown">
          <!-- DROPDOWN CONTAINER -->
          <div
            ref="dropdown"
            v-show="dropdownVisible"
            :class="{
              'max-h-48': height === 'short',
              'max-h-80': height === 'medium',
              'max-h-[36rem]': height === 'tall',
              'max-h-[48rem]': height === 'very tall',
              'z-50': isModalOpen,
              'z-40': !isModalOpen && isHeaderDropdown,
              'z-20': !isModalOpen && !isHeaderDropdown,
            }"
            class="absolute top-0 left-0 flex flex-col bg-white outline outline-2 outline-slate-900 overflow-auto scrollbar-thin scroll-track-transparent scroll-thumb-normal shadow-xl rounded-md"
          >
            <!-- DROPDOWN CONTENT SLOT OUTLET -->
            <slot name="dropdown-content" :closeDropdown="closeDropdown"></slot>
          </div>
        </Transition>
      </Teleport>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { computePosition, offset, shift, flip, size, autoUpdate } from "@floating-ui/dom";
import type { Ref } from "vue";

const props = defineProps<{
  dropdownDirection: Placement;
  clickOutsideElements?: HTMLElement[];
  height: DropdownHeight;
  disableTeleport?: boolean;
  isHeaderDropdown?: boolean;
  closeDropdownWhenTrue?: boolean;
}>();

// Injects a boolean value, which is Provided by the 'ModalBase' Component, of if the Modal is open or not.
// For more info on why this value is needed, go to the 'ModalBase' Component where this value is Provided.
const isModalOpen: Ref<boolean> = inject("isModalOpen", ref(false));

/* DROPDOWN */
// Template Ref for the DOM Element which the Dropdown will be anchored to
const anchor = ref<HTMLElement>(null);
// Template Ref for the Dropdown
const dropdown = ref<HTMLElement>(null);

// Keeps track of if the Dropdown is visible or not
const dropdownVisible = ref(false);

// Used to store the 'autoUpdate' function, learn more here - https://floating-ui.com/docs/autoUpdate
let cleanup: any;

// Toggles the Dropdown
const toggleDropdown = () => {
  // Only run this function if the 'anchor' and 'dropdown' Template Refs are mounted
  if (anchor.value && dropdown.value) {
    if (!dropdownVisible.value) {
      // If the Dropdown is not visible, call the 'openDropdown' function
      openDropdown();
    } else {
      // If the Dropdown is visible, call the 'closeDropdown' function
      closeDropdown();
    }
  }
};

// Opens the Dropdown
// This doesn't need to be a seperate function, but since 'closeDropdown' does need to be, I figured I'd make this a seperate function too
const openDropdown = () => {
  // Display the Dropdown
  dropdownVisible.value = true;

  // Sets 'cleanup' equal to the 'autoUpdate' function which calls 'calculatePostion' to find the position of the Dropdown
  // This will also automatically update the position of the Dropdown whenever the window is resized so long as the Dropdown is visible
  cleanup = autoUpdate(
    anchor.value,
    dropdown.value,
    () => {
      calculatePosition();
    },
    {
      ancestorScroll: true,
      elementResize: false,
    }
  );
};

// Closes the Dropdown
// This needs to be a seperate function instead of being worked into 'toggleDropdown' because this function is called for the 'v-click-outside' Directive
const closeDropdown = () => {
  // Only run the function if the Dropdown is visible (So the code doesn't execute for unnecessary 'v-click-outside' function calls) and if the 'anchor' and 'dropdown' Template Refs are mounted
  if (dropdownVisible.value && anchor.value && dropdown.value) {
    // Hide the Dropdown
    dropdownVisible.value = false;

    // Calling the 'cleanup' function is required for the 'autoUpdate' function whenever the Dropdown is removed from the DOM
    if (cleanup) {
      cleanup();
      cleanup = undefined;
    }
  }
};

// Watches for when the 'closeDropdownWhenTrue' prop is changed to be true, which should trigger the Dropdown to close if it's currently open.
watch(
  () => props.closeDropdownWhenTrue,
  (newVal) => {
    if (newVal && dropdownVisible.value) closeDropdown();
  }
);

// Exposes the 'closeDropdown' function and the 'dropdown' Template Ref to be able to be accessed via Template Refs on instances of this Component being used
// by any Parent Components.
// We're doing this for the 'dropdown' Template Ref to be able to be able to pass the Template Ref as apart of the 'clickOutsideElements' prop into parent
// instances of the 'GeneralDropdown' Component.
// We're doing this for the 'closeDropdown' function so that Dropdown Content Items passed by the Parent Component using a Slot can call the 'closeDropdown'
// function when an Item is clicked.
// The only alternative to this would be passed a Prop from the Parent that changes when an Item is clicked, and then having a Watcher in this Component
// call the 'closeDropdown' function whenever the value of that Prop changes, but the code for that is pretty messy.
defineExpose({
  dropdown,
  closeDropdown,
});

// An Object containing the arguments that are passed to the 'v-click-outside' Directive, containing the 'closeDropdown' function that will be called if a clicked Element
// isn't within the Element bound to the Directive, as well as an Array of Elements called 'additionalElements' that will also not close the Dropdown if clicked inside of.
// The value of 'additionalElements' should be an Array with the value of the 'dropdown' Template Ref as well as any other Elements passed by the 'clickOutsideElements' prop, but
// here the value is initialized as 'null'. This is because the values of the 'dropdown' Template Ref and any Template Refs in the 'clickOutsideElements' prop will be 'null'
// until this Component is Mounted, so we populate the value of 'additionalElements' in the 'onMounted' Hook.
const clickOutsideDirectiveArgs = ref({
  func: closeDropdown,
  additionalElements: null,
});

// Injects an Reactive Object where the Keys are directions and the Values are numbers, which are used to apply directional Padding to the 'flip()' Method for this Dropdown.
// This Flip Padding is typically applied to Dropdowns that are apart of a Page/Component that has a Footer, where the Dropdown should flip when it reaches
// the top of the Footer instead of the bottom of the Viewport.
const flipPadding: Ref<FlipPadding> = inject(
  "flipPadding",
  ref({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  })
);

// Calculates the position of the Dropdown relative to the Dropdown's anchored element
const calculatePosition = async () => {
  // Only run the function if the 'anchor' and 'dropdown' Template Refs are mounted
  if (anchor.value && dropdown.value) {
    // Learn more about this function here - https://floating-ui.com/docs/tutorial#positioning
    const { x, y, placement } = await computePosition(anchor.value, dropdown.value, {
      placement: props.dropdownDirection,
      middleware: [
        offset(8),
        shift(),
        flip({
          padding: {
            top: flipPadding.value.top ?? 0,
            right: flipPadding.value.right ?? 0,
            bottom: flipPadding.value.bottom ?? 0,
            left: flipPadding.value.left ?? 0,
          },
        }),
        size({
          apply({ availableWidth, availableHeight, elements }) {
            Object.assign(elements.floating.style, {
              maxWidth: `${availableWidth}px`,
              maxHeight: props.height === "none" ? `${availableHeight}px` : "",
            });
          },
          padding: {
            top: flipPadding.value.top ?? 0,
            right: flipPadding.value.right ?? 0,
            bottom: flipPadding.value.bottom ?? 0,
            left: flipPadding.value.left ?? 0,
          },
        }),
      ],
    });
    // console.log("Dropdown Running");

    // Uses the 'x' and 'y' coordinates of the 'element' Template Ref and assigns them to the 'left' and 'top' style properties for the Dropdown
    // This positions the Dropdown relative to the anchored element, even though the Dropdown has a positon of 'absolute'
    // This also sets the min-width of the Dropdown to be the same width as the anchored element. We assign the width here because otherwise the Dropdown's width will be relative to the window
    Object.assign(dropdown.value.style, {
      left: `${x}px`,
      top: `${y}px`,
      minWidth: `${anchor.value.scrollWidth}px`,
    });

    // Uses the 'placement' value for the direction of the Dropdown (Using 'split()' to get the base direction of 'placement' because the placement can also have '-start' or '-end' attached to it which we don't want here)
    // We create an object of directions which flips the value of whatever the 'placement' value is
    // This is used to set the direction of the 'transform-origin' property for the Dropdown's open/close Vue Transition
    // (For example, if the Dropdown's placement is 'top', the 'transform-origin' property for the Dropdown's transition will be set to 'bottom')
    const dropdownOrigin = {
      left: "right",
      right: "left",
      bottom: "top",
      top: "bottom",
    }[placement.split("-")[0]];

    // Sets the direction used for the 'transform-origin' property for the open/close Vue Transition to be the opposite of whatever the base direction of 'placement' is
    dropdown.value.style.transformOrigin = dropdownOrigin;
  }
};

onMounted(() => {
  // For some reason the values of the 'dropdown' Template Ref or any Template Refs in the 'clickOutsideElements' prop will still be 'null' unless accessed inside of 'nextTick'
  nextTick(() => {
    // Populates the value of 'additionalElements' in the 'clickOutsideDirectiveArgs' Object to be an Array with either just the value of the 'dropdown' Template Ref if no additional
    // Template Refs have been passed via the 'clickOutsideElements' prop, or the value of the 'dropdown' Template Ref and the additional Template Refs if the prop does have a value.
    clickOutsideDirectiveArgs.value.additionalElements = props.clickOutsideElements
      ? props.clickOutsideElements.concat([dropdown.value])
      : [dropdown.value];
  });
});
</script>

<style>
.dropdown-enter-active,
.dropdown-leave-active {
  transition: transform 0.15s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  transform: scaleY(0);
}
</style>
