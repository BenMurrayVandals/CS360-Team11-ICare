import prisma from '~~/server/database/client'
import { createSession } from "~~/server/services/sessionService";
import { isBusinessExists } from "~~/server/services/businessService";
import { encryptPassword } from "~~/server/services/authService";
import { useForm } from "~~/composables/useForm";
import { getFormInfo } from "~~/composables/getFormInfo";
import { useUtilities } from "~~/composables/useUtilities";
import { H3Event } from "h3";
import v from "validator";

interface SignupBody {
    businessName: string;
    email: string;
    password: string;
}

export default defineEventHandler(async (event: H3Event): Promise<{ business: IBusiness | null; errors: FormErrors | null } | undefined> => {
  const { addFormAlert } = useForm();
  const { questionsBoilerplate } = getFormInfo();
  const { isObjectEmpty } = useUtilities();

  // Reads the email, and password from the Post request's Body
  const { businessName, email, password } = await readBody<SignupBody>(event);

  /* ERRORS */
  // Used to store any Form Errors that will be returned to the Client.
  let errors: FormErrors = {};

   /* BUSINESS NAME ERROR HANDLING */
  // If the provided Business Name doesn't have a value - Client
  if (!businessName) {
    errors = addFormAlert(errors, "businessName", { id: "required", code: 400, message: "A Business Name is required", type: "error" });
  } else {
    // If the provided Business Name's length is less than the Business Name Boilerplate's 'minLength' value - Client
    if (businessName.length < questionsBoilerplate.businessName.minLength) {
      errors = addFormAlert(errors, "businessName", {
        id: "minLength",
        code: 400,
        message: `Business Name needs to be at least ${questionsBoilerplate.businessName.minLength} characters long`,
        type: "error",
      });
    }
    // If the Business Name's length is greater than the Business Name Boilerplate's 'maxLength' value - Client
    else if (businessName.length > questionsBoilerplate.businessName.maxLength) {
      errors = addFormAlert(errors, "businessName", {
        id: "maxLength",
        code: 400,
        message: `Business Name needs to be less than ${questionsBoilerplate.businessName.maxLength} characters long`,
        type: "error",
      });
    }
    // If a Business with the provided Business Name already exists in the DB - Client
    if (await isBusinessExists({ businessName: businessName })) {
      errors = addFormAlert(errors, "businessName", { id: "businessAlreadyExists", code: 400, message: "Business Name is already taken", type: "error" });
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

    // If a Business with the provided Email already exists in the DB - Client
    // We check if there exists a Business where the provided Email after being normalized is equal to the Businesss' 'normalizedEmail' field,
    // so that regardless of if the Business provided either the normalized or unnormailized email, it will match as already existing.
    // Example: If the email in the DB is 'test@googlemail.com', it will be normalized and stored in the 'emailNormalized' field as 'test@gmail.com'.
    // So if either of those emails are provided, after being normalized they would both match the 'emailNormalized' field.
    if (await isBusinessExists({ emailNormalized: v.normalizeEmail(email) })) {
      errors = addFormAlert(errors, "email", { id: "businessAlreadyExists", code: 400, message: "Email is already associated with another business", type: "error" });
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

  // Before the Business is created, if there are any Form Errors for the provided Business Name, Email, or Password, return those Errors without
  // a created Business so that the Errors can be handled.
  if (!isObjectEmpty(errors)) return { business: null, errors };

  // Encrypts the provided Password
  const encryptedPassword = await encryptPassword(password);

  let business: IBusiness;
  try {
    // Creates the new Business.
    business = await prisma.business.create({
        data: {
            businessName,
            email,
            emailNormalized: v.normalizeEmail(email) || email,
            password: encryptedPassword,
        }
    })
  } catch (error) {
    // Return the error(s) so that they can be handled.
    return { business: null, errors };
  }

  // Creates a JWT Auth Token that is stored as a Cookie.
  const authToken = createSession(business.id, "business", event);

  // If the Auth Token wasn't successfully created.
  if (!authToken) throw createError({ statusCode: 500, statusMessage: "Auth Token failed creation" });

  // Returns the created Business and any Errors if they exist.
  return { business, errors: !isObjectEmpty(errors) ? errors : null };
});