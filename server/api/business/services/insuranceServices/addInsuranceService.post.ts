import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { businessId, costPerSqFoot, totalCoverage } = await readBody(event);
    
        // Use Prisma to insert a new record into businessInsurance table
        const newInsuranceService = await prisma.businessInsurance.create({
          data: {
            businessId,
            costPerSqFoot,
            totalCoverage,
          },
        });
        return {
          statusCode: 200,
          body: JSON.stringify(newInsuranceService),
      };
  } catch (error) {
      throw createError({ statusCode: 500, message: 'Error adding Insurance service' });
  }
  });
