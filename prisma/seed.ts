import { PrismaClient, ProductType, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHashAdmin = await bcrypt.hash("admin123", 10);
  const passwordHashCustomer = await bcrypt.hash("customer123", 10);

  await prisma.user.upsert({
    where: { email: "admin@grocery.com" },
    update: {},
    create: {
      fullName: "Admin User",
      email: "admin@grocery.com",
      passwordHash: passwordHashAdmin,
      role: UserRole.ADMIN
    }
  });

  await prisma.user.upsert({
    where: { email: "customer@grocery.com" },
    update: {},
    create: {
      fullName: "Customer User",
      email: "customer@grocery.com",
      passwordHash: passwordHashCustomer,
      role: UserRole.CUSTOMER,
      address: "Sample Street 12",
      phoneNumber: "+905551112233"
    }
  });

  const categoryNames = [
    "Fruits & Vegetables",
    "Dairy",
    "Bakery",
    "Frozen Food",
    "Beverages",
    "Snacks",
    "Pantry"
  ];

  const categories = new Map<string, string>();

  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} grocery items` }
    });
    categories.set(name, category.id);
  }

  const products = [
    {
      name: "Milk",
      description: "Fresh daily milk, 1 liter.",
      price: 1.75,
      stockQuantity: 40,
      productType: ProductType.FRESH,
      categoryName: "Dairy",
      originCountry: "Turkey",
      expirationDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Egg",
      description: "Pack of 10 farm eggs.",
      price: 3.2,
      stockQuantity: 35,
      productType: ProductType.FRESH,
      categoryName: "Dairy",
      originCountry: "Turkey",
      expirationDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Bread",
      description: "Fresh bakery bread.",
      price: 0.95,
      stockQuantity: 50,
      productType: ProductType.FRESH,
      categoryName: "Bakery",
      originCountry: "Turkey",
      expirationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
    },
    {
      name: "Apple",
      description: "Crisp red apples sold per kilogram.",
      price: 2.4,
      stockQuantity: 25,
      productType: ProductType.FRESH,
      categoryName: "Fruits & Vegetables",
      originCountry: "Turkey"
    },
    {
      name: "Banana",
      description: "Imported bananas sold per kilogram.",
      price: 2.9,
      stockQuantity: 20,
      productType: ProductType.FRESH,
      categoryName: "Fruits & Vegetables",
      originCountry: "Ecuador"
    },
    {
      name: "Frozen Pizza",
      description: "Ready-to-bake frozen pizza.",
      price: 5.5,
      stockQuantity: 18,
      productType: ProductType.FROZEN,
      categoryName: "Frozen Food",
      requiredTemperature: -18
    },
    {
      name: "Ice Cream",
      description: "Vanilla family-size ice cream.",
      price: 4.8,
      stockQuantity: 15,
      productType: ProductType.FROZEN,
      categoryName: "Frozen Food",
      requiredTemperature: -18
    },
    {
      name: "Rice",
      description: "Long grain rice, 1 kilogram.",
      price: 2.1,
      stockQuantity: 60,
      productType: ProductType.PACKAGED,
      categoryName: "Pantry",
      brand: "Bakkal Choice",
      barcode: "869000000001"
    },
    {
      name: "Pasta",
      description: "Durum wheat pasta, 500 grams.",
      price: 1.35,
      stockQuantity: 70,
      productType: ProductType.PACKAGED,
      categoryName: "Pantry",
      brand: "Bakkal Choice",
      barcode: "869000000002"
    },
    {
      name: "Olive Oil",
      description: "Extra virgin olive oil, 1 liter.",
      price: 9.9,
      stockQuantity: 12,
      productType: ProductType.PACKAGED,
      categoryName: "Pantry",
      brand: "Aegean Gold",
      barcode: "869000000003"
    }
  ];

  for (const product of products) {
    const categoryId = categories.get(product.categoryName);
    if (!categoryId) {
      throw new Error(`Missing category ${product.categoryName}`);
    }

    await prisma.product.upsert({
      where: { name: product.name },
      update: {},
      create: {
        name: product.name,
        description: product.description,
        price: product.price,
        stockQuantity: product.stockQuantity,
        productType: product.productType,
        categoryId,
        imageUrl: `https://placehold.co/600x400?text=${encodeURIComponent(product.name)}`,
        expirationDate: "expirationDate" in product ? product.expirationDate : undefined,
        originCountry: "originCountry" in product ? product.originCountry : undefined,
        requiredTemperature:
          "requiredTemperature" in product ? product.requiredTemperature : undefined,
        brand: "brand" in product ? product.brand : undefined,
        barcode: "barcode" in product ? product.barcode : undefined
      }
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
