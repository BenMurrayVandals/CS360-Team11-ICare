import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        // Parse the request body
        const { businessId, costPerSqFoot } = await readBody(event);
    
        // Use Prisma to insert a new record into businessLawn table
        const newLawnService = await prisma.businessLawn.create({
          data: {
            businessId,
            costPerSqFoot,
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
