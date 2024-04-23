import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { deleteMatchScoreCustomer } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Fetch current user
    const user = await getLoggedInUser(event);
    
    //If no one's logged in, or user isn't a customer
    if (!user || user?.userType != "customer") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (Customer Internet)" });
    }

    //Get user id
    const customerId = user.id;

    // Parse the id from event
    const { id } = await readBody(event);
    
    // Validate request body fields
    if (!id) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }

    //fetches Internet service based off ID
    const existingInternetService = await prisma.customerInternet.findUnique({
      where: {
        id: id,
      },
    });

    // Check if the Internet service with the provided ID exists
    if (!existingInternetService) {
      throw createError({ statusCode: 404, message: "Internet service not found" });
    }

    // Check if the customerId matches the customerId associated with the Internet service
    if (existingInternetService.customerId !== customerId) {
      throw createError({ statusCode: 403, message: "Forbidden: Incorrect customerId" });
    }

    // Delete the Internet service based on ID and customer ID
    const deletedInternetService = await prisma.customerInternet.delete({
      where: {
        id: id,
      },
    });
    await deleteMatchScoreCustomer(deletedInternetService.id);
    return deletedInternetService;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      throw createError({ statusCode: 500, message: "Error deleting Internet service" });
    }
  }
});
