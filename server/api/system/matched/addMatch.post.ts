import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        //Fetch Relevant Data from event
        const { businessId, customerId, serviceType, cserviceId, bserviceId, matchScore} = await readBody(event);
        //Make sure we have all important data
        if (!businessId || !customerId || !serviceType || !cserviceId || !bserviceId || !matchScore) {
          throw createError({ statusCode: 400, message: 'Bad Request: Missing required fields' });
        }
        // Use Prisma to insert a new record into CustomerCell table
        const newMatch = await prisma.matched.create({
          data: {
            businessId,
            customerId,
            serviceType,
            cserviceId,
            bserviceId,
            matchScore
          },
        });
        return newMatch;
  } catch (error) {
      if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
      } else {
          // Generic error response
          throw createError({ statusCode: 500, message: 'Internal Server Error' });
      }
  }
  });
