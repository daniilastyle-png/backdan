const Hero = require("../modules/Hero");

const newHero = async (req, res) => {
  try {
    const { title, category, imagePath, description, per } = req.body;
    if (!title || !description || !category || !imagePath || !per)
      return res.status(400).json({ message: "All fields are required" });

    const newProdct = {
      title,
      category,
      description,
      imagePath,
      per,
    };
    const pro = await Hero.create(newProdct);

    if (pro) {
      //created
      return res.status(201).json({ message: `New Product ${title} created` });
    } else {
      return res.status(400).json({ message: "Invalid Product data received" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
const getHero = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Hero.findById(id).exec();
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

const updateHero = async (req, res) => {
  try {
    const { title, category, imagePath, description, per } = req.body;
    const { id } = req.params;
    const product = await Hero.findById(id).exec();
    if (!product) return res.status(404).json({ message: "hero not found" });
    product.title = title ? title : product.title;
    product.description = description ? description : product.description;
    product.category = category ? category : product.category;
    product.imagePath = imagePath ? imagePath : product.imagePath;
    product.per = per ? per : product.per;
    const updatedProduct = await product.save();

    return res.json({ message: `The hero with the ID:${id} is updated` });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
module.exports = {
  newHero,
  getHero,
  updateHero,
};
