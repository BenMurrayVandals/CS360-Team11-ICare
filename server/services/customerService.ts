import prisma from '~~/server/database/client'

// Returns if a User that matches the passed 'query' exists in the DB or not.
// This only returns 'true' or 'false' and doesn't return the User itself.
export const isCustomerExists = async (query: any) => {
    // Returns an Object with only the ID of the User that matches the passed 'query'.
    const customer = await prisma.customer.findFirst({
        where: query
    })
  
    // If the User exists, return true, otherwise return false.
    return customer ? true : false;
  };