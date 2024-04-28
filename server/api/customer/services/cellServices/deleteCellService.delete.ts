import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { deleteMatchScoreCustomer } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Fetch current user
    const user = await getLoggedInUser(event);

    //If no one's logged in, or user isn't a customer
    if (!user || user?.userType != "customer") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (Customer Cell)" });
    }

    //Get user id
    const customerId = user.id;

    // Parse the id from event
    const { id } = await readBody(event);

    // Validate request body fields
    if (!id) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }

    //fetches Cell service based off ID
    const existingCellService = await prisma.customerCell.findUnique({
      where: {
        id: id,
      },
    });

    // Check if the Cell service with the provided ID exists
    if (!existingCellService) {
      throw createError({ statusCode: 404, message: "Cell service not found" });
    }

    // Check if the customerId matches the customerId associated with the Cell service
    if (existingCellService.customerId !== customerId) {
      throw createError({ statusCode: 403, message: "Forbidden: Incorrect customerId" });
    }

    // Delete the Cell service based on ID and customer ID
    const deletedCellService = await prisma.customerCell.delete({
      where: {
        id: id,
      },
    });

    await deleteMatchScoreCustomer(deletedCellService.id);

    return deletedCellService;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      throw createError({ statusCode: 500, message: "Error deleting Cell service" });
    }
  }
});
