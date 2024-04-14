import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => { //pass in matchedId via event
    try {
        //Get the current Logged in user
        const user = await getLoggedInUser(event);
        //check that user is valid
        if (!user) {
          throw new Error('User not authenticated');
        }
        //get matchedId
        const {matchedId} = await readBody(event);
        //Get user id
        if(user?.userType != "customer") //Accept match for customer
        {
          throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (should be Customer)' });
        }
        const customerId = user.id; 
        const rejectMatch = await prisma.matched.update({
          where: {
            customerId: customerId,
            id: matchedId
          },
          data:{
            notified: true,
            acceptStatus: false,
          }
        });
        const rejectNotification = await prisma.notification.update({
          where: {
            customerId: customerId,
            matchedId: matchedId
          },
          data:{
            customerAccept: false,
          }
        });
        return rejectMatch;
  } catch (error) {
      if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request' });
      } else {
          // Generic error response
          throw createError({ statusCode: 500, message: 'Internal Server Error' });
      }
  }
  });
