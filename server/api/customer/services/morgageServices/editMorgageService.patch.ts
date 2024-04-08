import prisma from '~~/server/database/client';
import deleteMorgage from './deleteMorgageService.delete';
import addLawn from '../lawnServices/addLawnService.post';
import addInterior from '../interiorServices/addInteriorService.post';
import addInsurance from '../insuranceServices/addInsuranceService.post';
import addInternet from '../internetServices/addInternetService.post';
import addCell from '../cellServices/addCellService.post';

export default defineEventHandler(async (event) => {
    try {
        // Parse the request body
        const { id, type } = await readBody(event);
        switch(type){
          case "Lawn":
            await deleteMorgage(event);
            return (await addLawn(event));
            break;
          case "Interior":
            await deleteMorgage(event);
            return (await addInterior(event));
            break;
          case "Insurance":
            await deleteMorgage(event);
            return (await addInsurance(event));
            break;
          case "Internet":
            await deleteMorgage(event);
            return (await addInternet(event));
            break;
          case "Cell":
            await deleteMorgage(event);
            return (await addCell(event));
            break;
          default: //Morgage case
          try {
            const updatedMorgageService = await prisma.customerMorgage.update({
                where: { id }, // Specify the record by its unique id
                data: await readBody(event), // Provide the new data to update
            });
            return updatedMorgageService;
          } catch (error) {
              // Handle errors
              throw createError({ statusCode: 500, message: 'Error editting morgage service' });
          }
          break;
        }
    
      } catch (error) {
        throw createError({ statusCode: 500, message: 'Error editting morgage service' });
      }
  });
