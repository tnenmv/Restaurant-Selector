export class RestaurantServiceError extends Error {
  constructor(message: string, readonly cause?: unknown) {
    super(message);
    this.name = 'RestaurantServiceError';
  }
}
