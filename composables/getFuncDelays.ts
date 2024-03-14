export const getFuncDelays = () => {
  // BOTH OF THESE FUNCTIONS ARE VERY COMPLICATED AND SHOULD JUST BE TREATED AS MAGIC CODE
  // They are both higher order functions that accepts a function as an arguement and returns a function

  // This Debounce function executes the 'func' function argument when no changes have been detected for an amount of time equal to the 'wait' argument
  // For more information on how this works, go here - https://levelup.gitconnected.com/debounce-in-javascript-improve-your-applications-performance-5b01855e086
  const debounce = (func: any, wait: number) => {
    let timeout: any;

    // This returned function is the same as the function that is passed into the 'debounce' function
    return function executedFunction(...args: any[]) {
      // This function is called after the end of the debounce timer, so when 'setTimeout' expires
      const later = () => {
        // Clears the timeout
        clearTimeout(timeout);
        // This allows the passed function to execute once the debounce timer has ended
        func(...args);
      };

      clearTimeout(timeout);

      // The 'setTimeout' function executes the 'later' function after waiting for the amount of time specified by 'wait'
      timeout = setTimeout(later, wait);
    };
  };

  // This Throttle function executes the 'func' function argument on an repeated interval equal to the 'wait' arguemnt for as long as changes are occuring
  // For more information on how this works, go here - https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf
  const throttle = (func: any, wait: number) => {
    let lastFunc: any;
    let lastRan: number;
    return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
        func.apply(context, args);
        lastRan = Date.now();
      } else {
        clearTimeout(lastFunc);
        lastFunc = setTimeout(function () {
          if (Date.now() - lastRan >= wait) {
            func.apply(context, args);
            lastRan = Date.now();
          }
        }, wait - (Date.now() - lastRan));
      }
    };
  };

  return { debounce, throttle };
};
