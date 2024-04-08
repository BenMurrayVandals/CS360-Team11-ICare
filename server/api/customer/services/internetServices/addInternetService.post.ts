import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { customerId, speed, costPerMonth, allowLessSpeed } = await readBody(event);
    
        // Use Prisma to insert a new record into CustomerLawn table
        const newInternetService = await prisma.customerInternet.create({
          data: {
            customerId,
            speed,
            costPerMonth,
            allowLessSpeed
          },
        });
        return {
          statusCode: 200,
          body: JSON.stringify(newInternetService),
      };
  } catch (error) {
      throw createError({ statusCode: 500, message: 'Error adding Internet service' });
  }
  });
