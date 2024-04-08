import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { customerId, sqFootage, costPerMonth } = await readBody(event);
    
        // Use Prisma to insert a new record into CustomerLawn table
        const newInteriorService = await prisma.customerInterior.create({
          data: {
            customerId,
            sqFootage,
            costPerMonth
          },
        });
        return {
          statusCode: 200,
          body: JSON.stringify(newInteriorService),
      };
  } catch (error) {
      throw createError({ statusCode: 500, message: 'Error adding Interior service' });
  }
  });
