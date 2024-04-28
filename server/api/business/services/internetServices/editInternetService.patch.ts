import prisma from "~~/server/database/client";
import deleteInternet from "./deleteInternetService.delete";
import addLawn from "../lawnServices/addLawnService.post";
import addInterior from "../interiorServices/addInteriorService.post";
import addInsurance from "../insuranceServices/addInsuranceService.post";
import addMorgage from "../morgageServices/addMorgageService.post";
import addCell from "../cellServices/addCellService.post";
import { editMatchScoreBusiness } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const { id, serviceType } = await readBody(event);
    switch (serviceType) {
      case "Lawn":
        await deleteInternet(event);
        return await addLawn(event);
        break;
      case "Interior":
        await deleteInternet(event);
        return await addInterior(event);
        break;
      case "Insurance":
        await deleteInternet(event);
        return await addInsurance(event);
        break;
      case "Morgage":
        await deleteInternet(event);
        return await addMorgage(event);
        break;
      case "Cell":
        await deleteInternet(event);
        return await addCell(event);
        break;
      default: //Internet case
        try {
          const { speed, costPerMonth } = await readBody(event);
          //Make sure we have all important data
          if (!speed || !costPerMonth) {
            throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
          }
          const updatedInternetService = await prisma.businessInternet.update({
            where: { id }, // Specify the record by its unique id
            data: {
              // Provide the new data to update
              speed,
              costPerMonth,
            },
          });
          await editMatchScoreBusiness(updatedInternetService.id, updatedInternetService.serviceType);
          return updatedInternetService;
        } catch (error) {
          // Handle errors
          console.log(error);
          throw createError({ statusCode: 500, message: "Error editting Internet service" });
        }
        break;
    }
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      console.log(error);
      throw createError({ statusCode: 500, message: "Error editting Internet service" });
    }
  }
});
