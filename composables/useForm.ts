export const useForm = () => {
    const updateInput = ({ answer, input }) => {
        answer.input = input;
        // console.log(answer.input);
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
      const getNumFormAlerts = (alerts: FormErrors | FormWarnings) => Object.values(alerts).reduce((acc, cur) => acc + cur.length, 0);

      return {updateInput, addFormAlert, getNumFormAlerts}
}