class CartNotFoundError extends Error {
  constructor(cartId) {
    super(`Cart with ID ${cartId} not found`);
    this.name = "CartNotFoundError";
    this.statusCode = 404;
    this.message = `Cart with ID ${cartId} not found`;
  }
}

class ProductNotFoundError extends Error {
  constructor(productCode) {
    super(`Product with code ${productCode} not found`);
    this.name = "ProductNotFoundError";
    this.statusCode = 404;
    this.message = `Product with code ${productCode} not found`;
  }
}

class SizeNotFoundError extends Error {
  constructor(size) {
    super(`Size ${size} not found for this product`);
    this.name = "SizeNotFoundError";
    this.statusCode = 400;
    this.message = `Size ${size} not found for this product`;
  }
}

class ColorNotFoundError extends Error {
  constructor(color) {
    super(`Color ${color} not found for this product size`);
    this.name = "ColorNotFoundError";
    this.statusCode = 400;
    this.message = `Color ${color} not found for this product size`;
  }
}

class InsufficientStockError extends Error {
  constructor(color, size, availableAmount) {
    super(`Not enough stock available for ${color} (${size}). Available: ${availableAmount}`);
    this.name = "InsufficientStockError";
    this.statusCode = 400;
    this.message = `Not enough stock available for ${color} (${size}). Available: ${availableAmount}`;
  }
}

class ProductNotInCartError extends Error {
  constructor(productCode, size, color) {
    super(`Product with code ${productCode}, size ${size}, and color ${color} not found in cart`);
    this.name = "ProductNotInCartError";
    this.statusCode = 404;
    this.message = `Product with code ${productCode}, size ${size}, and color ${color} not found in cart`;
  }
}

class InvalidQuantityError extends Error {
  constructor(quantity) {
    super(`Quantity must be greater than or equal to 1. Given: ${quantity}`);
    this.name = "InvalidQuantityError";
    this.statusCode = 400;
    this.message = `Quantity must be greater than or equal to 1. Given: ${quantity}`;
  }
}

export {
  CartNotFoundError,
  ProductNotFoundError,
  SizeNotFoundError,
  ColorNotFoundError,
  InsufficientStockError,
  ProductNotInCartError,
  InvalidQuantityError,
};
