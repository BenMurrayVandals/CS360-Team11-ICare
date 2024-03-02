// This is needed (And the 'export' statement below) in order to import things like other external types
declare global {
  /* FORM ALERTS */
  type FormErrors = Record<string, Alert[]>;
  type FormWarnings = Record<string, Alert[]>;

  type FormAlerts = FormErrors | FormWarnings;

  /* FORM INPUTS */
  interface Form {
    type: string;
    title: string;
    required: boolean;
    errors: Alert[];
    warnings: Alert[];
    notes?: Alert[];
  }

  interface TextInput extends Form {
    id: string;
    input: string;
    placeholder: string;
    minLength?: number;
    maxLength?: number;
  }

  type PasswordAutocomplete = "new" | "current";

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
