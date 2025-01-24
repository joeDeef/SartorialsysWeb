import Product from '../models/Product.js';
import fs  from 'fs';
import path from 'path';

export const addProduct = async (req, res) => {
  try {
    const { code, name, price, category, size, amount, color } = req.body;

    var product = new Product({
      code,
      name,
      price,
      category,
      size,
      amount,
      color,
      status: req.body.status || true,
      images: []
    });

    var productStored = await product.save();

    if (!productStored) {
      return res.status(404).send({ message: 'The product was not saved' });
    }
    return res.status(201).send({ product: productStored });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});;
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();

    if(!products || products.length === 0) {
      return res.status(204).json({ message: "No products found"});
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});}
};

export const uploadImages = async (req, res) => {
  try {
    var productCode = req.params.code;
    var fileNames = [];
    
    if (req.files && req.files.image) {
      var files = req.files.image;

      for (var file of files) {
        var filePath = file.path;
        var fileSplit = filePath.split('\\');
        var fileName = fileSplit[fileSplit.length - 1];
        var extSplit = fileName.split('.');
        var fileExt = extSplit[1];

        if (['png', 'jpg', 'jpeg', 'gif', 'PNG'].includes(fileExt)) {
          fileNames.push(fileName);
        } else {
          fs.unlink(filePath, (err) => {
            if (err) console.error(err.message);
          });
        }
      }

      if (fileNames.length > 0) {
        var productUpdated = await Product.findOneAndUpdate(
          { code: productCode }, 
          { $push: { images: { $each: fileNames } } }, 
          { new: true }
        );

        if (!productUpdated) {
          return res.status(404).send({ message: 'The product does not exist and images cannot be uploaded' });
        }

        return res.status(200).send({ message: 'Images uploaded successfully', product: productUpdated });
      } else {
        return res.status(200).send({ message: 'No valid images were uploaded' });
      }
    } else {
      return res.status(200).send({ message: 'No images received' });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error"});;
  }
};

export const getProduct = async (req, res) => {
  try {
    const codeProduct = req.params.code;
    const product = await Product.find({ code: codeProduct});

    if(!product || product.length === 0) {
      return res.status(404).json({ message: "No product found"});
    }

    res.status(200).json(product);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});}
};


export const deleteProduct = async (req, res) => {
  try {
    const codeProduct = req.params.code;
    const productDeleted = await Product.findOneAndDelete( { code : codeProduct});

    if(!productDeleted){
      res.status(404).json({message: "Product not found"});
    }

    res.status(200).json({message: "Product deleted successfully"});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const updateProduct = async (req, res) => {
  try {
    const codeProduct = req.params.code;
    const body = req.body;
    const productUpdated = await Product.findByIdAndUpdate({ code: codeProduct}, body, {new : true});

    if(!productUpdated){
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({message: "Product updated sucessful", product: productUpdated});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Internal server error"});  }
};

export const getImages = async (req, res) => {
  try {
    const productCode = req.params.code;

    const product = await Product.findOne({ code: productCode });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    var imagePaths = product.images;

    var images = [];

    for (let file of imagePaths) {
      var path_file = "./uploads/" + file;

      var exists = await fs.promises.access(path_file)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        images.push(path.resolve(path_file));
      }
    }

    if (images.length > 0) {
      return res.json({ images });
    } else {
      return res.status(200).send({ message: 'No images found' });
    }

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
