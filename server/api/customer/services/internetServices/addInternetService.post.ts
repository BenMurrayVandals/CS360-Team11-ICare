import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { customerAddsServiceMatchScoreCalculation } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    //Get the current Logged in user
    const user = await getLoggedInUser(event);
    //Make sure user is a customer
    if (user?.userType != "customer") {
      throw createError({ statusCode: 401, message: "Unauthorized: User of wrong type (Customer Internet)" });
    }
    //Get user id
    const customerId = user.id;
    //Set service type to Internet
    const serviceType = "Internet";
    //Fetch Relevant Data from event
    const { speed, costPerMonth, allowLessSpeed } = await readBody(event);
    //Make sure we have all important data
    if (!speed || !costPerMonth || allowLessSpeed === null || allowLessSpeed === undefined) {
      throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
    }
    // Use Prisma to insert a new record into CustomerInternet table
    const newInternetService = await prisma.customerInternet.create({
      data: {
        customerId,
        serviceType,
        speed,
        costPerMonth,
        allowLessSpeed,
      },
    });

    await customerAddsServiceMatchScoreCalculation(newInternetService.id, newInternetService.serviceType);

    return newInternetService;
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
