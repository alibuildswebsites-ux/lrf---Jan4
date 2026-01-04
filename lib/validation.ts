export const Patterns = {
  Email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  Phone: /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/,
};

export const validateEmail = (email: string): boolean => Patterns.Email.test(email);

export const validatePhone = (phone: string): boolean => Patterns.Phone.test(phone);

export const validateRequired = (val: string, minLength = 1): boolean => val.trim().length >= minLength;

export const validateFile = (file: File, maxSize: number, allowedTypes: string[]): string | null => {
  if (file.size > maxSize) {
    return `File size must be less than ${maxSize / (1024 * 1024)}MB`;
  }
  if (!allowedTypes.includes(file.type)) {
    return `File type ${file.type} is not supported`;
  }
  return null;
};