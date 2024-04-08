import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
    try {
      //Fetch current user
      const user = await getLoggedInUser(event);

      //If no one's logged in, or user isn't a customer
      if(!user || user?.userType != "customer")
      {
        throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (Customer Insurance)' });
      }

      //Get user id
      const customerId = user.id; 

      // Parse the id from event
      const { id } = await readBody(event);

      // Validate request body fields
      if (!id) {
        throw createError({ statusCode: 400, message: 'Bad Request: Missing required fields' });
      }

      //fetches Insurance service based off ID
      const existingInsuranceService = await prisma.customerInsurance.findUnique({
        where: {
            id: id,
        },
      });

      // Check if the Insurance service with the provided ID exists
      if (!existingInsuranceService) {
          throw createError({ statusCode: 404, message: 'Insurance service not found' });
      }
      
      // Check if the customerId matches the customerId associated with the Insurance service
      if (existingInsuranceService.customerId !== customerId) {
          throw createError({ statusCode: 403, message: 'Forbidden: Incorrect customerId' });
      }
      
      // Delete the Insurance service based on ID and customer ID
      const deletedInsuranceService = await prisma.customerInsurance.delete({
          where: {
              id: id,
          },
      });
      return deletedInsuranceService;
    } catch (error) {
       if (error.code === 'P2002') {
            // Prisma constraint violation error
            throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
        } else {
            throw createError({ statusCode: 500, message: 'Error deleting Insurance service' });
        }
    }
});
