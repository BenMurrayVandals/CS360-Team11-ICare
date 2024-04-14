import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const{ businessId } = await readBody(event);
        if(!businessId) //it's a business Id
        {
          throw createError({ statusCode: 500, message: 'Bad ID' });
        }
        const business = await prisma.business.findUnique({
          where: {
              id: businessId,
          },
        });
        //lawn info
        const lawnData = await prisma.businessLawn.findMany({
          where:{
            businessId: businessId,
          },
        });
        //interior info
        const interiorData = await prisma.businessInterior.findMany({
          where:{
            businessId: businessId,
          },
        });
        //morgage info
        const morgageData = await prisma.businessMorgage.findMany({
          where:{
            businessId: businessId,
          },
        });
        //insurance info
        const insuranceData = await prisma.businessInsurance.findMany({
          where:{
            businessId: businessId,
          },
        });
        //internet info
        const internetData = await prisma.businessInternet.findMany({
          where:{
            businessId: businessId,
          },
        });
        //cell info
        const cellData = await prisma.businessCell.findMany({
          where:{
            businessId: businessId,
          },
        });
        const returnData = { //bundles up all the data to return
          business: business,
          lawn: lawnData,
          interior: interiorData,
          morgage: morgageData,
          insurance: insuranceData,
          internet: internetData,
          cell: cellData
        }
        return returnData;
  } catch (error) {
      if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request' });
      } else {
          // Generic error response
          throw createError({ statusCode: 500, message: 'Internal Server Error' });
      }
  }
  });
