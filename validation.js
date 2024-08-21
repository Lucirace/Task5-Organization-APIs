const mongoose = require("mongoose");
const ExampleModel = require("./orgmodel");

const VALID_CHAT_WIDGET_TYPES = ["CHAT", "VIDEO", "OTHER"];

// Validation function
const validateExample = async (data) => {
  const errors = [];

  // Validate name
  if (!data.name) {
    errors.push("Name is required.");
  } else if (typeof data.name !== "string") {
    errors.push("Name must be a string.");
  }

  // Validate accessCode
  if (data.accessCode) {
    if (typeof data.accessCode !== "string") {
      errors.push("Access code must be a string.");
    } else {
      // Check if accessCode already exists
      const existingCode = await ExampleModel.findOne({
        accessCode: data.accessCode,
      });
      if (existingCode) {
        errors.push("Access code already exists.");
      }
    }
  }

  // Validate domains
  if (!data.domains || !Array.isArray(data.domains) || !data.domains.length) {
    errors.push("At least one domain is required.");
  } else {
    data.domains.forEach((domain, index) => {
      if (typeof domain !== "string") {
        errors.push(`Domain at index ${index} must be a string.`);
      }
    });
  }

  // Validate sub_domain
  if (!data.sub_domain) {
    errors.push("Sub-domain is required.");
  } else if (typeof data.sub_domain !== "string") {
    errors.push("Sub-domain must be a string.");
  }

  // Validate chat_widget
  if (data.chat_widget) {
    if (!VALID_CHAT_WIDGET_TYPES.includes(data.chat_widget.type)) {
      errors.push("Invalid chat widget type.");
    }
    if (
      data.chat_widget.embed_link &&
      typeof data.chat_widget.embed_link !== "string"
    ) {
      errors.push("Chat widget embed link must be a string.");
    }
    if (
      data.chat_widget.direct_link &&
      typeof data.chat_widget.direct_link !== "string"
    ) {
      errors.push("Chat widget direct link must be a string.");
    }
  }

  // Validate logo
  if (!data.logo) {
    errors.push("Logo is required.");
  } else if (typeof data.logo !== "string") {
    errors.push("Logo must be a string.");
  }

  // Validate branding_logo
  if (data.branding_logo && typeof data.branding_logo !== "string") {
    errors.push("Branding logo must be a string.");
  }

  // Validate emails
  if (
    data.emails &&
    (!Array.isArray(data.emails) ||
      data.emails.some((email) => typeof email !== "string"))
  ) {
    errors.push("Emails must be an array of strings.");
  }

  // Validate region
  if (!data.region || !Array.isArray(data.region) || !data.region.length) {
    errors.push("At least one region is required.");
  } else {
    data.region.forEach((regionId, index) => {
      if (!mongoose.Types.ObjectId.isValid(regionId)) {
        errors.push(`Region ID at index ${index} is invalid.`);
      }
    });
  }

  // Validate boolean fields
  const booleanFields = [
    "is_boat_enabled",
    "is_mci_enabled",
    "is_deactivated",
    "is_therapy_enabled",
    "is_premium_therapy_active",
    "is_self_care_enabled",
    "is_community_enabled",
    "is_promo_active",
    "is_gift_sending_enabled",
    "is_diagnostic_test_enabled",
    "is_analytics_pipeline_active",
    "is_journal_club_enabled",
  ];
  booleanFields.forEach((field) => {
    if (data[field] !== undefined && typeof data[field] !== "boolean") {
      errors.push(`${field} must be a boolean.`);
    }
  });

  // Validate mci_type
  if (data.mci_type && typeof data.mci_type !== "string") {
    errors.push("MCI type must be a string.");
  }

  // Validate free_credit_config
  if (data.free_credit_config) {
    if (
      data.free_credit_config.credits !== undefined &&
      typeof data.free_credit_config.credits !== "number"
    ) {
      errors.push("Free credit config 'credits' must be a number.");
    }
    if (data.free_credit_config.expiry_date) {
      const expiryDate = data.free_credit_config.expiry_date;

      // Check if expiry_date is a string and try to parse it into a Date object
      if (typeof expiryDate === "string") {
        const parsedDate = new Date(expiryDate);

        // Check if the parsed date is valid
        if (isNaN(parsedDate.getTime())) {
          errors.push(
            "Free credit config 'expiry date' must be a valid date string."
          );
        }
      } else if (!(expiryDate instanceof Date)) {
        // If expiry_date is not a string or a valid Date object, throw an error
        errors.push(
          "Free credit config 'expiry date' must be a valid Date object."
        );
      }
    }
    if (data.free_credit_config.renew_date) {
      const renewDate = data.free_credit_config.renew_date;

      if (typeof renewDate === "string") {
        const parsedDate = new Date(renewDate);

        if (isNaN(parsedDate.getTime())) {
          errors.push(
            "Free credit config 'renew date' must be a valid date string."
          );
        }
      } else if (!(renewDate instanceof Date)) {
        errors.push(
          "Free credit config 'renew date' must be a valid Date object."
        );
      }
    }
    if (
      data.free_credit_config.frequency &&
      !["LIFETIME", "MONTHLY", "YEARLY"].includes(
        data.free_credit_config.frequency
      )
    ) {
      errors.push(
        "Free credit config 'frequency' must be one of 'LIFETIME', 'MONTHLY', or 'YEARLY'."
      );
    }
  }

  // Validate email_templates
  if (!data.email_templates || typeof data.email_templates !== "object") {
    errors.push("Email templates must be an object and is required.");
  }

  return errors;
};
module.exports = validateExample;
