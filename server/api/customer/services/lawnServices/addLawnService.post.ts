import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        // Parse the request body
        const { customerId, lawnSize, costPerMonth } = await readBody(event);
    
        // Use Prisma to insert a new record into CustomerLawn table
        const newLawnService = await prisma.customerLawn.create({
          data: {
            customerId,
            lawnSize,
            costPerMonth,
          },
        });
        return {
            statusCode: 200,
            body: JSON.stringify(newLawnService),
        };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Error adding lawn service' });
    }
  });
