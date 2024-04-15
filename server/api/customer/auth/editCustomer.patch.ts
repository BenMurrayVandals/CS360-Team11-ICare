import prisma from '~~/server/database/client';
import { getLoggedInUser } from "~~/server/services/authService";
import v from "validator";

export default defineEventHandler(async (event) => {
    try {
        //Get the current Logged in user
        const user = await getLoggedInUser(event);
        //Make sure user is a customer
        if(user?.userType != "customer")
        {
          throw createError({ statusCode: 401, message: 'Unauthorized: User of wrong type (should be Customer)' });
        }
        //Get user id
        const customerId = user.id; 
        //fetch exisiting customer
        const customer = await prisma.customer.findUnique({
          where: {
              id: customerId,
          },
        });
        if (!customer) {
            throw new Error('Customer not found');
        }
        const {email, phoneNumber, address, matchPreference} = await readBody(event);
        const updatedEmail = email || customer.email;
        const updatedPhone = phoneNumber || customer.phoneNumber;
        // const updatedAddress = address || customer.address;
        const updatedMatchP = matchPreference || customer.matchPreference;
        const normEmail = v.normalizeEmail(updatedEmail);
        const updatedData = {
          email: updatedEmail,
          emailNormalized: normEmail || updatedEmail,
          // address: updatedAddress,
          phoneNumber: updatedPhone,
          matchPreference: updatedMatchP,
        };
        // Remove undefined properties
        Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);
        //Update information
        const updatedCustomer = await prisma.customer.update({
            where: { id: customerId }, // Specify the record by its unique id
            data: updatedData, //data updated
        });
        return updatedCustomer;
      } catch (error) {
        if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
      } else {
          console.log(error);
          throw createError({ statusCode: 500, message: 'Error editting customer' });
      }
      }
  });
