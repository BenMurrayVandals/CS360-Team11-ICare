import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { businessId, speed, costPerMonth } = await readBody(event);
    
        // Use Prisma to insert a new record into businessInternet table
        const newInternetService = await prisma.businessInternet.create({
          data: {
            businessId,
            speed,
            costPerMonth,
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
