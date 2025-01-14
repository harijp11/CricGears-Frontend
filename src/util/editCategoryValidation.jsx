import axiosInstance from "../AxiosInstance";
import {toast} from "sonner"
// Validate Category Name
export const validateCategoryName = (name) => {
  const errors = {};

  if (!name || name.trim() === '') {
    errors.name = 'Category name is required';
  } else if (name.trim().length < 3) {
    errors.name = 'Category name must be at least 3 characters long';
  } else if (name.trim().length > 50) {
    errors.name = 'Category name cannot exceed 50 characters';
  }

  return errors;
};

// Validate Category Description
export const validateCategoryDescription = (description) => {
  const errors = {};

  if (!description || description.trim() === '') {
    errors.description = 'Description is required';
  } else if (description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters long';
  } else if (description.trim().length > 500) {
    errors.description = 'Description cannot exceed 500 characters';
  }

  return errors;
};

// Check Category Existence (Async)
export const checkCategoryExistence = async (name, currentId) => {
  try {
    const response = await axiosInstance.post('/admin/categories/check', { 
      name, 
      currentId // Pass current category ID to exclude from duplicate check
    });
    
    if (!response.data.success) {
      return { exists: true, error: 'Category already exists' };
    }
    
    return { exists: false, error: '' };
  } catch (error) {
    toast.error("Category already existing pleasing try again",error);
    return { exists: true, error: 'Category is already exist' };
  }
};

// Comprehensive Validation Function
export const validateCategory = async (name, description, currentId) => {
  // Validate Name
  const nameErrors = validateCategoryName(name);
  if (Object.keys(nameErrors).length > 0) {
    return { isValid: false, errors: nameErrors };
  }

  // Validate Description
  const descriptionErrors = validateCategoryDescription(description);
  if (Object.keys(descriptionErrors).length > 0) {
    return { isValid: false, errors: descriptionErrors };
  }

  // Check Category Existence
  const existenceCheck = await checkCategoryExistence(name, currentId);
  if (existenceCheck.exists) {
    return { 
      isValid: false, 
      errors: { name: existenceCheck.error } 
    };
  }

  // All validations passed
  return { isValid: true, errors: {} };
};