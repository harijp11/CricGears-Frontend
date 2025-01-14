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
  if (!code.trim()) {
    errors.code = "Coupon code is required";
  } else if (!/^[A-Z0-9]{4,12}$/.test(code)) {
    errors.code =
      "Code must be 4-12 characters, uppercase letters and numbers only";
  }

  // Description validation
  if (!description.trim()) {
    errors.description = "Description is required";
  } else if (description.length > 100) {
    errors.description = "Description must be less than 100 characters";
  }

  // Discount value validation
  const discountNum = parseFloat(discountValue);
  if (!discountNum) {
    errors.discountValue = "Discount value is required";
  } else if (discountNum <= 0 || discountNum > 100) {
    errors.discountValue = "Discount must be between 0 and 100";
  }

  // Minimum purchase validation
  const minPurchaseNum = parseFloat(minPurchaseAmount);

  if (!minPurchaseAmount && minPurchaseAmount !== 0) {
      errors.minPurchaseAmount = "Minimum purchase amount is required.";
  } else if (isNaN(minPurchaseNum)) {
      errors.minPurchaseAmount = "Minimum purchase amount must be a valid number.";
  } else if (minPurchaseNum < 0) {
      errors.minPurchaseAmount = "Minimum purchase amount cannot be negative.";
  } else if (minPurchaseNum === 0) {
      errors.minPurchaseAmount = "Minimum purchase amount cannot be zero.";
  } else if (minPurchaseNum > 10000) {
      errors.minPurchaseAmount = "Minimum purchase amount cannot exceed 10,000.";
  }else if (minPurchaseNum < 500) {
    errors.minPurchaseAmount = "Minimum purchase atleast 500.";
}

  // Maximum discount validation
  const maxDiscount = parseFloat(maxDiscountAmount);
  if (maxDiscount < 0) {
    errors.maxDiscountAmount = "Maximum discount cannot be negative";
  } 

  // Expiration date validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expDate = new Date(expirationDate);
  if (!expirationDate) {
    errors.expirationDate = "Expiration date is required";
  } else if (expDate < today) {
    errors.expirationDate = "Expiration date cannot be in the past";
  }

  // Usage limit validation
  const usageLimitNum = parseInt(usageLimit, 10);

  if (!usageLimit) {
    errors.usageLimit = "Usage limit is required.";
  } else if (isNaN(usageLimitNum)) {
    errors.usageLimit = "Usage limit must be a valid number.";
  } else if (!Number.isInteger(usageLimitNum)) {
    errors.usageLimit = "Usage limit must be an integer.";
  } else if (usageLimitNum < 1) {
    errors.usageLimit = "Usage limit must be at least 1.";
  } else if (usageLimitNum > 10) {
    errors.usageLimit = "Usage limit cannot exceed 10.";
  }

  return errors;
};
