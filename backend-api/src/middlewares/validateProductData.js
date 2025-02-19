export const validateProductData = (req, res, next) => {
    try {
      const { code, name, category, price, inventory } = req.fields;
  
      req.productData = {
        code: code ? code[0] : "",
        name: name ? name[0] : "",
        category: category ? category[0] : "",
        price: price ? parseFloat(price[0]) : 0,
        inventory: inventory ? JSON.parse(inventory[0]) : [],
      };
  
      if (!req.productData.code || !req.productData.name || !req.productData.category || !req.productData.price) {
        return res.status(400).json({ message: "Missing required fields" });
      }
  
      next();
    } catch (error) {
      res.status(400).json({ message: "Invalid input format" });
    }
  };