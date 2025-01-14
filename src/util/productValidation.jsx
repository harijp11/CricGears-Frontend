export default function validateProduct({
  name,
  price,
  salePrice,
  description,
  sizes,
  catId,
  croppedImages
}) {
  const errors = {};

  // Name validation with hyphen allowed
  const nameRegex = /^[a-zA-Z0-9\s-]+$/; 
  const letterRegex = /[a-zA-Z]/; 

  if (!name || name.trim() === '') {
      errors.name = 'Product name is required';
  } else if (!nameRegex.test(name)) {
      errors.name = 'Product name can only contain letters, numbers, spaces, and hyphens';
  } else if (!letterRegex.test(name)) {
      errors.name = 'Product name must include at least one letter';
  } else if (name.length < 3) {
      errors.name = 'Product name must be at least 3 characters long';
  } else if (name.length > 100) {
      errors.name = 'Product name cannot exceed 100 characters';
  }

  // Price validations
  const priceValue = parseFloat(price);
  const salePriceValue = parseFloat(salePrice);

  if (!price || isNaN(priceValue) || priceValue <= 0) {
      errors.price = 'Valid price is required';
  } else if (priceValue > 100000) {
      errors.price = 'Price is too high';
  }

  if (!salePrice || isNaN(salePriceValue) || salePriceValue < 0) {
      errors.salePrice = 'Valid sale price is required';
  } else if (salePriceValue > priceValue) {
      errors.salePrice = 'Sale price cannot be higher than original price';
  }

  // Description validation
  if (!description || description.trim() === '') {
      errors.description = 'Product description is required';
  } else if (description.length < 10) {
      errors.description = 'Description must be at least 10 characters long';
  } else if (description.length > 1000) {
      errors.description = 'Description cannot exceed 1000 characters';
  }

  // Sizes validation
  const totalStock = sizes.reduce((sum, sizeItem) => sum + sizeItem.stock, 0);
  if (totalStock === 0) {
      errors.sizes = 'At least one size must have stock';
  }

  // Category validation
  if (!catId) {
      errors.catId = 'Category must be selected';
  }

  // Images validation
  if (!croppedImages || croppedImages.length === 0 || croppedImages.every(img => !img)) {
      errors.croppedImages = 'At least one product image is required';
  }

  return errors;
}