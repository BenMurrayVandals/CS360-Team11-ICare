import prisma from "~~/server/database/client";
import deleteLawn from "./deleteLawnService.delete";
import addMorgage from "../morgageServices/addMorgageService.post";
import addInterior from "../interiorServices/addInteriorService.post";
import addInsurance from "../insuranceServices/addInsuranceService.post";
import addInternet from "../internetServices/addInternetService.post";
import addCell from "../cellServices/addCellService.post";
import { editMatchScoreBusiness } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const { id, serviceType } = await readBody(event);
    switch (serviceType) {
      case "Morgage":
        await deleteLawn(event);
        return await addMorgage(event);
        break;
      case "Interior":
        await deleteLawn(event);
        return await addInterior(event);
        break;
      case "Insurance":
        await deleteLawn(event);
        return await addInsurance(event);
        break;
      case "Internet":
        await deleteLawn(event);
        return await addInternet(event);
        break;
      case "Cell":
        await deleteLawn(event);
        return await addCell(event);
        break;
      default: //Lawn case
        try {
          const { costPerSqFoot, insuranceRate } = await readBody(event);
          //Make sure we have all important data
          if (!costPerSqFoot) {
            throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
          }
          const updatedLawnService = await prisma.businessLawn.update({
            where: { id }, // Specify the record by its unique id
            data: {
              // Provide the new data to update
              costPerSqFoot,
            },
          });
          await editMatchScoreBusiness(updatedLawnService.id, updatedLawnService.serviceType);
          return updatedLawnService;
        } catch (error) {
          // Handle errors
          console.log(error);
          throw createError({ statusCode: 500, message: "Error editting Lawn service" });
        }
        break;
    }
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      console.log(error);
      throw createError({ statusCode: 500, message: "Error editting Lawn service" });
    }
  }
});
