import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { customerId, GBPerMonth, costPerMonth, allowLessGB } = await readBody(event);
    
        // Use Prisma to insert a new record into CustomerLawn table
        const newCellService = await prisma.customerCell.create({
          data: {
            customerId,
            GBPerMonth,
            costPerMonth,
            allowLessGB
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
