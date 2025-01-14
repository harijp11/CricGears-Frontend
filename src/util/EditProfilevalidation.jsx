// utils/profileValidation.js

export const validateProfile = (formData) => {
    let errors = {};
    
    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Name must be at least 3 characters";
    } else if (!/^[a-zA-Z\s]*$/.test(formData.name)) {
      errors.name = "Name can only contain letters and spaces";
    }
  
    // Phone validation
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      errors.phone = "Phone number must be exactly 10 digits";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };