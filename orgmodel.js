const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExampleSchema = new Schema({
  name: { type: String, required: true },
  accessCode: {
    type: String,
    slug: ["name"],
    transform: (v) => v.split(" ")[0],
    unique: true,
    index: true,
  },
  domains: [{ type: String, required: true }],
  sub_domain: { type: String, unique: true, required: true },
  chat_widget: {
    type: { type: String, enum: ["CHAT", "VIDEO", "OTHER"] },
    embed_link: { type: String },
    direct_link: { type: String },
  },
  logo: { type: String, required: true },
  branding_logo: { type: String },
  emails: [{ type: String }],
  region: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mind_Region",
      required: true,
    },
  ],
  plans: [{ type: mongoose.Schema.Types.ObjectId, ref: "Mind_Plan" }],
  is_boat_enabled: { type: Boolean, default: false, required: true },
  is_mci_enabled: { type: Boolean, default: false, required: true },
  is_deactivated: { type: Boolean, default: false },
  is_therapy_enabled: { type: Boolean, default: false, required: true },
  is_premium_therapy_active: { type: Boolean, default: false, required: true },
  is_self_care_enabled: { type: Boolean, default: false, required: true },
  is_community_enabled: { type: Boolean, default: true, required: true },
  is_promo_active: { type: Boolean, default: false },
  is_gift_sending_enabled: { type: Boolean, default: true, required: true },
  is_diagnostic_test_enabled: { type: Boolean, default: true, required: true },
  is_analytics_pipeline_active: {
    type: Boolean,
    default: true,
    required: true,
  },
  email_templates: { type: Object, required: true },
  is_journal_club_enabled: { type: Boolean, default: false, required: true },
  mci_type: { type: String, default: "MCI" },
  free_credit_config: {
    credits: { type: Number, default: 0 },
    expiry_date: { type: Date },
    renew_date: { type: Date },
    frequency: { type: String, enum: ["LIFETIME", "MONTHLY", "YEARLY"] },
  },
});

module.exports = mongoose.model("ExampleModel", ExampleSchema);
