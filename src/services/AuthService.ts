import bcrypt from "bcryptjs";
import { ValidationError } from "@/exceptions/ValidationError";
import { createAuthToken, toSafeUser } from "@/lib/auth";
import { UserRepository } from "@/repositories/UserRepository";

export class AuthService {
  private readonly users = new UserRepository();

  public async register(input: {
    fullName: string;
    email: string;
    password: string;
    address?: string;
    phoneNumber?: string;
  }) {
    const existingUser = await this.users.findByEmail(input.email);

    if (existingUser) {
      throw new ValidationError("A user with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);
    const user = await this.users.create({
      fullName: input.fullName,
      email: input.email,
      passwordHash,
      address: input.address,
      phoneNumber: input.phoneNumber
    });
    const token = await createAuthToken({ userId: user.id, role: user.role });

    return { user: toSafeUser(user), token };
  }

  public async login(input: { email: string; password: string }) {
    const user = await this.users.findByEmail(input.email);

    if (!user) {
      throw new ValidationError("Invalid email or password.");
    }

    const passwordMatches = await bcrypt.compare(input.password, user.passwordHash);

    if (!passwordMatches) {
      throw new ValidationError("Invalid email or password.");
    }

    const token = await createAuthToken({ userId: user.id, role: user.role });

    return { user: toSafeUser(user), token };
  }
}
