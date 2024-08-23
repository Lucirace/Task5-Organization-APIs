const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CouponSchema = new Schema({
  kind: {
    type: String,
    required: true,
    enum: ["GIFT_SESSION", "COUPON_FLAT", "COUPON_RATE"], // Enums for kind
  },
  code: { type: String, unique: true },
  value: { type: Number, default: 0 },
  region: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RegionModel",
      required: true,
    },
  ],
  country_code: { type: String },
  is_public: { type: Boolean, default: false },
  type: {
    type: String,
    required: true,
    enum: ["SESSION", "BOAT", "GIFT", "REFERRAL", "REFERRAL_REWARD"], // Enums for type
  },
  organisation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ExampleModel",
  },
  access_code: {
    type: String,
    required: true,
  },
  plan_categories: [
    {
      type: String,
      enum: ["PREMIUM_SINGLE_SESSION_PLAN", "STANDARD_SINGLE_SESSION_PLAN"], // Enums for plan_categories
      required: false,
    },
  ],
  plans: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mind_Plan",
      required: true,
    },
  ],
  cart: {
    item_count: { type: Number, required: false },
  },
  slots: { type: Number, required: false },
  slots_per_user: { type: Number, required: true },
  is_app_only: { type: Boolean, default: false },
  expiry: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["OPEN", "CLOSE"], // Enums for status
  },
  activation_date: { type: Date },
  is_mobile_only: { type: Boolean },
  is_new_user_only: { type: Boolean },
  description: { type: String },
  notes: { type: String },
  user: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mind_User",
    },
  ],
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mind_User",
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mind_User",
  },
});

module.exports = mongoose.model("CouponModel", CouponSchema);
