// This is needed (And the 'export' statement below) in order to import things like other external types
declare global {
  // Custom Modify type which allows for an Interface to have the types of specific properties changed.
  // https://stackoverflow.com/questions/41285211/overriding-interface-property-type-defined-in-typescript-d-ts-file
  type Modify<T, P> = Omit<T, keyof P> & P;

  type Size =
    | "extremely small"
    | "very small"
    | "small"
    | "medium"
    | "large"
    | "very large"
    | "extremely large"
    | "insanely large";
  type TitleSize = Size | "base";
  type Placement =
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "top-start"
    | "top-end"
    | "right-start"
    | "right-end"
    | "bottom-start"
    | "bottom-end"
    | "left-start"
    | "left-end";

  type Breakpoint = "sm" | "md" | "lg" | "xl";
  interface Breakpoints {
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
  }

  type UserType = "customer" | "business";
  type ServiceType = "Lawn" | "Interior" | "Morgage" | "Insurance" | "Internet" | "Cell";

  interface ICustomer {
    id: string;
    userType: string;
    username: string;
    email: string;
    emailNormalized: string;
    address?: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    matchPreference: number;
    createdAt: Date;
    updatedAt?: Date;
  }

  interface IBusiness {
    id: string;
    userType: string;
    businessName: string;
    email: string;
    emailNormalized: string;
    password?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt?: Date;
  }

  //Customer Tables
  interface CustomerLawn {
    id: string;
    serviceType: string;
    customerId: string;
    lawnSize: number;
    costPerMonth: number;
  }

  interface CustomerInterior {
    id: string;
    serviceType: string;
    customerId: string;
    sqFootage: number;
    costPerMonth: number;
  }

  interface CustomerMorgage {
    id: string;
    serviceType: string;
    customerId: string;
    sqFootage: number;
    costPerMonth: number;
    insuranceRate: number;
  }
  
  interface CustomerInsurance {
    id: string;
    serviceType: string;
    customerId: string;
    sqFootage: number;
    totalCoverage: number;
    costPerMonth: number
    allowLessCoverage: boolean;
  }

  interface CustomerInternet {
    id: string;
    serviceType: string;
    customerId: string;
    speed: number;
    costPerMonth: number
    allowLessSpeed: boolean;
  }

  interface CustomerCell {
    id: string;
    serviceType: string;
    customerId: string;
    GBPerMonth: number;
    costPerMonth: number
    allowLessGB: boolean;
  }

  //Business Tables
  interface BusinessLawn {
    id: string;
    serviceType: string;
    businessId: string;
    costPerSqFoot: number;
  }

  interface BusinessInterior {
    id: string;
    serviceType: string;
    businessId: string;
    costPerSqFoot: number;
  }

  interface BusinessMorgage {
    id: string;
    serviceType: string;
    businessId: string;
    costPerSqFoot: number;
    insuranceRate: number;
  }

  interface BusinessInsurance {
    id: string;
    serviceType: string;
    businessId: string;
    costPerSqFoot: number;
    totalCoverage: number;
  }

  interface BusinessInternet {
    id: string;
    serviceType: string;
    businessId: string;
    speed: number;
    costPerMonth: number
  }

  interface BusinessCell {
    id: string;
    serviceType: string;
    businessId: string;
    GBPerMonth: number;
    costPerMonth: number
  }

  interface Notification {
    id: string;
    customerId: string;
    businessId: string;
    serviceType: string;
    businessPrice: number;
    sentAt: Date;
    acceptStatus: boolean;
  }

  interface Blocked {
    id: string;
    customerId: string;
    businessId: string;
    blockDate: Date;
  }

  type IUser = ICustomer | IBusiness;
  type ICustomerServices = CustomerLawn | CustomerInterior | CustomerMorgage | CustomerInsurance | CustomerInternet | CustomerCell;
  type IBusinessServices = BusinessLawn | BusinessInterior | BusinessMorgage | BusinessInsurance | BusinessInternet | BusinessCell;

  /* ALERTS */
  interface Alert {
    id: string;
    code?: number;
    message: string;
    type: "error" | "warning" | "note";
  }
}

export {};
