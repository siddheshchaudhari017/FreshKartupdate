// Client-side input validation utilities

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
        return 'Email is required';
    }
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }
    if (email.length > 100) {
        return 'Email is too long';
    }
    return '';
};

export const validatePassword = (password) => {
    if (!password) {
        return 'Password is required';
    }
    if (password.length < 8) {
        return 'Password must be at least 8 characters';
    }
    if (password.length > 128) {
        return 'Password is too long';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    return '';
};

export const validateName = (name) => {
    if (!name) {
        return 'Name is required';
    }
    if (name.length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (name.length > 50) {
        return 'Name is too long';
    }
    if (!/^[a-zA-Z\s]+$/.test(name)) {
        return 'Name can only contain letters and spaces';
    }
    return '';
};

export const validatePasswordMatch = (password, confirmPassword) => {
    if (!confirmPassword) {
        return 'Please confirm your password';
    }
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }
    return '';
};

export const sanitizeInput = (input) => {
    // Basic XSS prevention - remove HTML tags
    return input.replace(/<[^>]*>/g, '').trim();
};

export const validateForm = (fields) => {
    const errors = {};

    if (fields.name !== undefined) {
        const nameError = validateName(fields.name);
        if (nameError) errors.name = nameError;
    }

    if (fields.email !== undefined) {
        const emailError = validateEmail(fields.email);
        if (emailError) errors.email = emailError;
    }

    if (fields.password !== undefined) {
        const passwordError = validatePassword(fields.password);
        if (passwordError) errors.password = passwordError;
    }

    if (fields.confirmPassword !== undefined && fields.password !== undefined) {
        const matchError = validatePasswordMatch(fields.password, fields.confirmPassword);
        if (matchError) errors.confirmPassword = matchError;
    }

    return errors;
};
