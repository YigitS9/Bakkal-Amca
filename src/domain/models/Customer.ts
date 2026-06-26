import { UserRole } from "@prisma/client";
import { User } from "./User";

export class Customer extends User {
  private readonly address?: string;
  private readonly phoneNumber?: string;

  public constructor(
    id: string,
    fullName: string,
    email: string,
    address?: string,
    phoneNumber?: string
  ) {
    super(id, fullName, email, UserRole.CUSTOMER);
    this.address = address;
    this.phoneNumber = phoneNumber;
  }

  public getDashboardLabel(): string {
    return `Customer: ${this.getFullName()}`;
  }

  public getAddress(): string | undefined {
    return this.address;
  }

  public getPhoneNumber(): string | undefined {
    return this.phoneNumber;
  }
}
