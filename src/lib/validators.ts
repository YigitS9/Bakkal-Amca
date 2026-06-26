import { OrderStatus, PaymentMethod, ProductType } from "@prisma/client";
import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  address: z.string().optional(),
  phoneNumber: z.string().optional()
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const productSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  stockQuantity: z.number().int().min(0),
  productType: z.nativeEnum(ProductType),
  categoryId: z.string().min(1),
  imageUrl: z.string().url().optional().nullable(),
  expirationDate: z.string().datetime().optional().nullable(),
  originCountry: z.string().optional().nullable(),
  requiredTemperature: z.number().optional().nullable(),
  brand: z.string().optional().nullable(),
  barcode: z.string().optional().nullable()
});

export const productUpdateSchema = productSchema.partial();

export const stockUpdateSchema = z.object({
  stockQuantity: z.number().int().min(0)
});

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable()
});

export const categoryUpdateSchema = categorySchema.partial();

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive()
});

export const cartItemUpdateSchema = z.object({
  quantity: z.number().int().positive()
});

export const checkoutSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod)
});

export const orderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus)
});
