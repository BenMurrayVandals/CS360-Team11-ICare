import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { deleteMatchScoreBusiness } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Fetch current user
    const user = await getLoggedInUser(event);
    //If no one's logged in, or user isn't a business
    if (!user || user?.userType != "business") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (business Morgage)" });
    }

    //Get user id
    const businessId = user.id;
    console.log(0);
    // Parse the id from event
    const { id } = await readBody(event);

    // Validate request body fields
    if (!id) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }
    console.log(1);
    //fetches morgage service based off ID
    const existingMorgageService = await prisma.businessMorgage.findUnique({
      where: {
        id: id,
      },
    });
    console.log(2);
    // Check if the morgage service with the provided ID exists
    if (!existingMorgageService) {
      throw createError({ statusCode: 404, message: "Morgage service not found" });
    }
    console.log(3);
    // Check if the businessId matches the businessId associated with the morgage service
    if (existingMorgageService.businessId !== businessId) {
      throw createError({ statusCode: 403, message: "Forbidden: Incorrect businessId" });
    }
    console.log(4);
    // Delete the morgage service based on ID and business ID
    const deletedMorgageService = await prisma.businessMorgage.delete({
      where: {
        id: id,
      },
    });
    await deleteMatchScoreBusiness(deletedMorgageService.id);
    return deletedMorgageService;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      console.log(error);
      throw createError({ statusCode: 500, message: "Error deleting morgage service" });
    }
  }
});
