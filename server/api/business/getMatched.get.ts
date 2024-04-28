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
    if (user?.userType === "business") {
      //Fetch matches (business)
      const businessId = user.id;
      const business = await prisma.business.findUnique({
        where: {
          id: businessId,
        }
      });
      const businessMatched = await prisma.matched.findMany({
        where: {
          businessId: businessId,
          notified: true,
          acceptStatus: true
        },
        include: {
          customer: {
            select: {
              id: true,
              username: true,
              email: true,
              phoneNumber: true
            },
          },
        },
      });
      return businessMatched;
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
