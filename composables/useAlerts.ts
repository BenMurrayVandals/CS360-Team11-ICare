import { useUtilities } from "./useUtilities";

export const useAlerts = () => {
  const { generateID } = useUtilities();

  // Alert Class
  class Alert {
    id: string;
    code?: number;
    message: string;
    type: "error" | "warning" | "note";

    // All values are optional for a few reasons, 'id' because passing one should be unnecessary, 'code' because it doesn't pertain
    // to Warnings, and 'type' because this Class will mainly be used for Error Alerts, so passing a type of error would get tedious.
    // On top of that, in the case that an Error occurs with no 'error' object properties to pass to this Constructor, a fully default
    // Error Alert will be created.
    constructor({ id = generateID(), code = undefined, message = "Something went wrong", type = "error" }: Partial<Alert>) {
      this.code = code;
      this.message = message;
      this.type = type;
      this.id = id;
    }
  }

  return { Alert };
};