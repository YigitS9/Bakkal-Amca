import type {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  ProductType,
  UserRole
} from "@prisma/client";

export type SafeUserDto = {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  address: string | null;
  phoneNumber: string | null;
};

export type PaymentResult = {
  success: boolean;
  status: PaymentStatus;
  method: PaymentMethod;
  message: string;
};

export type ProductInputDto = {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  productType: ProductType;
  categoryId: string;
  imageUrl?: string | null;
  expirationDate?: string | Date | null;
  originCountry?: string | null;
  requiredTemperature?: number | null;
  brand?: string | null;
  barcode?: string | null;
};

export type OrderStatusUpdateDto = {
  status: OrderStatus;
};
