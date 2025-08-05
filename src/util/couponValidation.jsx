// utils/validation.js
export const validateCouponForm = ({
  code,
  description,
  discountValue,
  minPurchaseAmount,
  maxDiscountAmount,
  expirationDate,
  usageLimit,
}) => {
  const errors = {};

  // Coupon code validation
  if (!code || !code.trim()) {
    errors.code = "Coupon code is required";
  } else if (!/^[A-Z0-9]{4,12}$/.test(code.trim())) {
    errors.code = "Code must be 4-12 characters, uppercase letters and numbers only";
  }

  // Description validation
  if (!description || !description.trim()) {
    errors.description = "Description is required";
  } else if (description.trim().length > 100) {
    errors.description = "Description must be less than 100 characters";
  }

  // Discount value validation
  const discountNum = parseFloat(discountValue);
  if (!discountValue && discountValue !== 0) {
    errors.discountValue = "Discount value is required";
  } else if (isNaN(discountNum)) {
    errors.discountValue = "Discount value must be a valid number";
  } else if (discountNum <= 0) {
    errors.discountValue = "Discount value must be greater than 0";
  } else if (discountNum > 90) {
    errors.discountValue = "Discount value cannot exceed 90%";
  }

  // Minimum purchase amount validation
  const minPurchaseNum = parseFloat(minPurchaseAmount);
  if (!minPurchaseAmount && minPurchaseAmount !== 0) {
    errors.minPurchaseAmount = "Minimum purchase amount is required";
  } else if (isNaN(minPurchaseNum)) {
    errors.minPurchaseAmount = "Minimum purchase amount must be a valid number";
  } else if (minPurchaseNum < 0) {
    errors.minPurchaseAmount = "Minimum purchase amount cannot be negative";
  } else if (minPurchaseNum < 500) {
    errors.minPurchaseAmount = "Minimum purchase amount must be at least 500";
  } else if (minPurchaseNum > 10000) {
    errors.minPurchaseAmount = "Minimum purchase amount cannot exceed 10,000";
  }

  // Maximum discount amount validation
  const maxDiscountNum = parseFloat(maxDiscountAmount);
  if (maxDiscountAmount && maxDiscountAmount !== 0) {
    if (isNaN(maxDiscountNum)) {
      errors.maxDiscountAmount = "Maximum discount amount must be a valid number";
    } else if (maxDiscountNum < 0) {
      errors.maxDiscountAmount = "Maximum discount amount cannot be negative";
    } else if (maxDiscountNum > 10000) {
      errors.maxDiscountAmount = "Maximum discount amount cannot exceed 10,000";
    }
  }

  // Cross-validation: Max discount should not exceed min purchase amount
  if (minPurchaseNum && maxDiscountNum && maxDiscountNum >= minPurchaseNum) {
    errors.maxDiscountAmount = "Maximum discount amount must be less than minimum purchase amount";
  }

  // Expiration date validation
  if (!expirationDate) {
    errors.expirationDate = "Expiration date is required";
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expDate = new Date(expirationDate);
    
    if (isNaN(expDate.getTime())) {
      errors.expirationDate = "Please enter a valid date";
    } else if (expDate < today) {
      errors.expirationDate = "Expiration date cannot be in the past";
    } else {
      // Optional: Add maximum future date limit (e.g., 1 year from now)
      const maxFutureDate = new Date();
      maxFutureDate.setFullYear(maxFutureDate.getFullYear() + 1);
      if (expDate > maxFutureDate) {
        errors.expirationDate = "Expiration date cannot be more than 1 year from now";
      }
    }
  }

  // Usage limit validation
  const usageLimitNum = parseInt(usageLimit, 10);
  if (!usageLimit && usageLimit !== 0) {
    errors.usageLimit = "Usage limit is required";
  } else if (isNaN(usageLimitNum)) {
    errors.usageLimit = "Usage limit must be a valid number";
  } else if (!Number.isInteger(usageLimitNum) || usageLimitNum !== parseFloat(usageLimit)) {
    errors.usageLimit = "Usage limit must be a whole number";
  } else if (usageLimitNum < 1) {
    errors.usageLimit = "Usage limit must be at least 1";
  } else if (usageLimitNum > 10000) {
    errors.usageLimit = "Usage limit cannot exceed 10,000";
  }

  return {
    errors,
    isValid: Object.keys(errors).length === 0
  };
};