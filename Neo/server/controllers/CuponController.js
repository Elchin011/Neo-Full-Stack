const CouponSchema = require("../models/Cupon/CouponSchema");

// // Kupon yaratmaq (Admin)
// exports.createCoupon = async (req, res) => {
//   try {
//     const coupon = new CouponSchema(req.body);
//     await coupon.save();
//     res.status(201).json(coupon);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };

// // Kupon siyahısı (Admin və ya istifadeçi)
// exports.getCoupons = async (req, res) => {
//   try {
//     const coupons = await CouponSchema.find();
//     res.json(coupons);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Kupon yoxlama (checkout zamanı)
// exports.validateCoupon = async (req, res) => {
//   try {
//     const { code, total } = req.body;
//     const coupon = await CouponSchema.findOne({ code, isActive: true });

//     if (!coupon) {
//       return res.status(404).json({ message: "Kupon tapılmadı" });
//     }
//     if (new Date() > coupon.expiryDate) {
//       return res.status(400).json({ message: "Kuponun vaxtı bitib" });
//     }
//     if (total < coupon.minPurchase) {
//       return res.status(400).json({ message: `Minimum alış ${coupon.minPurchase}₼` });
//     }

//     let discount = 0;
//     if (coupon.discountType === "percentage") {
//       discount = (total * coupon.discountValue) / 100;
//     } else {
//       discount = coupon.discountValue;
//     }

//     res.json({
//       success: true,
//       discount,
//       finalPrice: total - discount
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

const createCoupon = async (req, res) => {
  try {
    const coupon = new CouponSchema(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const getCoupons = async (req, res) => {
  try {
    const coupons = await CouponSchema.find();
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const validateCoupon = async (req, res) => {
  try {
    const { code, total } = req.body;
    const coupon = await CouponSchema.findOne({ code, isActive: true });
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ message: "Coupon has expired" });
    }
    if (total < coupon.minPurchase) {
      return res
        .status(400)
        .json({ message: `Minimum purchase ${coupon.minPurchase}$ is required` });
    }
    let discount = 0;
    if (coupon.discountType === "percentage") {
      discount = (total * coupon.discountValue) / 100;
    } else {
      discount = coupon.discountValue;
    }
    res.json({
      success: true,
      discount,
      finalPrice: total - discount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateCoupon = async (req, res) => {
  const { id } = req.params;
  const { code, discountType, discountValue, minPurchase, expiryDate, isActive } = req.body;
  try {
    const updatedCoupon = await CouponSchema.findByIdAndUpdate(
      id,
      { code: code,
        discountType: discountType,
        discountValue: discountValue,
        minPurchase: minPurchase,
        expiryDate: expiryDate,
        isActive: isActive },
      { new: true }
    );
    if (!updatedCoupon) {
      return res.status(404).json({ 
        message: "Coupon not found" 
      });
    }
    return res.status(200).json({ data: updatedCoupon });
  } catch (error) {
    console.error("Error in updateCoupon:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
module.exports = { createCoupon, getCoupons, validateCoupon, updateCoupon };
