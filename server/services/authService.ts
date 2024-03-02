import prisma from "~~/server/database/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { H3Event } from "h3";

// Excrypts the passed Password using Bcrypt
export const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// Compares the passed 'canidatePassword' with the passed encrypted 'userPassword' using Bcrypt and returns if they're equal or not
export const isPasswordsEqual = async (candidatePassword: string, userPassword: string): Promise<boolean> => {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Uses the passed Event to accesses and return the Logged In User's JWT Auth Token that is stored in the 'auth_token' Cookie.
export const getAuthToken = (event: H3Event) => {
  // Gets the JWT Auth Token stored in the 'auth_token' Cookie
  const authToken = getCookie(event, "auth_token");

  // Return the Auth Token if it exists.
  return authToken ?? null;
};

// Uses the passed Event to accesses and return the Logged In User's JWT Auth Token that is stored in the 'auth_token' Cookie.
export const getUserType = (event: H3Event) => {
  // Gets the JWT Auth Token stored in the 'auth_token' Cookie
  const userType = getCookie(event, "user_type") as UserType;

  // Return the Auth Token if it exists.
  return userType ?? null;
};

// Returns the User in the DB with a matching ID equal to the passed encryted JWT Auth Token after it is decrypted.
export const getUserByAuthToken = async (authToken: string): Promise<IUser | undefined> => {
  if (!authToken) return;

  // Uses the Runtime Config to gain access to Environment Variables in the '.env' file
  const config = useRuntimeConfig();

  // Decrypts the JWT Auth Token by verifying the signed Auth Token against the 'JWT_SECRET' Environment Variable.
  // From the decrypted result, destructure the 'id' key/value pair which is the decoded User ID.
  const { id }: { id: string } = jwt.verify(authToken, config.JWT_SECRET) as { id: string };

  const userID = id?.split("/")[0];
  const userType = id?.split("/")[1] as UserType;

  if (!userID || !userType || (userType !== "customer" && userType !== "business")) return;

  let user: IUser;
  if (userType === "customer") {
    user = (await prisma.customer.findUnique({
      where: {
        id: userID,
      },
    })) as ICustomer;
  } else if (userType === "business") {
    user = (await prisma.business.findUnique({
      where: {
        id: userID,
      },
    })) as IBusiness;
  }

  // Find the User in the DB by the decrypted User ID
  return user;
};

// Returns the currently Logged In User by accessing the Logged In User's encrypted JWT Auth Token that is stored in the 'auth_token' Cookie, which we access
// off of the passed Event.
// We then take that Auth Token, decrypt it, and find the User is the DB with an ID equal to the decrypted Auth Token.
export const getLoggedInUser = async (event: H3Event): Promise<IUser | undefined> => {
  // Accesses the Logged In User's JWT Auth Token.
  const authToken = getAuthToken(event);

  // Finds the User is the DB whose ID matches the decrypted Auth Token and returns them
  return await getUserByAuthToken(authToken);
};
