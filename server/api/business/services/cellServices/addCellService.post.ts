import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { businessAddsServiceMatchScoreCalculation } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Get the current Logged in user
    const user = await getLoggedInUser(event);
    //Make sure user is a business
    if (user?.userType != "business") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (business Cell)" });
    }
    //Get user id
    const businessId = user.id;
    //Set service type to Cell
    const serviceType = "Cell";
    //Fetch Relevant Data from event
    const { GBPerMonth, costPerMonth } = await readBody(event);
    //Make sure we have all important data
    if (!GBPerMonth || !costPerMonth) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }
    // Use Prisma to insert a new record into businessCell table
    const newCellService = await prisma.businessCell.create({
      data: {
        businessId,
        serviceType,
        GBPerMonth,
        costPerMonth,
      },
    });
    await businessAddsServiceMatchScoreCalculation(newCellService.id, newCellService.serviceType);
    return newCellService;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      // Generic error response
      throw createError({ statusCode: 500, message: "Internal Server Error" });
    }
  }
});
