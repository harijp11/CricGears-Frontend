// Validation functions
const validateName = (name) => {
    if (!name.trim()) return "Name is required";
    if (name.length < 3) return "Name must be at least 3 characters long";
    if (!/^[a-zA-Z\s]+$/.test(name)) return "Name should only contain letters and spaces";
    return "";
  };
  
  const validateEmail = (email) => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };
  
  const validatePhone = (phone) => {
    if (!phone) return "Phone number is required";
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) return "Please enter a valid 10-digit phone number";
    return "";
  };
  
  const validateAddress = (address) => {
    if (!address.trim()) return "Address is required";
    if (address.length < 10) return "Please enter a complete address";
    return "";
  };
  
  const validatePincode = (pincode) => {
    if (!pincode) return "Pincode is required";
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(pincode)) return "Please enter a valid 6-digit pincode";
    return "";
  };
  const validateLandmark = (landmark) => {
    if (!landmark.trim()) return "Landmark is required";
    if (landmark.length < 3) return "Landmark should be at least 3 characters long";
    if (landmark.length > 100) return "Landmark should not exceed 100 characters";
    if (!/^[a-zA-Z0-9\s,.'"-]+$/.test(landmark)) {
      return "Landmark should only contain letters, numbers, and basic punctuation";
    }
    return "";
  };
  
  const validateCity = (city) => {
    if (!city.trim()) return "City is required";
    if (!/^[a-zA-Z\s]+$/.test(city)) return "City should only contain letters and spaces";
    return "";
  };
  
  const validateDistrict = (district) => {
    if (!district.trim()) return "District is required";
    if (!/^[a-zA-Z\s]+$/.test(district)) return "District should only contain letters and spaces";
    return "";
  };
  
  const validateState = (state) => {
    if (!state.trim()) return "State is required";
    if (!/^[a-zA-Z\s]+$/.test(state)) return "State should only contain letters and spaces";
    return "";
  };
  
  // Main validation function
  const validateAddressForm = (formData) => {
    const errors = {};
    
    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    const addressError = validateAddress(formData.address);
    if (addressError) errors.address = addressError;

    const landmarkError = validateLandmark(formData.landmark);
    if (landmarkError) errors.landmark = landmarkError;
    
    const pincodeError = validatePincode(formData.pincode);
    if (pincodeError) errors.pincode = pincodeError;
    
    const cityError = validateCity(formData.city);
    if (cityError) errors.city = cityError;
    
    const districtError = validateDistrict(formData.district);
    if (districtError) errors.district = districtError;
    
    const stateError = validateState(formData.state);
    if (stateError) errors.state = stateError;
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  };
  
  export { validateAddressForm };