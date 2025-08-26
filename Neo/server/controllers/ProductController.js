const ProductSchema = require("../models/Product/ProductSchema");
const ProductColorSchema = require("../models/Product/ProductColorSchema");
const ProductSizesSchema = require("../models/Product/ProductSizesSchema");
const ProductCategoriesSchema = require("../models/Product/ProductCategorySchema");
const UserSchema = require("../models/User/UserSchema");
const OrderSchema = require("../models/Order/OrderSchema");
const ProductCategorySchema = require("../models/Product/ProductCategorySchema");
const Coupon = require("../models/Cupon/CouponSchema");

const getAllProducts = async (req, res) => {
  try {
    const { category, color, size } = req.query;

    let filter = {};

    // category, color və size üçün id ilə filter
    if (category) {
      filter.categories = category; // id ilə
    }
    if (color) {
      filter.colors = color; // id ilə
    }
    if (size) {
      filter.sizes = size; // id ilə
    }

    let products = await ProductSchema.find(filter)
      .populate("categories")
      .populate("sizes")
      .populate("colors");

    // Əgər id-lə filterdən nəticə gəlməzsə, ad ilə filter etməyə çalışaq:
    // Bunun üçün products boşdursa və hər hansı filter mövcuddursa
    if ((!products || products.length === 0) && (category || color || size)) {
      // Mongoose da match ilə populate edirik:
      products = await ProductSchema.find()
        .populate({
          path: "categories",
          match: category
            ? { $or: [{ _id: category }, { name: category }] }
            : {},
        })
        .populate({
          path: "colors",
          match: color ? { $or: [{ _id: color }, { name: color }] } : {},
        })
        .populate({
          path: "sizes",
          match: size ? { $or: [{ _id: size }, { name: size }] } : {},
        });

      // İndi də filterləyirik ki, seçilmiş filterə uyğun olmayanlar kənarda qalsın:
      products = products.filter((p) => {
        // category yoxdursa true, yoxdursa productun categories array-i boş olmamalıdır
        const catMatch = category ? p.categories.length > 0 : true;
        const colorMatch = color ? p.colors.length > 0 : true;
        const sizeMatch = size ? p.sizes.length > 0 : true;
        return catMatch && colorMatch && sizeMatch;
      });
    }

    if (!products || products.length === 0) {
      return res.status(404).json({
        message: "No products found",
      });
    }

    return res.status(200).json({
      data: products,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const getAllColors = async (req, res) => {
  const colors = await ProductColorSchema.find();
  if (!colors || colors.length === 0) {
    return res.status(200).json({
      message: "No colors found",
      data: [],
    });
  }
  return res.status(200).json({
    data: colors,
  });
};

const getAllSizes = async (req, res) => {
  const sizes = await ProductSizesSchema.find();
  if (!sizes || sizes.length === 0) {
    return res.status(404).json({
      message: "No sizes found",
    });
  }
  return res.status(200).json({
    data: sizes,
  });
};
const createProductSize = async (req, res) => {
  const { name } = req.body;
  const exsistingName = await ProductSizesSchema.findOne({ name: name });
  if (exsistingName) {
    return res.status(400).json({
      message: "Size already exists",
    });
  }
  const newSize = new ProductSizesSchema({
    name: name,
  });
  await newSize.save();
  return res.status(201).json({
    message: "Size created successfully",
    data: newSize,
  });
};

const deleteProductSize = async (req, res) => {
  const { id } = req.params;
  const size = await ProductSizesSchema.findByIdAndDelete(id);
  if (!size) {
    return res.status(404).json({
      message: "Size not found",
    });
  }
  return res.status(200).json({
    message: "Size deleted successfully",
  });
};

const createProductColor = async (req, res) => {
  const { name, code } = req.body;
  const exsistingColor = await ProductColorSchema.findOne({ name: name });
  if (exsistingColor) {
    return res.status(400).json({
      message: "Color already exists",
    });
  }
  const newColor = new ProductColorSchema({
    name: name,
    code: code,
  });
  await newColor.save();
  return res.status(201).json({
    message: "Color created successfully",
    data: newColor,
  });
};

const deleteProductColor = async (req, res) => {
  const { id } = req.params;
  const color = await ProductColorSchema.findByIdAndDelete(id);
  if (!color) {
    return res.status(404).json({
      message: "Color not found",
    });
  }
  return res.status(200).json({
    message: "Color deleted successfully",
  });
};

const getAllCategories = async (req, res) => {
  const categories = await ProductCategoriesSchema.find();
  if (!categories || categories.length === 0) {
    return res.status(404).json({
      message: "No categories found",
    });
  }
  return res.status(200).json({
    data: categories,
  });
};

const createProductCategory = async (req, res) => {
  const { name } = req.body;
  const exsistingCategory = await ProductCategoriesSchema.findOne({
    name: name,
  });
  if (exsistingCategory) {
    return res.status(400).json({
      message: "Category already exists",
    });
  }
  const newCategory = new ProductCategoriesSchema({
    name: name,
  });
  await newCategory.save();
  return res.status(201).json({
    message: "Category created successfully",
    data: newCategory,
  });
};

const deleteProductCategory = async (req, res) => {
  const { id } = req.params;
  const category = await ProductCategoriesSchema.findByIdAndDelete(id);
  if (!category) {
    return res.status(404).json({
      message: "Category not found",
    });
  }
  return res.status(200).json({
    message: "Category deleted successfully",
  });
};

// const createProduct = async (req, res) => {
//   const { name, price, description, categories, stockQuantity, sizes, colors } =
//     req.body;
//   const exsistingProduct = await ProductSchema.findOne({ name: name });
//   if (exsistingProduct) {
//     return res.status(400).json({
//       message: "Product already exists",
//     });
//   }
//   const newProduct = new ProductSchema({
//     name: name,
//     price: price,
//     description: description,
//     imageUrl: req.file.path,
//     categories: categories,
//     stockQuantity: stockQuantity,
//     sizes: sizes,
//     colors: colors,
//   });
//   await newProduct.save();
//   return res.status(201).json({
//     message: "Product created successfully",
//     data: newProduct,
//   });
// };

// const createProduct = async (req, res) => {
//   const { name, price, description, categories, stockQuantity, sizes, colors } =
//     req.body;

//   if (!name || !price || !description || !categories || !stockQuantity) {
//     return res.status(400).json({
//       message: "All fields are required",
//     });
//   }

//   const exsistingProduct = await ProductSchema.findOne({ name: name });
//   if (exsistingProduct) {
//     return res.status(400).json({
//       message: "Product already exists",
//     });
//   }

//   const newProduct = new ProductSchema({
//     name: name,
//     price: price,
//     description: description,
//     imageUrl: req.file ? req.file.path : null,
//     categories: categories,
//     stockQuantity: stockQuantity,
//     sizes: sizes,
//     colors: colors,
//   });

//   await newProduct.save();
//   return res.status(201).json({
//     message: "Product created successfully",
//     data: newProduct,
//     });
// };

const createProduct = async (req, res) => {
  const { name, price, description, categories, stockQuantity, sizes, colors } =
    req.body;

  // Boş və ya yanlış tip yoxlamasını daha dəqiq etmək üçün:
  if (
    !name ||
    !price ||
    !categories ||
    stockQuantity === undefined || // boş string yox, undefined yoxla
    stockQuantity === "" // ayrıca boş string yoxla
  ) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  // Əlavə: price və stockQuantity sayı kimi qəbul et
  const parsedPrice = Number(price);
  const parsedStockQuantity = Number(stockQuantity);

  if (isNaN(parsedPrice) || isNaN(parsedStockQuantity)) {
    return res.status(400).json({
      message: "Price and stockQuantity must be numbers",
    });
  }

  // Sənəd yaradanda Number dəyərləri istifadə et
  const newProduct = new ProductSchema({
    name,
    price: parsedPrice,
    imageUrl: req.file ? req.file.path : null,
    categories,
    stockQuantity: parsedStockQuantity,
    sizes,
    colors,
  });

  await newProduct.save();
  return res.status(201).json({
    message: "Product created successfully",
    data: newProduct,
  });
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await ProductSchema.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product tapilmadi" });
    }

    return res.status(200).json({ message: "Product ugurla silindi" });
  } catch (error) {
    console.error("Delete error:", error);
    return res.status(500).json({
      message: "Serverde xəta baş verdi",
      error: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, categories, stockQuantity, sizes, colors } =
    req.body;

  if (!name || !price || !categories || stockQuantity === undefined) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const parsedPrice = Number(price);
  const parsedStockQuantity = Number(stockQuantity);

  if (isNaN(parsedPrice) || isNaN(parsedStockQuantity)) {
    return res.status(400).json({
      message: "Price and stockQuantity must be numbers",
    });
  }

  const updateProduct = async (req, res) => {
    const { id } = req.params;
    const {
      name,
      price,
      description,
      categories,
      stockQuantity,
      sizes,
      colors,
    } = req.body;

    if (!name || !price || !categories || stockQuantity === undefined) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const parsedPrice = Number(price);
    const parsedStockQuantity = Number(stockQuantity);

    if (isNaN(parsedPrice) || isNaN(parsedStockQuantity)) {
      return res.status(400).json({
        message: "Price and stockQuantity must be numbers",
      });
    }
  };

  const updatedProduct = await ProductSchema.findByIdAndUpdate(
    id,
    {
      name,
      price: parsedPrice,
      description,
      imageUrl: req.file ? req.file.path : undefined,
      categories,
      stockQuantity: parsedStockQuantity,
      sizes,
      colors,
    },
    { new: true }
  );

  if (!updatedProduct) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  // ✅ Burada cavab göndər
  return res.status(200).json({
    message: "Product updated successfully",
    data: updatedProduct,
  });
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductSchema.findById(id)
      .populate("categories")
      .populate("sizes")
      .populate("colors");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({
      data: product,
      message: "Product fetched successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const {
      user,
      products,
      totalAmount,
      couponCode, // frontend-dən gəlir
      status = "pending",
      address,
      firstName,
      lastname,
      email,
      phone,
    } = req.body;

    if (
      !user ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "User and products are required" });
    }

    if (!totalAmount || isNaN(Number(totalAmount))) {
      return res
        .status(400)
        .json({ message: "Total amount is required and must be a number" });
    }

    // Kupon yoxlaması
    let discount = 0;
    let finalPrice = Number(totalAmount);

    let appliedCoupon = couponCode;
    try {
      appliedCoupon = JSON.parse(couponCode);
    } catch (e) {
      appliedCoupon = couponCode;
    }

    if (appliedCoupon) {
      const coupon = await Coupon.findOne({
        code: { $regex: `^${appliedCoupon.trim()}$`, $options: "i" },
        isActive: true,
      });
      
      if (coupon) {
        if (coupon.discountType === "percentage") {
          discount = (totalAmount * coupon.discountValue) / 100;
        } else {
          discount = coupon.discountValue;
        }
        finalPrice = totalAmount - discount;
      }
    }

    // User yoxla
    const foundUser = await UserSchema.findById(user);
    if (!foundUser) return res.status(404).json({ message: "User not found" });

    // Products yoxla
    const productIds = products.map((p) => p.product);
    const foundProducts = await ProductSchema.find({
      _id: { $in: productIds },
    });
    if (!foundProducts || foundProducts.length !== productIds.length) {
      return res
        .status(404)
        .json({ message: "One or more products not found" });
    }

    // Order yarat
    const newOrder = new OrderSchema({
      user,
      products,
      totalAmount: Number(totalAmount),
      discount: Number(discount.toFixed(2)),
      finalPrice: Number(finalPrice.toFixed(2)),
      status,
      address,
      firstName,
      lastname,
      email,
      phone,
    });

    await newOrder.save();

    return res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("CreateOrder error:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};



const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await OrderSchema.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllOrders = async (req, res) => {
  const userId = req.query.user;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const orders = await OrderSchema.find({ user: userId })
      .populate("user")
      .populate("products.product");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user" });
    }
    return res.status(200).json({
      data: orders,
      message: "User's orders fetched successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const getAllOrdersInDashboard = async (req, res) => {
  try {
    const orders = await OrderSchema.find()
      .populate("user")
      .populate("products.product");
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found" });
    }
    return res.status(200).json({
      data: orders,
      message: "All orders fetched successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) {
    return res.status(400).json({ message: "Status is required" });
  }
  try {
    const order = await OrderSchema.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    return res
      .status(200)
      .json({ message: "Order status updated", data: order });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getAllProducts,
  createOrder,
  getAllColors,
  getAllSizes,
  getAllCategories,
  createProductSize,
  createProductColor,
  createProductCategory,
  deleteProductCategory,
  createProduct,
  getAllOrders,
  getAllOrdersInDashboard,
  updateOrderStatus,
  deleteProduct,
  deleteProductSize,
  deleteProductColor,
  getProductById,
  deleteOrder,
  updateProduct,
};
