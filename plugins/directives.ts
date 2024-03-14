export default defineNuxtPlugin((nuxtApp) => {
  // Whenever the window is resized, execute the function passed as the value
  nuxtApp.vueApp.directive("resize", {
    mounted(el, binding) {
      // console.log("Mounting")

      // Adds event listener that executes the passed function as the window is resized
      window.addEventListener("resize", binding.value);
    },
    unmounted(el, binding) {
      // console.log("Unmounting")

      // Removes event listener when element is unmounted
      window.removeEventListener("resize", binding.value);
    },
  });

  // Whenever an Element outside of the Element this Directive is bound to or any Additional Elements (If passed) is clicked, execute the function passed as the value
  nuxtApp.vueApp.directive("click-outside", {
    mounted(el, binding) {
      // Checks if the clicked 'event' Element is outside of the Element bound to this Directive or any of the Elements inside of the passed 'additionalElements' Array, if it's provided as an arguement.
      // If true, have the 'clickOutsideEvent' function call the passed function.
      el.clickOutsideEvent = function (event) {
        // If any Additional Elements are passed to this Directive where the passed function shouldn't execute if any of the Additional Elements are clicked inside of.
        if (binding.value.additionalElements && binding.value.additionalElements.length > 0) {
          // If the clicked 'event' Element is outside of the Element bound to this Directive and all of the passed Additional Elements.
          if (
            !(
              el === event.target ||
              el.contains(event.target) ||
              binding.value.additionalElements.some((element: HTMLElement) => {
                return element === event.target || element.contains(event.target);
              })
            )
          ) {
            // Call the passed function
            binding.value.func(event, el);
          }
        }
        // If no Additional Elements are passed as an argument.
        else {
          // If the clicked 'event' Element is outside of the Element bound to this Directive
          if (!(el === event.target || el.contains(event.target))) {
            // Call the passed function
            binding.value.func(event, el);
          }
        }
      };

      // Adds an Event Listner that executes the 'clickOutsidEvent' function whenever an Element is clicked.
      // The 'clickOutsideEvent' function will call the passed function if the Element bound to the Directive (Or any Additional Elements if passed) isn't
      // the same Element as the clicked Element or doesn't have the clicked Element within it as a child Element.
      // The third argument is set to 'true' which indicates that the 'clickOutsideEvent' function should be called during the Event Capturing phase, instead
      // of the Event Bubbling phase. This allows for clicks that prevent their Event from Bubbling to the Document using Stop Propagation to still call the
      // 'clickOutsideEvent' function since it's called before the Bubbling phase.
      // Learn more here - https://www.kentor.dev/posts/detecting-clicks-outside-an-element-the-right-way/
      document.addEventListener("click", el.clickOutsideEvent, true);
    },
    unmounted(el) {
      // Removes the Event Listener when the Element bound to the Directive is Unmounted.
      document.removeEventListener("click", el.clickOutsideEvent, true);
    },
  });
});
