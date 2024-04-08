import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
    try {
      //Fetch current user
      const user = await getLoggedInUser(event);

      //If no one's logged in, or user isn't a business
      if(!user || user?.userType != "business")
      {
        throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (business Cell)' });
      }

      //Get user id
      const businessId = user.id; 

      // Parse the id from event
      const { id } = await readBody(event);

      // Validate request body fields
      if (!id) {
        throw createError({ statusCode: 400, message: 'Bad Request: Missing required fields' });
      }

      //fetches Cell service based off ID
      const existingCellService = await prisma.businessCell.findUnique({
        where: {
            id: id,
        },
      });

      // Check if the Cell service with the provided ID exists
      if (!existingCellService) {
          throw createError({ statusCode: 404, message: 'Cell service not found' });
      }
      
      // Check if the businessId matches the businessId associated with the Cell service
      if (existingCellService.businessId !== businessId) {
          throw createError({ statusCode: 403, message: 'Forbidden: Incorrect businessId' });
      }
      
      // Delete the Cell service based on ID and business ID
      const deletedCellService = await prisma.businessCell.delete({
          where: {
              id: id,
          },
      });
      return deletedCellService;
    } catch (error) {
       if (error.code === 'P2002') {
            // Prisma constraint violation error
            throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
        } else {
            throw createError({ statusCode: 500, message: 'Error deleting Cell service' });
        }
    }
});
