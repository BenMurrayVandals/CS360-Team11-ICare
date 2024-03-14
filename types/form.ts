// This is needed (And the 'export' statement below) in order to import things like other external types
declare global {
  /* FORM ALERTS */
  type FormErrors = Record<string, Alert[]>;
  type FormWarnings = Record<string, Alert[]>;

  type FormAlerts = FormErrors | FormWarnings;

  /* FORM INPUTS */
  // #region
  interface Form {
    type: string;
    id: string;
    title: string;
    required: boolean;
    errors: Alert[];
    warnings: Alert[];
    notes?: Alert[];
  }

  interface FormOption {
    text: string;
    id: string;
  }

  interface TextInput extends Form {
    input: string;
    placeholder: string;
    minLength?: number;
    maxLength?: number;
  }

  interface Counter extends Form {
    selected: number;
    min: number;
    max: number;
    text: {
      left: string;
      right: string;
    };
  }

  interface Select extends Form {
    selected: string;
    placeholder: string;
    options: FormOption[];
  }

  interface ToggleInput extends Form {
    selected: boolean;
  }

  type PasswordAutocomplete = "new" | "current";

  type FormInput = TextInput | Counter | Select | ToggleInput;
  // #endregion

  /* PAGE QUESTIONS */
  // Login Questions
  interface LoginQuestions {
    email: TextInput;
    password: TextInput;
  }

  interface SignupQuestions extends LoginQuestions {
    username: TextInput;
    firstName: TextInput;
    lastName: TextInput;
    businessName: TextInput;
  }
}

export {};
