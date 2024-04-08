import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
    try {
        //Get the current Logged in user
        const user = await getLoggedInUser(event);
        //Make sure user is a customer
        if(user?.userType != "customer")
        {
          throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (Customer Insurance)' });
        }
        //Get user id
        const customerId = user.id; 
        //Set service type to Insurance
        const serviceType = "Insurance";
        //Fetch Relevant Data from event
        const { sqFootage, totalCoverage, costPerMonth, allowLessCoverage } = await readBody(event);
        //Make sure we have all important data
        if (!sqFootage || !totalCoverage || !costPerMonth || allowLessCoverage === null || allowLessCoverage === undefined) {
          throw createError({ statusCode: 400, message: 'Bad Request: Missing required fields' });
        }
        // Use Prisma to insert a new record into CustomerInsurance table
        const newInsuranceService = await prisma.customerInsurance.create({
          data: {
            customerId,
            serviceType,
            sqFootage,
            totalCoverage,
            costPerMonth,
            allowLessCoverage
          },
        });
        return newInsuranceService;
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
