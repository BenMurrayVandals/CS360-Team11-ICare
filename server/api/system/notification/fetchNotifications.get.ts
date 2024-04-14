import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
    try {
        //Get the current Logged in user
        const user = await getLoggedInUser(event);
        //check that user is valid
        if (!user) {
          throw new Error('User not authenticated');
        }
        //Get user id
        if(user?.userType != "customer") //Fetch Notificiations for business
        {
          const businessId = user.id; 
          const busiNotification = await prisma.notification.findMany({
            where: {
              businessId: businessId,
              customerAccept: true,
              businessAccept:null, //business hasn't made a decision
            },
          });
          return busiNotification;
        }
        else{ //Fetch notifications for customer
          const customerId = user.id; 
          const custNotification = await prisma.notification.findMany({
            where: {
              customerId: customerId,
              customerAccept:null, //customer hasn't made decision
            },
          });
          return custNotification;
        }
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
