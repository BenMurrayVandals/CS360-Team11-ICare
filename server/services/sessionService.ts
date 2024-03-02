import { H3Event } from "h3";
import jwt from "jsonwebtoken";

// Creates a JWT Token to sign the passed ID
export const createSignToken = (id: string): string => {
  // Uses the Runtime Config to gain access to Environment Variables in the '.env' file
  const config = useRuntimeConfig();

  // Creates a JWT Token to sign the passed ID.
  // The Token is set to expire in the time set by the 'JWT_EXPIRES_IN' Environment Variable
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

// Creates a JWT Auth Token for the passed User ID and creates an Cookie for that Auth Token so that the logged in User can be persisted
// across page refreshes by accessing the User ID from the Auth Cookie.
export const createSession = (id: string, userType: UserType, event: H3Event): { authToken: string, userType: UserType } => {
  if(!id || !userType) return

  // Uses the Runtime Config to gain access to Environment Variables in the '.env' file
  const config = useRuntimeConfig();

  // Creates a JWT Auth Token using the passed User ID
  const authToken = createSignToken(`${id}/${userType}`);

  // Sets a 'auth_token' Cookie storing the signed JWT Auth Token.
  // The Cookie is set to 'httpOnly' meaning that it can only be accessed on the Server and will expire in an amount of time equal to
  // the 'JWT_COOKIE_MAX_AGE_DAYS' Environment Variable that is converted into seconds
  setCookie(event, "auth_token", authToken, { path: "/", httpOnly: true, maxAge: +config.JWT_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 });
  // setCookie(event, "user_type", userType, { path: "/", httpOnly: true, maxAge: +config.JWT_COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 });

  // Returns the JWT Auth Token
  return { authToken, userType };
};