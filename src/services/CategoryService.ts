import { NotFoundError } from "@/exceptions/NotFoundError";
import { CategoryRepository } from "@/repositories/CategoryRepository";

export class CategoryService {
  private readonly categories = new CategoryRepository();

  public getAllCategories() {
    return this.categories.findMany();
  }

  public async createCategory(input: { name: string; description?: string | null }) {
    return this.categories.create(input);
  }

  public async updateCategory(id: string, input: { name?: string; description?: string | null }) {
    await this.ensureExists(id);
    return this.categories.update(id, input);
  }

  public async deleteCategory(id: string) {
    await this.ensureExists(id);
    return this.categories.delete(id);
  }

  public count() {
    return this.categories.count();
  }

  private async ensureExists(id: string) {
    const category = await this.categories.findById(id);
    if (!category) {
      throw new NotFoundError("Category not found.");
    }
  }
}
