import prisma from "~~/server/database/client";

export const customerAddsServiceMatchScoreCalculation = async (serviceId: string, serviceType: string) => {
  if (serviceType == "Lawn") {
    const service = await prisma.customerLawn.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessLawn.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / service.costPerMonth ** 2) * (businessService.costPerSqFoot * service.lawnSize) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Interior") {
    const service = await prisma.customerInterior.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessInterior.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / service.costPerMonth ** 2) * (businessService.costPerSqFoot * service.sqFootage) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Morgage") {
    const service = await prisma.customerMorgage.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessMorgage.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore = -(25 / service.costPerMonth ** 2) * businessService.insuranceRate ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Insurance") {
    const service = await prisma.customerInsurance.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessInsurance.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / service.costPerMonth ** 2) * (businessService.costPerSqFoot * service.sqFootage) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Internet") {
    const service = await prisma.customerInternet.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessInternet.findMany();
    businessServices.forEach(async (businessService) => {
      //-(25/customervalue^2)(buisnesscost^2)+100
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore = -(25 / service.costPerMonth ** 2) * businessService.costPerMonth ** 2 + 100;
      let speedMatchScore;
      if (businessService.speed > service.speed) {
        let speedMatchScore = (service.speed / businessService.speed) * 100;
      } else {
        let speedMatchScore = 0;
      }
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round(((costMatchScore + speedMatchScore) / 200) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else {
    return null;
  }
};

export const businessAddsServiceMatchScoreCalculation = async (businessId: string, businessType: string) => {
  if (businessType == "Lawn") {
    const business = await prisma.businessInternet.findUnique({
      where: { id: businessId },
    });
    const customerServices = await prisma.customerInternet.findMany();
    customerServices.forEach(async (customerService) => {
      if (customerService.costPerMonth == 0) {
        customerService.costPerMonth = 1;
      }
      let costMatchScore = -(25 / customerService.costPerMonth ** 2) * business.costPerMonth ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: customerService.customerId,
          businessId: business.businessId,
          serviceType: businessType,
          cserivceId: customerService.id,
          bserviceId: business.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (businessType == "Interior") {
    const business = await prisma.businessInterior.findUnique({
      where: { id: businessId },
    });
    const customerServices = await prisma.customerInterior.findMany();
    customerServices.forEach(async (customerService) => {
      if (customerService.costPerMonth == 0) {
        customerService.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / customerService.costPerMonth ** 2) * (business.costPerSqFoot * customerService.sqFootage) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: customerService.customerId,
          businessId: business.businessId,
          serviceType: businessType,
          cserivceId: customerService.id,
          bserviceId: business.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (businessType == "Morgage") {
    const business = await prisma.businessMorgage.findUnique({
      where: { id: businessId },
    });
    const customerServices = await prisma.customerMorgage.findMany();
    customerServices.forEach(async (customerService) => {
      if (customerService.costPerMonth == 0) {
        customerService.costPerMonth = 1;
      }
      let costMatchScore = -(25 / customerService.costPerMonth ** 2) * business.insuranceRate ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: customerService.customerId,
          businessId: business.businessId,
          serviceType: businessType,
          cserivceId: customerService.id,
          bserviceId: business.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (businessType == "Insurance") {
    const business = await prisma.businessInsurance.findUnique({
      where: { id: businessId },
    });
    const customerServices = await prisma.customerInsurance.findMany();
    customerServices.forEach(async (customerService) => {
      if (customerService.costPerMonth == 0) {
        customerService.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / customerService.costPerMonth ** 2) * (business.costPerSqFoot * customerService.sqFootage) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: customerService.customerId,
          businessId: business.businessId,
          serviceType: businessType,
          cserivceId: customerService.id,
          bserviceId: business.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (businessType == "Internet") {
    const business = await prisma.businessInternet.findUnique({
      where: { id: businessId },
    });
    const customerServices = await prisma.customerInternet.findMany();
    customerServices.forEach(async (customerService) => {
      if (customerService.costPerMonth == 0) {
        customerService.costPerMonth = 1;
      }
      let costMatchScore = -(25 / customerService.costPerMonth ** 2) * business.costPerMonth ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: customerService.customerId,
          businessId: business.businessId,
          serviceType: businessType,
          cserivceId: customerService.id,
          bserviceId: business.id,
          matchScore: finalMatchScore,
        },
      });
    //   console.log("Added Match: ", matchEntry)
    });
  } else {
    return null;
  }
};

export const editMatchScoreCustomer = async (serviceId: string, serviceType: string) => {
  if (serviceType == "Lawn") {
    const service = await prisma.customerLawn.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessLawn.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / service.costPerMonth ** 2) * (businessService.costPerSqFoot * service.lawnSize) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Interior") {
    const service = await prisma.customerInterior.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessInterior.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / service.costPerMonth ** 2) * (businessService.costPerSqFoot * service.sqFootage) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Morgage") {
    const service = await prisma.customerMorgage.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessMorgage.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore = -(25 / service.costPerMonth ** 2) * businessService.insuranceRate ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Insurance") {
    const service = await prisma.customerInsurance.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessInsurance.findMany();
    businessServices.forEach(async (businessService) => {
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore =
        -(25 / service.costPerMonth ** 2) * (businessService.costPerSqFoot * service.sqFootage) ** 2 + 100;
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round((costMatchScore / 100) * 100);
      const matchEntry = await prisma.matched.create({
        data: {
          customerId: service.customerId,
          businessId: businessService.businessId,
          serviceType: serviceType,
          cserivceId: service.id,
          bserviceId: businessService.id,
          matchScore: finalMatchScore,
        },
      });
    });
  } else if (serviceType == "Internet") {
    const service = await prisma.customerInternet.findUnique({
      where: { id: serviceId },
    });
    const businessServices = await prisma.businessInternet.findMany();
    businessServices.forEach(async (businessService) => {
      //-(25/customervalue^2)(buisnesscost^2)+100
      if (service.costPerMonth == 0) {
        service.costPerMonth = 1;
      }
      let costMatchScore = -(25 / service.costPerMonth ** 2) * businessService.costPerMonth ** 2 + 100;
      let speedMatchScore;
      if (businessService.speed > service.speed) {
        let speedMatchScore = (service.speed / businessService.speed) * 100;
      } else {
        let speedMatchScore = 0;
      }
      if (costMatchScore < 0) {
        costMatchScore = 0;
      }
      let finalMatchScore = Math.round(((costMatchScore + speedMatchScore) / 200) * 100);
      const matchEntry = await prisma.matched.updateMany({
        where: {
          cserivceId: service.id,
          bserviceId: businessService.id,
        },
        data: { matchScore: finalMatchScore },
      });
    });
  } else {
    return null;
  }
  /*const matchEntry = await prisma.matched.update({
        where: {
            cserivceId: serviceId,
            bserviceId: businessService.ID
        }
        data: {matchScore: finalMatchScore}
    }) */
};

export const editMatchScoreBuisness = async (custId: string) => {};

export const deleteMatchScoreCustomer = async (serviceId: string) => {
  await prisma.matched.deleteMany({
    where: {
      cserivceId: serviceId,
    },
  });
};

export const deleteMatchScoreBuisness = async (serviceId: string) => {
    
  const deletedMatches = await prisma.matched.deleteMany({
    where: {
      bserviceId: serviceId,
    },
  });
//   console.log("Deleted Matches: ", deletedMatches)
};
