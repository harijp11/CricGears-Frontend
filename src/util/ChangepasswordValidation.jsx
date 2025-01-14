// utils/passwordValidation.js

export const validatePassword = (newPassword, confirmPassword) => {
    let errors = {};
  
    // New Password validation
    if (!newPassword) {
      errors.newPassword = "New password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters long";
    } else if (!/(?=.*[a-z])/.test(newPassword)) {
      errors.newPassword = "Password must contain at least one lowercase letter";
    } else if (!/(?=.*[A-Z])/.test(newPassword)) {
      errors.newPassword = "Password must contain at least one uppercase letter";
    } else if (!/(?=.*\d)/.test(newPassword)) {
      errors.newPassword = "Password must contain at least one number";
    } else if (!/(?=.*[@$!%*?&])/.test(newPassword)) {
      errors.newPassword = "Password must contain at least one special character";
    }
  
    // Confirm Password validation
    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (confirmPassword !== newPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
  
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };