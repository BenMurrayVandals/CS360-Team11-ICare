import prisma from "~~/server/database/client";
import deleteInterior from "./deleteInteriorService.delete";
import addLawn from "../lawnServices/addLawnService.post";
import addMorgage from "../morgageServices/addMorgageService.post";
import addInsurance from "../insuranceServices/addInsuranceService.post";
import addInternet from "../internetServices/addInternetService.post";
import addCell from "../cellServices/addCellService.post";
import { editMatchScoreBusiness } from "~~/server/services/matchService";

export default defineEventHandler(async (event) => {
  try {
    // Parse the request body
    const { id, serviceType } = await readBody(event);
    switch (serviceType) {
      case "Lawn":
        await deleteInterior(event);
        return await addLawn(event);
        break;
      case "Morgage":
        await deleteInterior(event);
        return await addMorgage(event);
        break;
      case "Insurance":
        await deleteInterior(event);
        return await addInsurance(event);
        break;
      case "Internet":
        await deleteInterior(event);
        return await addInternet(event);
        break;
      case "Cell":
        await deleteInterior(event);
        return await addCell(event);
        break;
      default: //Interior case
        try {
          const { costPerSqFoot } = await readBody(event);
          //Make sure we have all important data
          if (!costPerSqFoot) {
            throw createError({ statusCode: 400, message: "Bad Request: Missing required fields" });
          }
          const updatedInteriorService = await prisma.businessInterior.update({
            where: { id }, // Specify the record by its unique id
            data: {
              // Provide the new data to update
              costPerSqFoot,
            },
          });
          await editMatchScoreBusiness(updatedInteriorService.id, updatedInteriorService.serviceType);
          return updatedInteriorService;
        } catch (error) {
          // Handle errors
          console.log(error);
          throw createError({ statusCode: 500, message: "Error editting Interior service" });
        }
        break;
    }
  } catch (error) {
    if (error.code === "P2002") {
      // Prisma constraint violation error
      throw createError({ statusCode: 400, message: "Bad Request: Duplicate entry" });
    } else {
      console.log(error);
      throw createError({ statusCode: 500, message: "Error editting Interior service" });
    }
  }
});
