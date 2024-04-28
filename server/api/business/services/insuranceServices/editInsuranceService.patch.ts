import prisma from "~~/server/database/client";
import deleteInsurance from "./deleteInsuranceService.delete";
import addLawn from "../lawnServices/addLawnService.post";
import addInterior from "../interiorServices/addInteriorService.post";
import addMorgage from "../morgageServices/addMorgageService.post";
import addInternet from "../internetServices/addInternetService.post";
import addCell from "../cellServices/addCellService.post";
import { editMatchScoreBusiness } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const { id, serviceType } = await readBody(event);
    switch (serviceType) {
      case "Lawn":
        await deleteInsurance(event);
        return await addLawn(event);
        break;
      case "Interior":
        await deleteInsurance(event);
        return await addInterior(event);
        break;
      case "Morgage":
        await deleteInsurance(event);
        return await addMorgage(event);
        break;
      case "Internet":
        await deleteInsurance(event);
        return await addInternet(event);
        break;
      case "Cell":
        await deleteInsurance(event);
        return await addCell(event);
        break;
      default: //Insurance case
        try {
          const { costPerSqFoot, totalCoverage } = await readBody(event);
          //Make sure we have all important data
          if (!costPerSqFoot || !totalCoverage) {
            throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
          }
          const updatedInsuranceService = await prisma.businessInsurance.update({
            where: { id }, // Specify the record by its unique id
            data: {
              // Provide the new data to update
              costPerSqFoot,
              totalCoverage,
            },
          });
          await editMatchScoreBusiness(updatedInsuranceService.id, updatedInsuranceService.serviceType);
          return updatedInsuranceService;
        } catch (error) {
          // Handle errors
          console.log(error);
          throw createError({ statusCode: 500, message: "Error editting Insurance service" });
        }
        break;
    }
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      console.log(error);
      throw createError({ statusCode: 500, message: "Error editting Insurance service" });
    }
  }
});
