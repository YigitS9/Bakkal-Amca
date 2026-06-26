import { CategoryService } from "@/services/CategoryService";
import { OrderService } from "@/services/OrderService";
import { ProductService } from "@/services/ProductService";

export class AdminService {
  private readonly products = new ProductService();
  private readonly categories = new CategoryService();
  private readonly orders = new OrderService();

  public async getDashboardStats() {
    const [totalProducts, totalCategories, totalOrders, lowStockProducts, recentOrders] =
      await Promise.all([
        this.products.count(),
        this.categories.count(),
        this.orders.count(),
        this.products.getLowStockProducts(),
        this.orders.recent()
      ]);

    return {
      totalProducts,
      totalCategories,
      totalOrders,
      lowStockProducts,
      recentOrders
    };
  }
}
