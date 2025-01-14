// Validation functions for product offer management
export const validateProductOfferForm = (offerName, offerValue, offerExpairyDate) => {
    const errors = {};

    // Offer Name Validation
    if (!offerName) {
        errors.offerName = "Offer name is required";
    } else if (offerName.trim().length < 3) {
        errors.offerName = "Offer name must be at least 3 characters long";
    } else if (offerName.trim().length > 50) {
        errors.offerName = "Offer name cannot exceed 50 characters";
    } else if (!/^[A-Z\s]+$/.test(offerName)) {
        errors.offerName = "Offer name can only contain uppercase letters and spaces";
    }

    // Offer Value Validation
    if (!offerValue) {
        errors.offerValue = "Offer value is required";
    } else {
        const numValue = Number(offerValue);
        if (isNaN(numValue)) {
            errors.offerValue = "Offer value must be a number";
        } else if (numValue <= 0) {
            errors.offerValue = "Offer value must be greater than 0";
        } else if (numValue > 90) {
            errors.offerValue = "Offer value cannot exceed 90%";
        } else if (!Number.isInteger(numValue)) {
            errors.offerValue = "Offer value must be a whole number";
        }
    }

    // Expiry Date Validation
    if (!offerExpairyDate) {
        errors.offerExpairyDate = "Expiry date is required";
    } else {
        const currentDate = new Date();
        const selectedDate = new Date(offerExpairyDate);
        
        // Reset time portions for accurate date comparison
        currentDate.setHours(0, 0, 0, 0);
        selectedDate.setHours(0, 0, 0, 0);

        if (selectedDate <= currentDate) {
            errors.offerExpairyDate = "Expiry date must be in the future";
        }

        // Check if date is not more than 1 year in the future
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 1);
        if (selectedDate > maxDate) {
            errors.offerExpairyDate = "Expiry date cannot be more than 1 year in the future";
        }
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0
    };
};