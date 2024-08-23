const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const RegionSchema = new Schema({
  name: { type: String, required: true },
  code: { type: String, unique: true, required: true },
  flag: { type: String, required: true },
  languages: [{ type: String, required: true }],
  country_code: { type: String, required: true },
  payment_gateway: {
    type: String,
    //enum: EnumPaymentGateway.values,
    required: true,
  },
  currency: {
    code: { type: String, required: true },
    symbol: { type: String, required: true },
  },
  tax: {
    kind: { type: String, required: true },
    rate: { type: Number, required: true },
  },
  timezone: {
    timezone: { type: String, required: true },
    utc: { type: String, required: true },
    offset: { type: Number, required: true },
  },
  is_journal_club_enabled: {
    type: Boolean,
    default: false,
    required: true,
  },
  is_community_enabled: { type: Boolean, default: true, required: true },
  is_gift_sending_enabled: { type: Boolean, default: true, required: true },
  is_self_care_enabled: { type: Boolean, default: false, required: true },
  created_at: { type: Date, required: true },
  updated_at: { type: Date, required: true },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mind_User",
    required: true,
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Mind_User",
    required: true,
  },
});

module.exports = mongoose.model("RegionModel", RegionSchema);
