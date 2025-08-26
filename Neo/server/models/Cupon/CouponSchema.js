const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true }, // kupon kodu
  discountType: { type: String, enum: ["percentage", "fixed"], required: true }, // faiz və ya sabit
  discountValue: { type: Number, required: true }, // endirim dəyəri (məs. 20%)
  minPurchase: { type: Number, default: 0 }, // min məbləğ (opsional)
  expiryDate: { type: Date, required: true }, // bitmə tarixi
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Coupon", couponSchema);
