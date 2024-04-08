import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
    try {
        //Get the current Logged in user
        const user = await getLoggedInUser(event);
        //Make sure user is a business
        if(user?.userType != "business")
        {
          throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (business Lawn)' });
        }
        //Get user id
        const businessId = user.id; 
        //Set service type to Lawn
        const serviceType = "Lawn";
        //Fetch Relevant Data from event
        const { costPerSqFoot } = await readBody(event);
        //Make sure we have all important data
        if (!costPerSqFoot) {
          throw createError({ statusCode: 400, message: 'Bad Request: Missing required fields' });
        }
        // Use Prisma to insert a new record into businessLawn table
        const newLawnService = await prisma.businessLawn.create({
          data: {
            businessId,
            serviceType,
            costPerSqFoot
          },
        });
        return newLawnService;
  } catch (error) {
      if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
      } else {
          // Generic error response
          throw createError({ statusCode: 500, message: 'Internal Server Error' });
      }
  }
  });
