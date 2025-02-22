import Product from "../models/Product.js";
import uploadProductImages from "../utils/uploadImages.js";

/**
 * Creates a new product and saves it in the database.
 * @param {Object} productData - The product details.
 * @returns {Object} - The stored product.
 */
export const createProduct = async (productData) => {
  const newProduct = new Product({ ...productData, images: [] });
  return await newProduct.save();
};

/**
 * Uploads images for a product.
 * @param {Array} files - Array of image files.
 * @returns {Array} - Uploaded file names.
 */
export const uploadImagesService = async (code, files) => {
  let fileNames = await uploadProductImages(files, "products");
  return await Product.findOneAndUpdate(
    { code },
    { $push: { images: { $each: fileNames } } },
    { new: true }
  );
};

/**
 * Fetches products based on filters, pagination, and sorting criteria.
 * @param {Object} filter - Filtering options for the query.
 * @param {Object} pagination - Pagination options { skip, limit }.
 * @param {Object} sort - Sorting criteria.
 * @returns {Promise<Array>} - List of found products.
 */
export const getAllProducts = async (query) => {
  const { filter, pagination, sort } = query;
  return await Product.find(filter)
    .skip(pagination.skip)
    .limit(pagination.limit)
    .sort(sort);
};

/**
 * Retrieves a product by its code.
 * @param {String} code - Product code.
 * @returns {Object|null} - The product or null if not found.
 */
export const getProductByCode = async (code) => {
  return await Product.findOne({ code, deleted: false });
};

/**
 * Updates a product completely.
 * @param {String} code - Product code.
 * @param {Object} productData - New product data.
 * @returns {Object|null} - Updated product or null if not found.
 */
export const updateProduct = async (code, productData) => {
  return await Product.findOneAndUpdate({ code }, productData, { new: true });
};

/**
 * Updates specific fields of a product, including inventory.
 * @param {string} code - Product code.
 * @param {Object} productData - Partial data to update.
 * @returns {Promise<Object|null>} - Updated product or null if not found.
 */
export const updatePartialProductByCode = async (code, productData) => {
  const update = {};

  // Separate fields that are not inventory-related
  Object.keys(productData).forEach((key) => {
    if (key !== "inventory") {
      update[key] = productData[key];
    }
  });

  let updatedProduct = null;

  // If updating inventory, iterate through sizes and colors
  if (productData.inventory) {
    for (const sizeData of productData.inventory) {
      for (const colorData of sizeData.colors) {
        updatedProduct = await Product.findOneAndUpdate(
          {
            code,
            "inventory.size": sizeData.size,
            "inventory.colors.name": colorData.name,
          },
          {
            $set: {
              "inventory.$[size].colors.$[color].amount": colorData.amount,
              "inventory.$[size].colors.$[color].available":
                colorData.available,
              ...update,
            },
          },
          {
            new: true,
            arrayFilters: [
              { "size.size": sizeData.size },
              { "color.name": colorData.name },
            ],
          }
        );
      }
    }
  } else {
    // If no inventory update, just update the general product fields
    updatedProduct = await Product.findOneAndUpdate(
      { code },
      { $set: update },
      { new: true }
    );
  }

  return updatedProduct;
};

/**
 * Marks a product as deleted.
 * @param {String} code - Product code.
 * @returns {Object|null} - Updated product or null if not found.
 */
export const deleteProduct = async (code) => {
  return await Product.findOneAndUpdate({ code }, { deleted: true });
};

/**
 * Removes an image from a product.
 * @param {String} code - Product code.
 * @param {String} imageName - Image name to remove.
 * @returns {Object|null} - Updated product or null if not found.
 */
export const removeProductImage = async (code, imageName) => {
  const product = await Product.findOne({ code });

  if (!product) return null;

  const imageIndex = product.images.indexOf(imageName);
  if (imageIndex > -1) {
    product.images.splice(imageIndex, 1);
    await product.save();
  }

  return product;
};

/**
 * Adds a new size with colors to the product's inventory.
 * @param {string} code - Product code.
 * @param {string} size - Size to add.
 * @param {Array} colors - List of colors for the size.
 * @returns {Promise<Object|null>} - The updated product or null if not found.
 */
export const addProductSize = async (code, size, colors) => {
  return await Product.findOneAndUpdate(
    { code },
    {
      $push: {
        inventory: {
          size,
          colors,
          available: true,
        },
      },
    },
    { new: true }
  );
};

/**
 * Adds colors to a specific size in the product's inventory.
 * @param {string} code - Product code.
 * @param {string} size - Size to which colors should be added.
 * @param {Array} colors - List of colors to add.
 * @returns {Promise<Object|null>} - The updated product or null if not found.
 */
export const addProductColor = async (code, size, colors) => {
  return await Product.findOneAndUpdate(
    {
      code,
      "inventory.size": size,
    },
    {
      $push: {
        "inventory.$.colors": { $each: colors },
      },
    },
    { new: true }
  );
};

/**
 * Removes a size from the product's inventory.
 * @param {string} code - Product code.
 * @param {string} size - Size to remove.
 * @returns {Promise<Object|null>} - The updated product or null if not found.
 */
export const removeProductSize = async (code, size) => {
  return await Product.findOneAndUpdate(
    { code },
    {
      $pull: { inventory: { size } },
    },
    { new: true }
  );
};

/**
 * Removes a color from a specific size in the product's inventory.
 * @param {string} code - Product code.
 * @param {string} size - Size containing the color.
 * @param {string} color - Color to remove.
 * @returns {Promise<Object|null>} - The updated product or null if not found.
 */
export const removeProductColor = async (code, size, color) => {
  return await Product.findOneAndUpdate(
    { code, "inventory.size": size },
    {
      $pull: { "inventory.$.colors": { name: color } },
    },
    { new: true }
  );
};
