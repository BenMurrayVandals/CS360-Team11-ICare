import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { businessId, costPerSqFoot, insuranceRate } = await readBody(event);
    
        // Use Prisma to insert a new record into businessLawn table
        const newMorgageService = await prisma.businessMorgage.create({
          data: {
            businessId,
            costPerSqFoot,
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
