import prisma from '~~/server/database/client';
import deleteCell from './deleteCellService.delete';
import addLawn from '../lawnServices/addLawnService.post';
import addInterior from '../interiorServices/addInteriorService.post';
import addInsurance from '../insuranceServices/addInsuranceService.post';
import addInternet from '../internetServices/addInternetService.post';
import addMorgage from '../morgageServices/addMorgageService.post';

export default defineEventHandler(async (event) => {
    try {
        // Parse the request body
        const { id, serviceType } = await readBody(event);
        switch(serviceType){
          case "Lawn":
            await deleteCell(event);
            return (await addLawn(event));
            break;
          case "Interior":
            await deleteCell(event);
            return (await addInterior(event));
            break;
          case "Insurance":
            await deleteCell(event);
            return (await addInsurance(event));
            break;
          case "Internet":
            await deleteCell(event);
            return (await addInternet(event));
            break;
          case "Morgage":
            await deleteCell(event);
            return (await addMorgage(event));
            break;
          default: //Cell case
          try {
            const { costPerMonth, GBPerMonth } = await readBody(event);
            //Make sure we have all important data
            if (!costPerMonth || !GBPerMonth) {
              throw createError({ statusCode: 400, message: 'Bad Request: Missing required fields' });
            }
            const updatedCellService = await prisma.businessCell.update({
                where: { id }, // Specify the record by its unique id
                data: {// Provide the new data to update
                  costPerMonth,
                  GBPerMonth
                } 
            });
            return updatedCellService;
          } catch (error) {
              // Handle errors
              console.log(error);
              throw createError({ statusCode: 500, message: 'Error editting Cell service' });
          }
          break;
        }
    
      } catch (error) {
        if (error.code === 'P2002') {
          // Prisma constraint violation error
          throw createError({ statusCode: 400, message: 'Bad Request: Duplicate entry' });
      } else {
        console.log(error);
          throw createError({ statusCode: 500, message: 'Error editting Cell service' });
      }
      }
  });
