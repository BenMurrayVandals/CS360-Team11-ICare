import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { customerId, sqFootage, costPerMonth, insuranceRate } = await readBody(event);
    
        // Use Prisma to insert a new record into CustomerLawn table
        const newMorgageService = await prisma.customerMorgage.create({
          data: {
            customerId,
            sqFootage,
            costPerMonth,
            insuranceRate
          },
        });
        return {
          statusCode: 200,
          body: JSON.stringify(newMorgageService),
      };
  } catch (error) {
      throw createError({ statusCode: 500, message: 'Error adding Morgage service' });
  }
  });
