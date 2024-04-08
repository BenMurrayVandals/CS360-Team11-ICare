import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
      // Parse the request body
      const { id } = await readBody(event);
      //Delete service based off ID
      const deletedInternetService = await prisma.customerInternet.delete({
        where: {
            id: id,
        },
      });
      return {
        statusCode: 200,
        body: JSON.stringify(deletedInternetService),
    };
    } catch (error) {
        throw createError({ statusCode: 500, message: 'Error deleting Internet service' });
    }
});
