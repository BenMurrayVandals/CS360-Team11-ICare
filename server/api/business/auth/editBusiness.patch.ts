import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";

export default defineEventHandler(async (event) => {
    try {
        //Get the current Logged in user
        const user = await getLoggedInUser(event);
        //Make sure user is a business
        if(user?.userType != "business")
        {
          throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (should be business)' });
        }
        //Get user id
        const businessId = user.id; 
        //fetch exisiting business
        const existingBusiness = await prisma.business.findUnique({
          where: {
              id: businessId,
          },
        });
        if (!existingBusiness) {
            throw new Error('business not found');
        }
        const {businessName, email, phoneNumber} = await readBody(event);

        const updatedData = {
          ...existingBusiness,
          ...event,
          businessName,
          email,
          phoneNumber,
        };
        
        // Remove undefined properties
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
        //Update information
        const updatedBusiness = await prisma.business.update({
            where: { id: businessId }, // Specify the record by its unique id
            data: updatedData, //data updated
        });
        return updatedBusiness;
      } catch (error) {
        if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
      } else {
          throw createError({ statusCode: 500, message: 'Error editting morgage service' });
      }
      }
  });
