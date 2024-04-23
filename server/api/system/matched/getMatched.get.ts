import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
  try {
    //Get the current Logged in user
    const user = await getLoggedInUser(event);
    //check that user is valid
    if (!user) {
      throw new Error("User not authenticated");
    }
    //Get user id
    if (user?.userType === "customer") {
      //Fetch matches (customer)
      const customerId = user.id;
      const customer = await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
        select: {
          matchPreference: true,
        },
      });
      const custMatched = await prisma.matched.findMany({
        where: {
          customerId: customerId,
          //notified: false, //customer hasn't been nofitied
          matchScore: {
            gte: customer.matchPreference,
          },
        },
        include: {
          business: {
            select: {
              id: true,
              businessName: true,
            },
          },
        },
      });
      return custMatched;
    }
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request" });
    } else {
      // Generic error response
      throw createError({ statusCode: 500, message: "Internal Server Error" });
    }
  }
});
