import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { deleteMatchScoreBuisness } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Fetch current user
    const user = await getLoggedInUser(event);

    //If no one's logged in, or user isn't a business
    if (!user || user?.userType != "business") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (business Lawn)" });
    }

    //Get user id
    const businessId = user.id;

    // Parse the id from event
    const { id } = await readBody(event);

    // Validate request body fields
    if (!id) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }

    //fetches Lawn service based off ID
    const existingLawnService = await prisma.businessLawn.findUnique({
      where: {
        id: id,
      },
    });

    // Check if the Lawn service with the provided ID exists
    if (!existingLawnService) {
      throw createError({ statusCode: 404, message: "Lawn service not found" });
    }

    // Check if the businessId matches the businessId associated with the Lawn service
    if (existingLawnService.businessId !== businessId) {
      throw createError({ statusCode: 403, message: "Forbidden: Incorrect businessId" });
    }

    // Delete the Lawn service based on ID and business ID
    const deletedLawnService = await prisma.businessLawn.delete({
      where: {
        id: id,
      },
    });
    await deleteMatchScoreBuisness(deletedLawnService.id);
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
