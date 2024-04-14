import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";
import v from "validator";

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
        const business = await prisma.business.findUnique({
          where: {
              id: businessId,
          },
        });
        if (!business) {
            throw new Error('business not found');
        }
        const {businessName, email, phoneNumber} = await readBody(event);
        const updatedName = businessName || business.businessName;
        const updatedEmail = email || business.email;
        const updatedPhone = phoneNumber || business.phoneNumber;
        const normEmail = v.normalizeEmail(updatedEmail);
        const updatedData = {
          businessName: updatedName,
          email: updatedEmail,
          emailNormalized: normEmail || updatedEmail,
          phoneNumber: updatedPhone,
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
