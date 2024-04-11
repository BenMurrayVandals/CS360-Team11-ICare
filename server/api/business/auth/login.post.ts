import prisma from "~~/server/database/client";
import { createSession } from "~~/server/services/sessionService";
import { isPasswordsEqual } from "~~/server/services/authService";
import { useForm } from "~~/composables/useForm";
import { useUtilities } from "~~/composables/useUtilities";
import { H3Event } from "h3";
import v from "validator";

interface LoginBody {
  email: string;
  password: string;
}

export default defineEventHandler(
  async (event: H3Event): Promise<{ business: IBusiness | null; errors: FormErrors | null } | undefined> => {
    const { addFormAlert } = useForm();
    const { isObjectEmpty } = useUtilities();

    // Reads the email and password from the Post request's Body
    const { email, password } = await readBody<LoginBody>(event);

    /* ERRORS */
    // Used to store any Form Errors that will be returned to the Client.
    let errors: FormErrors = {};

    // If the provided Email doesn't have a value - Client
    if (!email)
      errors = addFormAlert(errors, "email", {
        id: "required",
        code: 400,
        message: "Email is required",
        type: "error",
      });

    // If the provided Password doesn't have a value - Client
    if (!password)
      errors = addFormAlert(errors, "password", {
        id: "required",
        code: 400,
        message: "Password is required",
        type: "error",
      });

    // Before a matching Business is queried for, if there are any Form Errors for either the Email or Password not being provided, don't bother
    // querying for a matching Business and instead return those Errors without a Business so that the Errors can be handled.
    if (!isObjectEmpty(errors)) return { business: null, errors };

    // Find the Business in the DB whose 'emailNormalized' field is equal to the provided email after being normalized.
    const business: IBusiness = (await prisma.business.findUnique({
      where: {
        emailNormalized: v.normalizeEmail(email) || email,
      },
    })) as IBusiness;

    // If no Business matching the provided normalized email is found, or if a matching Business is found but the provided password isn't equal to the
    // matching Business's password - Client
    if (!business || !(await isPasswordsEqual(password, business.password ?? ""))) {
      errors = addFormAlert(errors, "both", {
        id: "incorrectCredentials",
        code: 400,
        message: "Email or password is incorrect",
        type: "error",
      });
    }

    // Before the Business is logged in, if there are any Form Errors for the provided Email or Password, return those Errors without a Business so that
    // the Errors can be handled.
    if (!isObjectEmpty(errors)) return { business: null, errors };

    // Creates a JWT Auth Token using the 'createSession' function that is stored as a Cookie
    const authToken = createSession(business.id, "business", event);

    // If the Auth Token wasn't successfully created
    if (!authToken) throw createError({ statusCode: 500, statusMessage: "Auth Token failed creation" });

    // Returns the logged in Business that has been sanitized to have their 'password' field removed, and any Errors if they exist.
    return { business, errors: !isObjectEmpty(errors) ? errors : null };
  }
);
