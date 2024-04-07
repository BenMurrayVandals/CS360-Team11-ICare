import { getLoggedInUser } from "~~/server/services/authService";
import { H3Event, deleteCookie } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  /* LOGGED IN USER */
  // Returns the currently Logged In User
  const loggedInUser = await getLoggedInUser(event);

  // If the Logged In User doesn't exist
  if (!loggedInUser) throw createError({ statusCode: 401, statusMessage: "Logged In User not found" });

  // Deletes the 'auth_token' Cookie so that that next time the User tries to accesses this Cookie to
  // remain logged in between page refreshes, the value will be 'undefined' so they will be logged out.
  deleteCookie(event, "auth_token");
  // deleteCookie(event, "user_type")

  return "Successfully logged out";
});