import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const { customerId, sqFootage, totalCoverage, costPerMonth, allowLessCoverage } = await readBody(event);
    
        // Use Prisma to insert a new record into CustomerLawn table
        const newInsuranceService = await prisma.customerInsurance.create({
          data: {
            customerId,
            sqFootage,
            totalCoverage,
            costPerMonth,
            allowLessCoverage
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
