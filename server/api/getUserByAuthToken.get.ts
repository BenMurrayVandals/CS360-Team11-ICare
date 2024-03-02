import { getLoggedInUser, getUserType } from "~~/server/services/authService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event): Promise<IUser | undefined> => {
  // Returns the currently Logged In User
  const user = await getLoggedInUser(event);

  // If the returned User doesn't exist
  if (!user) throw createError({ statusCode: 404, statusMessage: "User not found" });

  // The type of the logged in user.
  // const userType = getUserType(event)

  // Return the User and their type.
  return user;
});