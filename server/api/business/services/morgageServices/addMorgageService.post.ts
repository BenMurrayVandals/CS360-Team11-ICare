import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { businessAddsServiceMatchScoreCalculation } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Get the current Logged in user
    const user = await getLoggedInUser(event);
    console.log(user);
    //Make sure user is a business
    if (user?.userType != "business") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (business Morgage)" });
    }
    //Get user id
    const businessId = user.id;
    //Set service type to Morgage
    const serviceType = "Morgage";
    //Fetch Relevant Data from event
    const { costPerSqFoot, insuranceRate } = await readBody(event);
    //Make sure we have all important data
    if (!costPerSqFoot || !insuranceRate) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }
    // Use Prisma to insert a new record into businessMorgage table
    const newMorgageService = await prisma.businessMorgage.create({
      data: {
        businessId,
        serviceType,
        costPerSqFoot,
        insuranceRate,
      },
    });
    await businessAddsServiceMatchScoreCalculation(newMorgageService.id, newMorgageService.serviceType);
    return newMorgageService;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      // Generic error response
      console.log(error);
      throw createError({ statusCode: 500, message: "Internal Server Error" });
    }
  }
});
