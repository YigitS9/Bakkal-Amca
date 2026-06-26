export interface IStockManageable {
  reduceStock(quantity: number): void;
  increaseStock(quantity: number): void;
}
