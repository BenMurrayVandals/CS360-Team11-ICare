import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { businessId, GBPerMonth, costPerMonth } = await readBody(event);
    
        // Use Prisma to insert a new record into businessLawn table
        const newCellService = await prisma.businessCell.create({
          data: {
            businessId,
            GBPerMonth,
            costPerMonth
          },
        });
        return {
          statusCode: 200,
          body: JSON.stringify(newCellService),
      };
  } catch (error) {
      throw createError({ statusCode: 500, message: 'Error adding Cell service' });
  }
  });
