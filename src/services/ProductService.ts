import type { Prisma, Product as PrismaProduct } from "@prisma/client";
import { ProductFactory } from "@/domain/factories/ProductFactory";
import { NotFoundError } from "@/exceptions/NotFoundError";
import type { ProductInputDto } from "@/types/dto";
import { ProductRepository } from "@/repositories/ProductRepository";

export class ProductService {
  private readonly products = new ProductRepository();

  public async getAllProducts(params: { search?: string | null; categoryId?: string | null }) {
    const products = await this.products.findMany(params);
    return products.map((product) => this.withDomainFields(product));
  }

  public async getProductById(id: string) {
    const product = await this.products.findById(id);

    if (!product || !product.isAvailable) {
      throw new NotFoundError("Product not found.");
    }

    return this.withDomainFields(product);
  }

  public async createProduct(input: ProductInputDto) {
    const product = await this.products.create(this.toPrismaInput(input));
    return this.withDomainFields(product);
  }

  public async updateProduct(id: string, input: Partial<ProductInputDto>) {
    await this.ensureExists(id);
    const product = await this.products.update(id, this.toPrismaInput(input));
    return this.withDomainFields(product);
  }

  public async updateStock(id: string, stockQuantity: number) {
    await this.ensureExists(id);
    const product = await this.products.update(id, { stockQuantity });
    return this.withDomainFields(product);
  }

  public async deleteProduct(id: string) {
    await this.ensureExists(id);
    return this.products.delete(id);
  }

  public async getLowStockProducts() {
    return this.products.lowStock();
  }

  public count() {
    return this.products.count();
  }

  private async ensureExists(id: string) {
    const product = await this.products.findById(id);
    if (!product || !product.isAvailable) {
      throw new NotFoundError("Product not found.");
    }
  }

  private toPrismaInput(input: Partial<ProductInputDto>): Prisma.ProductUncheckedCreateInput {
    return {
      ...input,
      expirationDate: input.expirationDate ? new Date(input.expirationDate) : undefined
    } as Prisma.ProductUncheckedCreateInput;
  }

  private withDomainFields<T extends PrismaProduct>(product: T) {
    const domainProduct = ProductFactory.create(product);
    return {
      ...product,
      finalPrice: domainProduct.getFinalPrice(),
      storageInstructions: domainProduct.getStorageInstructions()
    };
  }
}
