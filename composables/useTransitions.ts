export const useTransitions = () => {
  // Manually sets the absolute position of the element
  // This is typically applied to an element before it begins it's Leaving Transition where it would be given the position of 'absolute' to break out of the normal layout flow
  // Without this fix, when an element begin's its Leaving Transition and is given the position of 'absolute', it will jump to the top left corner of it's closest parent with a position of 'relative'
  const positionLeavingElement = (el: HTMLElement) => {
    const { width, height } = window.getComputedStyle(el);
    el.style.left = `${el.offsetLeft}px`;
    el.style.top = `${el.offsetTop}px`;
    el.style.width = width;
    el.style.height = height;
  };

  // An Object that tracks the Heights of the 'listings' Element in the 'setTransitionElementHeight' function before and after an Element in a Transition Group is added/removed, so that
  // the Heights can be accessed later across different Transition Hooks in the 'setTransitionElementHeight' function.
  // There may be a potentional downside with this approach of this being a single Object instead of a Class, in case there are any conflictions with this needing to be accessed at the
  // same time but with different 'listings' Elements.
  const listingsHeight = ref({
    before: null,
    after: null,
  });

  // Sets the Height of the passed 'listings' Element depending on the passed 'stage' value, which is supposed to correspond with one of the following
  // Transition Hooks ('beforeLeave/beforeEnter', 'leave/enter', 'afterLeave/afterEnter').
  // The purpose of this function is to set the Height of the 'listings' Element to be fixed before and after an Element in the 'listings' Element is added/removed
  // from a Transition Group. This fixed Height will allow for the 'listings' Element's Height to smoothly Transition from the old Height to the new Height using
  // CSS Transitions instead of abruptly jumping between them.
  // The reason that the Heights need to be fixed is because CSS cannot Transition between Heights of 'auto'. So the 'listings' Element's Height needs to be fixed
  // for the Height Transition to occur, and then after the Element is added/removed the Height can be set back to 'auto'.
  const setTransitionElementHeight = (stage: "before" | "during" | "after", listings: HTMLElement, offset = 0) => {
    // If the passed 'listings' element doesn't exist, return.
    if (!listings) return;

    // console.log("Running - ", stage);

    // If the Transition Hook stage is either 'beforeEnter' or 'beforeLeave'
    if (stage === "before") {
      // console.log(listings.clientHeight, listings.scrollHeight);

      // Stores the Height of the 'listings' Element before an Element is added/removed as the value of 'listingsHeights.before' so that the value can be
      // accessed in a later Transition Hook after the Height has changed.
      listingsHeight.value.before = listings.clientHeight;
    }
    // If the Transition Hook stage is either 'enter' or 'leave'
    else if (stage === "during") {
      // console.log(listings.clientHeight, listings.scrollHeight);

      // Stores the Height of the 'listings' Element after an Element is added/removed as the value of 'listingsHeights.after' so that the value can be
      // accessed in 'nextTick' after the Height has been manually changed.
      listingsHeight.value.after = listings.clientHeight;

      // Manually set the Height of the 'listings' Element to be the Height that it was before the Element was added/removed using the value of 'listingsHeights.before'.
      listings.style.height = `${listingsHeight.value.before}px`;

      // After the DOM updates
      nextTick(() => {
        // console.log(listingsHeight.value.before, listingsHeight.value.after);

        // Manually set the Height of the 'listings' Element to be the Height that it was after the Element was added/removed using the value of 'listingsHeights.after'.
        // This will trigger a CSS Height Transition on the 'listings' Element (If there is one) that will transition the height from its Height before the Element
        // was added/removed, to its Height after the Element is added/removed using the values of 'listingsHeights.before' and 'listingsHeights.after'.
        listings.style.height = `${listingsHeight.value.after + offset}px`;
      });
    }
    // If the Transition Hook stage is either 'afterEnter' or 'afterLeave'
    else if (stage === "after") {
      // Manually set the Height of the 'listings' Element back to 'auto' after the Element has been added/removed
      listings.style.height = "auto";

      // console.log(listings.clientHeight, listings.scrollHeight)

      // Resets the values of 'listingsHeight.before' and 'listingsHeight.after'
      listingsHeight.value.before = null;
      listingsHeight.value.after = null;
    }
  };

  return { positionLeavingElement, setTransitionElementHeight };
};
