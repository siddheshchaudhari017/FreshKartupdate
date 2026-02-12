// Client-side validation for product farmer details

export const validateFarmerName = (name) => {
    if (!name || name.trim() === '') {
        return 'Farmer name is required';
    }
    if (name.length < 2) {
        return 'Farmer name must be at least 2 characters';
    }
    if (name.length > 100) {
        return 'Farmer name must not exceed 100 characters';
    }
    if (!/^[a-zA-Z\s.-]+$/.test(name)) {
        return 'Farmer name can only contain letters, spaces, dots, and hyphens';
    }
    return '';
};

export const validateFarmerPhone = (phone) => {
    if (!phone || phone.trim() === '') {
        return 'Farmer phone number is required';
    }
    if (!/^\d{10}$/.test(phone)) {
        return 'Phone number must be exactly 10 digits';
    }
    return '';
};

export const validateProductForm = (fields) => {
    const errors = {};

    if (fields.farmerName !== undefined) {
        const nameError = validateFarmerName(fields.farmerName);
        if (nameError) errors.farmerName = nameError;
    }

    if (fields.farmerPhone !== undefined) {
        const phoneError = validateFarmerPhone(fields.farmerPhone);
        if (phoneError) errors.farmerPhone = phoneError;
    }

    return errors;
};
