const mongoose = require("mongoose");
const ExampleModel = require("./orgmodel");
const RegionModel = require("./regionmodel");
const CouponModel = require("./couponmodel");

async function validateCoupon(couponData) {
  // 1. Validate required fields
  const requiredFields = [
    "kind",
    "code",
    "value",
    "type",
    "slots_per_user",
    "expiry",
    "status",
    "created_at",
    "updated_at",
  ];
  for (let field of requiredFields) {
    if (!couponData[field]) {
      throw new Error(`Field '${field}' is required.`);
    }
  }

  // 2. Check if the code exists in the database
  const existingCoupon = await CouponModel.findOne({ code: couponData.code });
  if (existingCoupon) {
    throw new Error("Coupon code already exists in the database.");
  }

  const region = await RegionModel.findOne({
    country_code: couponData.country_code,
  });
  if (!region) {
    throw new Error("Invalid country code provided. No matching region found.");
  }

  // 3. Validate if the access_code exists in ExampleModel
  const organization = await ExampleModel.findOne({
    accessCode: couponData.access_code,
  });
  if (!organization) {
    throw new Error(
      "Invalid access code provided. No matching organization found."
    );
  }

  // 4. Validate kind and corresponding country_code
  const isIndia = couponData.country_code === "IN";
  const validKindsForIndia = ["COUPON_FLAT", "GIFT_SESSION"];
  const validKindsForOtherCountries = ["COUPON_RATE", "GIFT_SESSION"];

  if (isIndia && !validKindsForIndia.includes(couponData.kind)) {
    throw new Error(
      "For India (country code 'IN'), only 'COUPON_FLAT' and 'GIFT_SESSION' are allowed."
    );
  } else if (
    !isIndia &&
    !validKindsForOtherCountries.includes(couponData.kind)
  ) {
    throw new Error(
      "For non-India regions, only 'COUPON_RATE' and 'GIFT_SESSION' are allowed."
    );
  }

  // 5. Validate kind and corresponding value range
  if (couponData.kind === "COUPON_RATE") {
    if (couponData.value <= 0 || couponData.value >= 100) {
      throw new Error("Value must be between 0% and 100% for COUPON_RATE.");
    }
  } else if (couponData.kind === "COUPON_FLAT") {
    if (couponData.value < 0 || couponData.value > 100) {
      throw new Error("Value must be between 0 and 100 for COUPON_FLAT.");
    }
  } else if (
    !["GIFT_SESSION", "COUPON_FLAT", "COUPON_RATE"].includes(couponData.kind)
  ) {
    throw new Error(
      "Invalid kind value. Must be 'GIFT_SESSION', 'COUPON_FLAT', or 'COUPON_RATE'."
    );
  }

  // 6. Validate type
  if (
    !["SESSION", "BOAT", "GIFT", "REFERRAL", "REFERRAL_REWARD"].includes(
      couponData.type
    )
  ) {
    throw new Error(
      "Invalid type value. Must be 'SESSION', 'BOAT', 'GIFT', 'REFERRAL', or 'REFERRAL_REWARD'."
    );
  }

  // 7. Validate plan_categories (if present)
  if (couponData.plan_categories) {
    const validPlanCategories = [
      "PREMIUM_SINGLE_SESSION_PLAN",
      "STANDARD_SINGLE_SESSION_PLAN",
    ];
    for (let category of couponData.plan_categories) {
      if (!validPlanCategories.includes(category)) {
        throw new Error(`Invalid plan category: ${category}`);
      }
    }
  }

  // 8. Validate slots and slots_per_user
  if (
    couponData.slots !== undefined &&
    couponData.slots <= couponData.slots_per_user
  ) {
    throw new Error("Slots must be greater than slots per user.");
  }

  // 7. Validate status
  if (!["OPEN", "CLOSE"].includes(couponData.status)) {
    throw new Error("Invalid status value. Must be 'OPEN' or 'CLOSE'.");
  }

  // 9. Validate dates
  if (new Date(couponData.expiry) <= new Date()) {
    throw new Error("Expiry date must be in the future.");
  }
  if (
    couponData.activation_date &&
    new Date(couponData.activation_date) > new Date(couponData.expiry)
  ) {
    throw new Error("Activation date cannot be after the expiry date.");
  }

  // 10. Validate is_public, is_app_only, is_mobile_only, is_new_user_only (if present)
  const booleanFields = [
    "is_public",
    "is_app_only",
    "is_mobile_only",
    "is_new_user_only",
  ];
  for (let field of booleanFields) {
    if (
      couponData[field] !== undefined &&
      typeof couponData[field] !== "boolean"
    ) {
      throw new Error(`Field '${field}' must be a boolean.`);
    }
  }
  // 11. Validate region
  if (
    !couponData.region ||
    !Array.isArray(couponData.region) ||
    !couponData.region.length
  ) {
    errors.push("At least one region is required.");
  } else {
    couponData.region.forEach((regionId, index) => {
      if (!mongoose.Types.ObjectId.isValid(regionId)) {
        errors.push(`Region ID at index ${index} is invalid.`);
      }
    });
  }

  // 12. Validate created_at and updated_at
  if (new Date(couponData.created_at) > new Date(couponData.updated_at)) {
    throw new Error("Created date cannot be after updated date.");
  }

  // Return true if all validations pass
  return true;
}
module.exports = validateCoupon;
