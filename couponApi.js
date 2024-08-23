const express = require("express");
const mongoose = require("mongoose");
const validateCoupon = require("./couponvalidation");
const CouponModel = require("./couponmodel");

const app = express();

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/exampledb")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Create a new coupon
app.post("/api/coupons", async (req, res) => {
  try {
    // Validate coupon data
    await validateCoupon(req.body);

    // Create and save the coupon
    const coupon = new CouponModel(req.body);
    await coupon.save();
    res.status(201).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all coupons
app.get("/api/coupons", async (req, res) => {
  try {
    const coupons = await CouponModel.find().populate(
      "region organisation plans user created_by updated_by"
    );
    res.status(200).json(coupons);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get a coupon by ID
app.get("/api/coupons/:id", async (req, res) => {
  try {
    const coupon = await CouponModel.findById(req.params.id).populate(
      "region organisation plans user created_by updated_by"
    );
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a coupon by ID
app.put("/api/coupons/:id", async (req, res) => {
  try {
    // Validate coupon data
    await validateCoupon(req.body);

    // Find and update the coupon
    const coupon = await CouponModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("region organisation plans user created_by updated_by");
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a coupon by ID
app.delete("/api/coupons/:id", async (req, res) => {
  try {
    const coupon = await CouponModel.findByIdAndDelete(req.params.id);
    if (!coupon) {
      return res.status(404).json({ error: "Coupon not found" });
    }
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
