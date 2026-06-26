import type { UserRole } from "@prisma/client";

export abstract class User {
  private readonly id: string;
  private fullName: string;
  private email: string;
  private role: UserRole;

  protected constructor(id: string, fullName: string, email: string, role: UserRole) {
    this.id = id;
    this.fullName = fullName;
    this.email = email;
    this.role = role;
  }

  public getId(): string {
    return this.id;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public getEmail(): string {
    return this.email;
  }

  public getRole(): UserRole {
    return this.role;
  }

  public abstract getDashboardLabel(): string;
}
