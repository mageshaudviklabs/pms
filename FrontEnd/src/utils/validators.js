// Email validation
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  // At least 8 characters, one uppercase, one lowercase, one number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

// Phone number validation
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
  return phoneRegex.test(phone);
};

// Required field validation
export const isRequired = (value) => {
  return value !== null && value !== undefined && String(value).trim() !== '';
};

// Minimum length validation
export const hasMinLength = (value, minLength) => {
  return String(value).length >= minLength;
};

// Maximum length validation
export const hasMaxLength = (value, maxLength) => {
  return String(value).length <= maxLength;
};

// Numeric validation
export const isNumeric = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value));
};

// Date validation
export const isValidDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

// URL validation
export const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// File size validation
export const isValidFileSize = (file, maxSizeInBytes) => {
  return file.size <= maxSizeInBytes;
};

// File type validation
export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

// Form validation helper
export const validateField = (value, rules) => {
  const errors = [];

  rules.forEach((rule) => {
    const { type, param, message } = rule;

    switch (type) {
      case 'required':
        if (!isRequired(value)) errors.push(message || 'This field is required');
        break;
      case 'email':
        if (value && !isValidEmail(value)) errors.push(message || 'Invalid email address');
        break;
      case 'password':
        if (value && !isValidPassword(value)) errors.push(message || 'Password must be at least 8 characters with uppercase, lowercase, and number');
        break;
      case 'phone':
        if (value && !isValidPhoneNumber(value)) errors.push(message || 'Invalid phone number');
        break;
      case 'minLength':
        if (value && !hasMinLength(value, param)) errors.push(message || `Minimum length is ${param} characters`);
        break;
      case 'maxLength':
        if (value && !hasMaxLength(value, param)) errors.push(message || `Maximum length is ${param} characters`);
        break;
      case 'numeric':
        if (value && !isNumeric(value)) errors.push(message || 'Must be a number');
        break;
      case 'date':
        if (value && !isValidDate(value)) errors.push(message || 'Invalid date');
        break;
      case 'url':
        if (value && !isValidUrl(value)) errors.push(message || 'Invalid URL');
        break;
      default:
        break;
    }
  });

  return errors;
};

// Form validation
export const validateForm = (formData, validationRules) => {
  const errors = {};

  Object.keys(validationRules).forEach((fieldName) => {
    const value = formData[fieldName];
    const rules = validationRules[fieldName];
    const fieldErrors = validateField(value, rules);

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
