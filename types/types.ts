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

  interface ICustomer {
    id: string;
    userType: string;
    username: string;
    email: string;
    emailNormalized: string;
    password?: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
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

  type IUser = ICustomer | IBusiness;

  /* ALERTS */
  interface Alert {
    id: string;
    code?: number;
    message: string;
    type: "error" | "warning" | "note";
  }
}

export {};
