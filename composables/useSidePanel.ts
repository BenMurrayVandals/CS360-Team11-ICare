export const useSidePanel = () => {
    // Sets a fixed width of the first child of the passed Side Panel Element equal to the fixed width of the Side Panel based on it's passed Size, or to the width of the Window if it's smaller than the fixed width
    // This function is used to set the width of the Side Panel's content to be fixed before the Side Panel is opened or closed
    const setSidePanelWidthFixed = (sidePanel: any, size: Size) => {
      nextTick(() => {
        // Used to track the fixed width of the Side Panel
        let sidePanelWidth: number;
  
        // If the Side Panel is not vertically scrollable (Therefore wouldn't have a vertical Scrollbar)
        if (sidePanel.clientHeight >= sidePanel.children[0].scrollHeight) {
          // Sets the value of 'sidePanelWidth' to the value of the key in the Object that matches the 'size' value.
          // This is used to get the fixed width of the Side Panel depending on the size of the Side Panel, minus the border width (2px)
          // (For example, if the Side Panel's size is 'medium', the returned value will be 318 (320 - 2)).
          sidePanelWidth = {
            small: 256 - 2,
            medium: 320 - 2,
            large: 448 - 2,
          }[size];
        }
        // Otherwise the Side Panel is vertically scrollable (Therefore would have a vertical Scrollbar)
        else {
          // Sets the value of 'sidePanelWidth' to the value of the key in the Object that matches the 'size' value.
          // This is used to get the fixed width of the Side Panel depending on the size of the Side Panel, minus the
          // border width (2px) and the thin scrollbar width (12px).
          // (For example, if the Side Panel's size is 'medium', the returned value will be 306 (320 - 2 - 12)).
          sidePanelWidth = {
            small: 256 - 2 - 12,
            medium: 320 - 2 - 12,
            large: 448 - 2 - 12,
          }[size];
        }
  
        // The width of the Window
        let windowWidth = window.innerWidth;
  
        // Sets a fixed width of the first child of the Side Panel in pixels
        // The width is equal to the width of the Window if it's less than the fixed width size of the Side Panel, otherwise equal to the fixed width size of the Side Panel
        sidePanel.children[0].style.width = `${windowWidth < sidePanelWidth ? windowWidth - 2 : sidePanelWidth}px`;
      });
    };
  
    // Sets the width of the first child of the passed Side Panel Element to 100% of the Side Panel's width
    // This function is used to set the width of the Side Panel's content to be 100% after the Side Panel is opened
    const setSidePanelWidthFull = (sidePanel: any) => {
      sidePanel.children[0].style.width = "100%";
    };
  
    return { setSidePanelWidthFixed, setSidePanelWidthFull };
  };