export const useForm = () => {
  const changeSelected = ({ answer, selected }) => {
    answer.selected = selected;
    // console.log(answer.selected);
  };

  const updateInput = ({ answer, input }) => {
    answer.input = input;
    // console.log(answer.input);
  };

  /* PHONE NUMBER */
  // Converts a phone number in the input selection format into a string.
  const phoneNumberSelectedToStr = ({ areaCode, prefix, lineNumber }: PhoneNumberSelected) =>
    areaCode || prefix || lineNumber ? `(${areaCode})-${prefix}-${lineNumber}` : "";

  // Converts a phone number in string format into phone number input selection format.
  const phoneNumberStrToSelected = (phoneNum: string): PhoneNumberSelected => ({
    areaCode: +phoneNum?.slice(1, 4),
    prefix: +phoneNum?.slice(6, 9),
    lineNumber: +phoneNum?.slice(10, phoneNum?.length),
  });

  /* MATCH PREFERENCE */
  const matchPreferenceStrToNum = (matchPreference: MatchPreference) => {
    switch (matchPreference) {
      case "Any":
        return 25;
      case "Good":
        return 50;
      case "Best":
        return 75;
      default:
        return 0;
    }
  };

  const matchPreferenceNumToStr = (matchPreference: number): MatchPreference => {
    switch (matchPreference) {
      case 25:
        return "Any";
      case 50:
        return "Good";
      case 75:
        return "Best";
      default:
        return "None";
    }
  };

  /* ALERTS */
  // Adds the passed 'alert' to the passed 'key' in the passed 'alerts' Generic Object, and then returns the new Generic Alerts Object.
  const addFormAlert = <T extends Object>(alerts: T, key: string, alert: Alert): T => {
    // Creates a shallow copy of the passed 'alerts' Object.
    const alertsCopy = { ...alerts };

    // Pushes the passed 'alert' to the Array of alerts for the passed 'key' in the copy of the alerts Object.
    // If the passed 'key' already exists in the alerts Object, then we push the alert to that key's value. But if the key
    // doesn't exist in the alerts Object, we first add the key to the Object and then initialize its value to be an empty
    // Array before pushing to alert to the Array.
    (alertsCopy[key] ? alertsCopy[key] : (alertsCopy[key] = [])).push(alert);

    // Returns the copy of the passed 'alerts' Object with the passed 'alert' added to it.
    return alertsCopy;
  };

  // Returns the total number of individual Form Alerts in the passed 'alerts' Object.
  const getNumFormAlerts = (alerts: FormErrors | FormWarnings) =>
    Object.values(alerts).reduce((acc, cur) => acc + cur.length, 0);

  return {
    changeSelected,
    updateInput,
    phoneNumberSelectedToStr,
    phoneNumberStrToSelected,
    matchPreferenceStrToNum,
    matchPreferenceNumToStr,
    addFormAlert,
    getNumFormAlerts,
  };
};
