import prisma from '~~/server/database/client';

export default defineEventHandler(async (event) => {
    try {
        const{ customerId } = await readBody(event);
        if(!customerId) //it's a customer Id
        {
          throw createError({ statusCode: 500, message: 'Bad ID' });
        }
        const customer = await prisma.customer.findUnique({
          where: {
              id: customerId,
          },
        });
        //lawn info
        const lawnData = await prisma.customerLawn.findMany({
          where:{
            customerId: customerId,
          },
        });
        //interior info
        const interiorData = await prisma.customerInterior.findMany({
          where:{
            customerId: customerId,
          },
        });
        //morgage info
        const morgageData = await prisma.customerMorgage.findMany({
          where:{
            customerId: customerId,
          },
        });
        //insurance info
        const insuranceData = await prisma.customerInsurance.findMany({
          where:{
            customerId: customerId,
          },
        });
        //internet info
        const internetData = await prisma.customerInternet.findMany({
          where:{
            customerId: customerId,
          },
        });
        //cell info
        const cellData = await prisma.customerCell.findMany({
          where:{
            customerId: customerId,
          },
        });
        const returnData = { //bundles up all the data to return
          customer: customer,
          lawn: lawnData,
          interior: interiorData,
          morgage: morgageData,
          insurance: insuranceData,
          internet: internetData,
          cell: cellData
        }
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
