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
  type DropdownHeight = "short" | "medium" | "tall" | "very tall" | "none";
  interface FlipPadding {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  }

  type Breakpoint = "sm" | "md" | "lg" | "xl";
  interface Breakpoints {
    sm: boolean;
    md: boolean;
    lg: boolean;
    xl: boolean;
  }

  /* USERS */
  type UserType = "customer" | "business";

  interface ICustomer {
    id: string;
    userType: UserType;
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
    userType: UserType;
    businessName: string;
    email: string;
    emailNormalized: string;
    password?: string;
    phoneNumber?: string;
    createdAt: Date;
    updatedAt?: Date;
  }

  type IUser = ICustomer | IBusiness;

  /* SERVICES */
  type ServiceType = "Lawn" | "Interior" | "Morgage" | "Insurance" | "Internet" | "Cell";

  interface ServiceBase {
    id: string;
    // Key is client only, not stored in DB
    key?: string;
    serviceType: string;
  }

  /* CUSTOMER SERVICES */
  // #region
  interface CustomerService extends ServiceBase {
    customerId: string;
  }

  interface CustomerLawn extends CustomerService {
    lawnSize: number;
    costPerMonth: number;
  }

  interface CustomerInterior extends CustomerService {
    sqFootage: number;
    costPerMonth: number;
  }

  interface CustomerMorgage extends CustomerService {
    sqFootage: number;
    costPerMonth: number;
    insuranceRate: number;
  }

  interface CustomerInsurance extends CustomerService {
    sqFootage: number;
    totalCoverage: number;
    costPerMonth: number;
    allowLessCoverage: boolean;
  }

  interface CustomerInternet extends CustomerService {
    speed: number;
    costPerMonth: number;
    allowLessSpeed: boolean;
  }

  interface CustomerCell extends CustomerService {
    GBPerMonth: number;
    costPerMonth: number;
    allowLessGB: boolean;
  }
  // #endregion

  /* BUSINESS SERVICES */
  // #region
  interface BusinessService extends ServiceBase {
    businessId: string;
  }

  interface BusinessLawn extends BusinessService {
    costPerSqFoot: number;
  }

  interface BusinessInterior extends BusinessService {
    costPerSqFoot: number;
  }

  interface BusinessMorgage extends BusinessService {
    costPerSqFoot: number;
    insuranceRate: number;
  }

  interface BusinessInsurance extends BusinessService {
    costPerSqFoot: number;
    totalCoverage: number;
  }

  interface BusinessInternet extends BusinessService {
    speed: number;
    costPerMonth: number;
  }

  interface BusinessCell extends BusinessService {
    GBPerMonth: number;
    costPerMonth: number;
  }
  // #endregion

  type Service =
    | ServiceBase
    | CustomerLawn
    | CustomerInterior
    | CustomerMorgage
    | CustomerInsurance
    | CustomerInternet
    | CustomerCell
    | BusinessLawn
    | BusinessInterior
    | BusinessMorgage
    | BusinessInsurance
    | BusinessInternet
    | BusinessCell;

  interface Profile extends ServiceBase {
    matchPreference?: MatchPreference;
    phoneNumber: string;
    email: string;
  }

  type MatchPreference = "Any" | "Good" | "Best" | "None"

  /* MATCHED */
  interface Matched {
    id: string;
    customerId: string;
    businessId: string;
    serviceType: string;
    cserviceId: string;
    bserviceId: string;
    matchScore: number;
    updatedAt: Date;
    notified: boolean;
    acceptStatus: boolean;

  }

  /* NOTIFICATION */
  interface Notification {
    id: string;
    matchedId: string;
    customerId: string;
    businessId: string;
    customerAccept: boolean;
    businessAccept: boolean;
    sentAt: Date;
  }

  /* BLOCKED */
  interface Blocked {
    id: string;
    customerId: string;
    businessId: string;
    blockDate: Date;
  }

  /* ALERTS */
  interface Alert {
    id: string;
    code?: number;
    message: string;
    type: "error" | "warning" | "note";
  }
}

export {};
