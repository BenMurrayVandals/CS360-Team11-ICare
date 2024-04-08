import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { businessId, costPerSqFoot } = await readBody(event);
    
        // Use Prisma to insert a new record into businessInterior table
        const newInteriorService = await prisma.businessInterior.create({
          data: {
            businessId,
            costPerSqFoot
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
