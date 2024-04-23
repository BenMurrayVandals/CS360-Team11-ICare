import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { deleteMatchScoreCustomer } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Fetch current user
    const user = await getLoggedInUser(event);

    //If no one's logged in, or user isn't a customer
    if (!user || user?.userType != "customer") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (Customer Lawn)" });
    }

    //Get user id
    const customerId = user.id;

    // Parse the id from event
    const { id } = await readBody(event);

    // Validate request body fields
    if (!id) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }

    //fetches Lawn service based off ID
    const existingLawnService = await prisma.customerLawn.findUnique({
      where: {
        id: id,
      },
    });

    // Check if the Lawn service with the provided ID exists
    if (!existingLawnService) {
      throw createError({ statusCode: 404, message: "Lawn service not found" });
    }

    // Check if the customerId matches the customerId associated with the Lawn service
    if (existingLawnService.customerId !== customerId) {
      throw createError({ statusCode: 403, message: "Forbidden: Incorrect customerId" });
    }

    // Delete the Lawn service based on ID and customer ID
    const deletedLawnService = await prisma.customerLawn.delete({
      where: {
        id: id,
      },
    });
    await deleteMatchScoreCustomer(deletedLawnService.id);
    return deletedLawnService;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      throw createError({ statusCode: 500, message: "Error deleting Lawn service" });
    }
  }
});
