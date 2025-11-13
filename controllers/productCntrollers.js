const Hero = require("../modules/Hero");
const Product = require("../modules/Product");
const { v4 } = require("uuid");

const createProduct = async (req, res) => {
  try {
    const {
      productTitle,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      stock,
      price,
      category,
      coverImage,
      images,
      family,
      size,
      colors,
      brand,
      gender,
      type,
    } = req.body;
    if (
      !productTitle ||
      !descriptionAr ||
      !descriptionFr ||
      !descriptionEn ||
      !stock ||
      !price ||
      !category ||
      !coverImage ||
      !images ||
      !family ||
      !size ||
      !colors ||
      !brand ||
      !type
    )
      return res.status(400).json({ message: "All fields are required" });
    const duplicate = await Product.findOne({ productTitle }).exec();
    if (duplicate)
      return res.status(401).json({
        message: "This prosuct is alrady in the data base please check again",
      });
    const newProdct = {
      productTitle,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      stock,
      price,
      category,
      family,
      size,
      coverImage,
      images,
      colors,
      brand,
      gender,
      type,
      likes: {},
      comments: [],
      bought: "0",
    };
    const pro = await Product.create(newProdct);

    if (pro) {
      //created
      return res
        .status(201)
        .json({ message: `New Product ${productTitle} created` });
    } else {
      return res.status(400).json({ message: "Invalid Product data received" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const allProducts = await Product.find().lean();
    if (!allProducts?.length) {
      return res.status(200).json([]);
      // return res.status(400).json({ message: "No products found" });
    }
    return res.status(200).json(allProducts);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getProductByFamily = async (req, res) => {
  try {
    const { ProdFamily } = req.params;
    const allProducts = await Product.find().lean();
    if (!allProducts?.length) {
      return res.status(400).json({ message: "No products found" });
    }
    const prod = allProducts.filter((ele) => ele.family === ProdFamily);
    return res.status(200).json(prod);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const filtedData = async (req, res) => {
  try {
    const { ProdFamily, ProductCat, ProductSub } = req.params;
    console.log(ProdFamily, ProductCat, ProductSub);
    const allProducts = await Product.find().lean();
    if (!allProducts?.length) {
      return res.status(400).json({ message: "No products found" });
    }
    let prod;
    if (
      ProdFamily === "All" &&
      ProductCat !== "Default" &&
      ProductSub !== "Do not select anything"
    ) {
      prod = allProducts
        .filter((ele) => ele.category === ProductCat)
        .filter((el) => el.type === ProductSub);
    } else if (ProdFamily !== "All" && ProductCat === "Default") {
      prod = allProducts.filter((ele) => ele.family === ProdFamily);
    } else if (
      ProdFamily !== "All" &&
      ProductCat !== "Default" &&
      ProductSub === "Do not select anything"
    ) {
      prod = allProducts
        .filter((ele) => ele.family === ProdFamily)
        .filter((ele) => ele.category === ProductCat);
    } else if (
      ProdFamily === "All" &&
      ProductCat !== "Default" &&
      ProductSub === "Do not select anything"
    ) {
      prod = allProducts.filter((ele) => ele.category === ProductCat);
    } else if (
      ProdFamily === "All" &&
      ProductCat === "Default" &&
      ProductSub === "Do not select anything"
    ) {
      prod = allProducts;
    } else {
      prod = allProducts
        .filter((ele) => ele.family === ProdFamily)
        .filter((ele) => ele.category === ProductCat)
        .filter((ele) => ele.type === ProductSub);
    }
    return res.status(200).json(prod);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const {
      productTitle,
      descriptionAr,
      descriptionFr,
      descriptionEn,
      stock,
      price,
      category,
      coverImage,
      images,
      sale,
      onSale,
      pp,
      colors,
      family,
      size,
      brand,
      type,
      bought,
    } = req.body;

    const { id } = req.params;
    const product = await Product.findById(id).exec();
    if (!product) return res.status(404).json({ message: "product not found" });
    product.productTitle = productTitle ? productTitle : product.productTitle;
    product.descriptionAr = descriptionAr
      ? descriptionAr
      : product.descriptionAr;
    product.descriptionFr = descriptionFr
      ? descriptionFr
      : product.descriptionFr;
    product.descriptionEn = descriptionEn
      ? descriptionEn
      : product.descriptionEn;
    product.stock = stock ? stock : product.stock;
    product.price = price ? price : product.price;
    product.colors = colors ? colors : product.colors;
    product.family = family ? family : product.family;
    product.size = size ? size : product.size;
    product.brand = brand ? brand : product.brand;
    product.type = type ? type : product.type;
    product.category = category ? category : product.category;
    product.coverImage = coverImage ? coverImage : product.coverImage;
    product.images = images ? images : product.images;
    product.sale = sale ? sale : product.sale;
    product.onSale = onSale !== undefined ? onSale : product.onSale;
    product.likes = product.likes;
    product.comments = product.comments;
    product.bought = bought ? bought : product.bought;
    const updatedProduct = await product.save();
    console.log(onSale, product.onSale);
    return res.json({ message: `The product with the ID:${id} is updated` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).exec();
    if (!product) {
      return res
        .status(400)
        .json({ message: `There is no product with the ID: ${id}` });
    }
    return res.status(200).json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const deletProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id).exec();
    if (!product) {
      return res
        .status(400)
        .json({ message: `There is no product with the ID: ${id}` });
    }
    const result = await product.deleteOne();

    const reply = `Note '${product.productTitle}' with ID ${product._id} deleted`;

    return res.status(200).json(reply);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

const likePoduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const product = await Product.findById(id).exec();
    if (!product) {
      return res
        .status(400)
        .json({ message: `There is no product with the ID: ${id}` });
    }
    const isLiked = product.likes.get(userId);

    if (isLiked) {
      product.likes.delete(userId);
    } else {
      product.likes.set(userId, true);
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { likes: product.likes },
      { new: true }
    );

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const addComents = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, comment } = req.body;
    if (!comment)
      return res.status(400).json({ message: `Please enter your comment` });
    const product = await Product.findById(id).exec();
    if (!product) {
      return res
        .status(400)
        .json({ message: `There is no product with the ID: ${id}` });
    }
    const newComent = {
      commentId: v4(),
      userId: userId,
      comment: comment,
    };
    if (newComent) {
      product.comments = [...product.comments, newComent];
    }
    const addcomment = await Product.findByIdAndUpdate(
      id,
      { comments: product.comments },
      { new: true }
    );

    res.status(200).json(addcomment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

const deletComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, commentId } = req.body;
    if (!commentId || !userId)
      return res.status(400).json({ message: `sommthing want worng` });
    const product = await Product.findById(id).exec();
    if (!product) {
      return res
        .status(400)
        .json({ message: `There is no product with the ID: ${id}` });
    }
    const oldArry = product.comments.filter((ele) => ele.userId !== userId);
    const newArray = product.comments.filter((ele) => ele.userId === userId);
    if (!newArray)
      return res.status(400).json({ message: `there is no comment to remove` });
    const comment = newArray.filter((ele) => ele.commentId !== commentId);
    product.comments = [...oldArry, ...comment];

    const removecomment = await Product.findByIdAndUpdate(
      id,
      { comments: product.comments },
      { new: true }
    );

    res.status(200).json(removecomment);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};
const setHero = async (req, res) => {
  try {
    const { images } = req.body;
    if (!images)
      return res.status(400).json({ message: "All fields are required" });
    const newProdct = {
      images,
    };
    const pro = await Hero.create(newProdct);

    if (pro) {
      //created
      return res.status(201).json({ message: `New Hero is created` });
    } else {
      return res.status(400).json({ message: "Invalid Hero data received" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getHero = async (req, res) => {
  try {
    const he = await Hero.find().lean();

    if (he) {
      //created
      return res.status(201).json(he);
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  getOneProduct,
  deletProduct,
  likePoduct,
  addComents,
  deletComment,
  getProductByFamily,
  filtedData,
  setHero,
  getHero,
};
