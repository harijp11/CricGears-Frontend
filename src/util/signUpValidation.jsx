export const validateSignupForm = ({ username, email, password, confirm, phone }) => {
    const errors = {};
  
    // Username validation: must be letters and underscores only
    if (!username.trim()) {
      errors.username = "Username is required";
    } else if (!/^[A-Za-z_]+$/.test(username)) {
      errors.username = "Username can only contain letters and underscores";
    } else if (username.length < 3) {
      errors.username = "Username must be at least 3 characters";
    }
  
    // Email validation
    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      errors.email = "Invalid email address";
    }
  
    // Password validation: must be at least 8 characters, include one uppercase letter, one special character, and no whitespaces
    if (!password.trim()) {
      errors.password = "Password is required";
    } else if (password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must include at least one uppercase letter";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.password = "Password must include at least one special character";
    } else if (/\s/.test(password)) {
      errors.password = "Password must not contain spaces";
    }
  
    // Confirm password validation
    if (confirm !== password) {
      errors.confirm = "Passwords do not match";
    }
  
    // Phone number validation
    if (phone && !/^\d{10}$/.test(phone)) {
      errors.phone = "Phone number must be 10 digits";
    }
  
    return errors;
  };
  