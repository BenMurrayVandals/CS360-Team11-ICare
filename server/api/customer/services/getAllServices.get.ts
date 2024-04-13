import prisma from "~~/server/database/client";
import { getLoggedInUser } from "~~/server/services/authService";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event): Promise<Service[] | undefined> => {
  /* LOGGED IN USER */
  // Returns the currently Logged In User
  const loggedInUser = await getLoggedInUser(event);

  // If the returned User doesn't exist
  if (!loggedInUser) throw createError({ statusCode: 401, statusMessage: "Logged In User not found" });

  /* SERVICES */
  const lawnServices = await prisma.customerLawn.findMany({
    where: {
        customerId: loggedInUser.id
    },
  })

  const internetServices = await prisma.customerInternet.findMany({
    where: {
        customerId: loggedInUser.id
    },
  })

  const interiorServices = await prisma.customerInterior.findMany({
    where: {
        customerId: loggedInUser.id
    },
  })

  const insuranceServices = await prisma.customerInsurance.findMany({
    where: {
        customerId: loggedInUser.id
    },
  })

  const cellServices = await prisma.customerCell.findMany({
    where: {
        customerId: loggedInUser.id
    },
  })

  const morgageServices = await prisma.customerMorgage.findMany({
    where: {
        customerId: loggedInUser.id
    },
  })
  
  const services: Service[] = [...lawnServices, ...internetServices, ...interiorServices, ...insuranceServices, ...cellServices, ...morgageServices]

  if (!services) throw createError({ statusCode: 404, statusMessage: "Current Games not found" });

  return services;
});