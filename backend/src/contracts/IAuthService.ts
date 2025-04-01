import { User } from "../models/User";

export interface IAuthService {
  loginAsync(email: string, password: string, context: any): Promise<{accessToken: string, refreshToken: string, user: User}>;

  validateTokenAsync(token: string): Promise<string>;
  
  refreshAccessTokenAsync(refreshToken: string): Promise<string>;

  setPasswordAsync(token: string, newPassword: string): Promise<void>;

  createAccountAsync(creds: any, context: any): Promise<any>;
}

export interface IClientCreateRq {
  orgName: string;
  description?: string;
  location: string;
  website: string;
  gstNumber: string;
  companyRegisteredAddress: string;
  companySize: string;
  industryType: string;
  pan: string;
  iocDate: Date;
  operationContact: ContactInfo;
  billingContact: ContactInfo;
  paymentMethods: string[];

  emailId: string;
  mobileNumber: string;
  firstName: string;
  lastName: string;
  designation: string;
  password: string;
}

interface ContactInfo {
  name: string;
  email: string;
  phone: string;
}