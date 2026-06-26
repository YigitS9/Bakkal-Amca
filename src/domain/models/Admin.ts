import { UserRole } from "@prisma/client";
import { User } from "./User";

export class Admin extends User {
  private readonly adminCode: string;

  public constructor(id: string, fullName: string, email: string, adminCode = "ADMIN") {
    super(id, fullName, email, UserRole.ADMIN);
    this.adminCode = adminCode;
  }

  public getAdminCode(): string {
    return this.adminCode;
  }

  public getDashboardLabel(): string {
    return `Admin: ${this.getFullName()}`;
  }
}
