import prisma from "~~/server/database/client";

export default defineEventHandler(async (event) => {
  try {
    // const{ customerId } = await readBody(event);
    const { customerId } = (await getQuery(event)) as { customerId: string };
    if (!customerId) {
      //it's a customer Id
      throw createError({ statusCode: 500, message: "Bad ID" });
    }
    const customer = await prisma.customer.findUnique({
      where: {
        id: customerId,
      },
    });
    //lawn info
    const lawnData = await prisma.customerLawn.findUnique({
      where: {
        customerId: customerId,
      },
    });
    //interior info
    const interiorData = await prisma.customerInterior.findUnique({
      where: {
        customerId: customerId,
      },
    });
    //morgage info
    const morgageData = await prisma.customerMorgage.findUnique({
      where: {
        customerId: customerId,
      },
    });
    //insurance info
    const insuranceData = await prisma.customerInsurance.findUnique({
      where: {
        customerId: customerId,
      },
    });
    //internet info
    const internetData = await prisma.customerInternet.findUnique({
      where: {
        customerId: customerId,
      },
    });
    //cell info
    const cellData = await prisma.customerCell.findUnique({
      where: {
        customerId: customerId,
      },
    });
    const returnData = {
      //bundles up all the data to return
      customer: customer,
      services: {
        lawn: lawnData,
        interior: interiorData,
        morgage: morgageData,
        insurance: insuranceData,
        internet: internetData,
        cell: cellData,
      },
    };
    return returnData;
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request" });
    } else {
      // Generic error response
      console.log(error);
      throw createError({ statusCode: 500, message: "Internal Server Error" });
    }
  }
});
