import prisma from '~~/server/database/client'
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

export default defineEventHandler(async (event: H3Event): Promise<{ customer: ICustomer | null; errors: FormErrors | null } | undefined> => {
  const { addFormAlert } = useForm();
  const { isObjectEmpty } = useUtilities();

  // Reads the email and password from the Post request's Body
  const { email, password } = await readBody<LoginBody>(event);

  /* ERRORS */
  // Used to store any Form Errors that will be returned to the Client.
  let errors: FormErrors = {};

  // If the provided Email doesn't have a value - Client
  if (!email) errors = addFormAlert(errors, "email", { id: "required", code: 400, message: "Email is required", type: "error" });

  // If the provided Password doesn't have a value - Client
  if (!password) errors = addFormAlert(errors, "password", { id: "required", code: 400, message: "Password is required", type: "error" });

  // Before a matching Customer is queried for, if there are any Form Errors for either the Email or Password not being provided, don't bother
  // querying for a matching Customer and instead return those Errors without a Customer so that the Errors can be handled.
  if (!isObjectEmpty(errors)) return { customer: null, errors };

  // Find the Customer in the DB whose 'emailNormalized' field is equal to the provided email after being normalized.
  const customer: ICustomer = (await prisma.customer.findUnique({
    where: {
        emailNormalized: v.normalizeEmail(email) || email
    }
  }) as ICustomer)

  // If no Customer matching the provided normalized email is found, or if a matching Customer is found but the provided password isn't equal to the
  // matching Customer's password - Client
  if (!customer || !(await isPasswordsEqual(password, customer.password ?? ""))) {
    errors = addFormAlert(errors, "both", { id: "incorrectCredentials", code: 400, message: "Email or password is incorrect", type: "error" });
  }

  // Before the Customer is logged in, if there are any Form Errors for the provided Email or Password, return those Errors without a Customer so that
  // the Errors can be handled.
  if (!isObjectEmpty(errors)) return { customer: null, errors };

  // Creates a JWT Auth Token using the 'createSession' function that is stored as a Cookie
  const authToken = createSession(customer.id, "customer", event);

  // If the Auth Token wasn't successfully created
  if (!authToken) throw createError({ statusCode: 500, statusMessage: "Auth Token failed creation" });

  // Returns the logged in Customer that has been sanitized to have their 'password' field removed, and any Errors if they exist.
  return { customer, errors: !isObjectEmpty(errors) ? errors : null };
});