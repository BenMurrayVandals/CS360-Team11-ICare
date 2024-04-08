import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
      // Parse the request body
      const { id } = await readBody(event);
      //Delete service based off ID
      const deletedMorgageService = await prisma.customerMorgage.delete({
        where: {
            id: id,
        },
      });
      return {
        statusCode: 200,
        body: JSON.stringify(deletedMorgageService),
    };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Error deleting morgage service' });
    }
});
