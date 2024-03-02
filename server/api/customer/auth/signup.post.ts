import prisma from '~~/server/database/client'
import { createSession } from "~~/server/services/sessionService";
import { isCustomerExists } from "~/server/services/customerService";
import { encryptPassword } from "~~/server/services/authService";
import { useForm } from "~~/composables/useForm";
import { getFormInfo } from "~~/composables/getFormInfo";
import { useUtilities } from "~~/composables/useUtilities";
import { H3Event } from "h3";
import v from "validator";

interface SignupBody {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export default defineEventHandler(async (event: H3Event): Promise<{ customer: ICustomer | null; errors: FormErrors | null } | undefined> => {
  const { addFormAlert } = useForm();
  const { questionsBoilerplate } = getFormInfo();
  const { isObjectEmpty } = useUtilities();

  // Reads the username, first name, last name, email, and password from the Post request's Body
  const { username, firstName, lastName, email, password } = await readBody<SignupBody>(event);

  /* ERRORS */
  // Used to store any Form Errors that will be returned to the Client.
  let errors: FormErrors = {};

   /* USERNAME ERROR HANDLING */
  // If the provided Username doesn't have a value - Client
  if (!username) {
    errors = addFormAlert(errors, "username", { id: "required", code: 400, message: "A Username is required", type: "error" });
  } else {
    // If the provided Username's length is less than the Username Boilerplate's 'minLength' value - Client
    if (username.length < questionsBoilerplate.username.minLength) {
      errors = addFormAlert(errors, "username", {
        id: "minLength",
        code: 400,
        message: `Username needs to be at least ${questionsBoilerplate.username.minLength} characters long`,
        type: "error",
      });
    }
    // If the Username's length is greater than the Username Boilerplate's 'maxLength' value - Client
    else if (username.length > questionsBoilerplate.username.maxLength) {
      errors = addFormAlert(errors, "username", {
        id: "maxLength",
        code: 400,
        message: `Username needs to be less than ${questionsBoilerplate.username.maxLength} characters long`,
        type: "error",
      });
    }
    // If a Customer with the provided Username already exists in the DB - Client
    if (await isCustomerExists({ username: username })) {
      errors = addFormAlert(errors, "username", { id: "customerAlreadyExists", code: 400, message: "Username is already taken", type: "error" });
    }
  }

  /* EMAIL ERROR HANDLING */
  // If the provided Email doesn't have a value - Client
  if (!email) {
    errors = addFormAlert(errors, "email", { id: "required", code: 400, message: "An Email is required", type: "error" });
  } else {
    // If the provided Email isn't a valid Email
    if (!v.isEmail(email)) {
      errors = addFormAlert(errors, "email", { id: "invalid", code: 400, message: "Email is invalid", type: "error" });
    }

    // If the provided Email's length is less than the Email Boilerplate's 'minLength' value - Client
    if (email.length < questionsBoilerplate.email.minLength) {
      errors = addFormAlert(errors, "email", {
        id: "minLength",
        code: 400,
        message: `Email needs to be at least ${questionsBoilerplate.email.minLength} characters long`,
        type: "error",
      });
    }
    // If the Email's length is greater than the Email Boilerplate's 'maxLength' value - Client
    else if (email.length > questionsBoilerplate.email.maxLength) {
      errors = addFormAlert(errors, "email", {
        id: "maxLength",
        code: 400,
        message: `Email needs to be less than ${questionsBoilerplate.email.maxLength} characters long`,
        type: "error",
      });
    }

    // If a customer with the provided Email already exists in the DB - Client
    // We check if there exists a Customer where the provided Email after being normalized is equal to the Customers' 'normalizedEmail' field,
    // so that regardless of if the Customer provided either the normalized or unnormailized email, it will match as already existing.
    // Example: If the email in the DB is 'test@googlemail.com', it will be normalized and stored in the 'emailNormalized' field as 'test@gmail.com'.
    // So if either of those emails are provided, after being normalized they would both match the 'emailNormalized' field.
    if (await isCustomerExists({ emailNormalized: v.normalizeEmail(email) })) {
      errors = addFormAlert(errors, "email", { id: "customerAlreadyExists", code: 400, message: "Email is already taken by another user", type: "error" });
    }
  }

  /* PASSWORD ERROR HANDLING */
  // If the provided Password doesn't have a value - Client
  if (!password) {
    errors = addFormAlert(errors, "password", { id: "required", code: 400, message: "A Password is required", type: "error" });
  } else {
    // If the provided Password's length is less than the Password Boilerplate's 'minLength' value - Client
    if (password.length < questionsBoilerplate.password.minLength) {
      errors = addFormAlert(errors, "password", {
        id: "minLength",
        code: 400,
        message: `Password needs to be at least ${questionsBoilerplate.password.minLength} characters long`,
        type: "error",
      });
    }
    // If the Password's length is greater than the Password Boilerplate's 'maxLength' value - Client
    else if (password.length > questionsBoilerplate.password.maxLength) {
      errors = addFormAlert(errors, "password", {
        id: "maxLength",
        code: 400,
        message: `Password needs to be less than ${questionsBoilerplate.password.maxLength} characters long`,
        type: "error",
      });
    }

    // Regex expressions for the various Password character requirements.
    let lowercaseRegex = /[a-z]/;
    let uppercaseRegex = /[A-Z]/;
    let numberRegex = /[0-9]/;
    let symbolRegex = /[-#!$@£%^&*()_+|~=`{}\[\]:";'<>?,.\/ ]/;

    // Stores the type(s) of missing characters for the provided Password.
    const pwMissingCharTypes: ("lowercase" | "uppercase" | "number" | "symbol")[] = [];

    // If the provided Password doesn't contain a lowercase character.
    if (!lowercaseRegex.test(password)) pwMissingCharTypes.push("lowercase");
    // If the provided Password doesn't contain an uppercase character.
    if (!uppercaseRegex.test(password)) pwMissingCharTypes.push("uppercase");
    // If the provided Password doesn't contain a number.
    if (!numberRegex.test(password)) pwMissingCharTypes.push("number");
    // If the provided Password doesn't contain a symbol.
    if (!symbolRegex.test(password)) pwMissingCharTypes.push("symbol");

    // If there is at least one type of missing character(s) for the provided Password.
    if (pwMissingCharTypes.length > 0) {
      // The message that is used for the Password's missing characters Form Error.
      // This message uses an IIFE function that returns a string depending on what and how many missing character types are present.
      const missingCharErrorMessage = `Password must contain at least one ${(() => {
        // Tracks the returned message.
        let message = "";

        // For each missing character type.
        pwMissingCharTypes.forEach((type, i) => {
          // If the current character type isn't the first, append an 'a' or 'an' to the message.
          if (i > 0) message += `${type === "uppercase" ? "an " : "a "}`;

          // Depending on the current character type.
          switch (type) {
            // For either a missing lowercase or uppercase character.
            case "lowercase":
            case "uppercase":
              // Append to the message.
              message += `${type} character`;
              break;
            // For either a missing number or symbol.
            default:
              // Append to the message.
              message += type;
          }

          // After the missing character type has been appended to the message.
          // If the current type isn't the last one and there are more than two missing character types, append a comma to the message.
          if (i !== pwMissingCharTypes.length - 1 && pwMissingCharTypes.length > 2) message += ", ";
          // If the current type is the second to last one, append the word 'and' to the message with or without a preceeding space depending
          // on if there are more than two missing character types or not.
          if (i === pwMissingCharTypes.length - 2) message += pwMissingCharTypes.length > 2 ? "and " : " and ";
        });

        // Returns the message with the added missing character type(s) and their corresponding grammar added.
        return message;
      })()}`;

      errors = addFormAlert(errors, "password", { id: "missingChar", code: 400, message: missingCharErrorMessage, type: "error" });
    }
  }

  // Before the Customer is created, if there are any Form Errors for the provided Username, Email, or Password, return those Errors without
  // a created User so that the Errors can be handled.
  if (!isObjectEmpty(errors)) return { customer: null, errors };

  // Encrypts the provided Password
  const encryptedPassword = await encryptPassword(password);

  let customer: ICustomer;
  try {
    // Creates the new Customer.
    customer = await prisma.customer.create({
        data: {
            username,
            firstName,
            lastName,
            email,
            emailNormalized: v.normalizeEmail(email) || email,
            password: encryptedPassword,
        }
    })
  } catch (error) {
    // Return the error(s) so that they can be handled.
    return { customer: null, errors };
  }

  // Creates a JWT Auth Token that is stored as a Cookie.
  const authToken = createSession(customer.id, "customer", event);

  // If the Auth Token wasn't successfully created.
  if (!authToken) throw createError({ statusCode: 500, statusMessage: "Auth Token failed creation" });

  // Returns the created Customer and any Errors if they exist.
  return { customer, errors: !isObjectEmpty(errors) ? errors : null };
});