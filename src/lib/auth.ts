import { UserRole, type User } from "@prisma/client";
import { jwtVerify, SignJWT } from "jose";
import { cookies } from "next/headers";
import { ForbiddenError } from "@/exceptions/ForbiddenError";
import { UnauthorizedError } from "@/exceptions/UnauthorizedError";
import { prisma } from "@/lib/prisma";
import type { SafeUserDto } from "@/types/dto";

const COOKIE_NAME = "grocery_token";

type AuthPayload = {
  userId: string;
  role: UserRole;
};

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

export function toSafeUser(user: User): SafeUserDto {
  return {
    id: user.id,
    fullName: user.fullName,
    email: user.email,
    role: user.role,
    address: user.address,
    phoneNumber: user.phoneNumber
  };
}

export async function createAuthToken(payload: AuthPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getJwtSecret());
}

export async function verifyAuthToken(token: string): Promise<AuthPayload> {
  const { payload } = await jwtVerify(token, getJwtSecret());

  if (typeof payload.userId !== "string" || !Object.values(UserRole).includes(payload.role as UserRole)) {
    throw new UnauthorizedError("Invalid authentication token.");
  }

  return {
    userId: payload.userId,
    role: payload.role as UserRole
  };
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    throw new UnauthorizedError();
  }

  const payload = await verifyAuthToken(token);
  const user = await prisma.user.findUnique({ where: { id: payload.userId } });

  if (!user) {
    throw new UnauthorizedError();
  }

  return user;
}

export async function requireRole(role: UserRole) {
  const user = await getCurrentUser();

  if (user.role !== role) {
    throw new ForbiddenError();
  }

  return user;
}

export async function requireAdmin() {
  return requireRole(UserRole.ADMIN);
}

export async function requireCustomer() {
  return requireRole(UserRole.CUSTOMER);
}
