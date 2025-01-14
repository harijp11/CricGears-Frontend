export const validateEditProduct = (formData) => {
    const errors = {};
  
    // Helper function to convert to string and trim
    const safeString = (value) => {
      if (value === null || value === undefined) return '';
      return String(value).trim();
    };
  
    // Validate Name with updated regex
    const nameRegex = /^[a-zA-Z][a-zA-Z0-9\s-]*[a-zA-Z0-9]$/;
    const letterRegex = /[a-zA-Z]/;
    const name = safeString(formData.editName);
  
    if (name === '') {
      errors.editName = 'Product name is required';
    } else if (!nameRegex.test(name)) {
      errors.editName = 'Product name must start and end with a letter or number, can contain letters, numbers, spaces, and hyphens';
    } else if (!letterRegex.test(name)) {
      errors.editName = 'Product name must include at least one letter';
    } else if (name.length < 3) {
      errors.editName = 'Product name must be at least 3 characters long';
    } else if (name.length > 100) {
      errors.editName = 'Product name cannot exceed 100 characters';
    }
  
    // Validate Description
    const description = safeString(formData.editDescription);
    if (description === '') {
      errors.editDescription = 'Product description is required';
    } else if (description.length < 10) {
      errors.editDescription = 'Description must be at least 10 characters long';
    }
  
    // Validate Price
    const priceRegex = /^\d+(\.\d{1,2})?$/;
    const price = safeString(formData.editPrice);
    if (price === '') {
      errors.editPrice = 'Price is required';
    } else if (!priceRegex.test(price)) {
      errors.editPrice = 'Invalid price format. Use numbers with up to 2 decimal places';
    } else {
      const numPrice = parseFloat(price);
      if (isNaN(numPrice) || numPrice <= 0) {
        errors.editPrice = 'Price must be a positive number';
      }
    }
  
    // Validate Sale Price
    const salePrice = safeString(formData.editSalePrice);
    if (salePrice !== '') {
      if (!priceRegex.test(salePrice)) {
        errors.editSalePrice = 'Invalid sale price format. Use numbers with up to 2 decimal places';
      } else {
        const numPrice = parseFloat(price);
        const numSalePrice = parseFloat(salePrice);
        if (numSalePrice > numPrice) {
          errors.editSalePrice = 'Sale price cannot be higher than the original price';
        }
      }
    }
  
    // Validate Category
    if (!formData.editCategory) {
      errors.editCategory = 'Please select a category';
    }
  
    // Validate Images
    const totalImages = [
      ...(formData.croppedImages || []),
      ...(formData.editImages || [])
    ].filter(image => image);
  
    if (totalImages.length < 3) {
      errors.editImages = 'Minimum 3 images are required';
    }
  
    // Validate Sizes
    if (!formData.editSizes || formData.editSizes.length === 0) {
      errors.editSizes = 'At least one size with stock is required';
    }
  
    return errors;
  };