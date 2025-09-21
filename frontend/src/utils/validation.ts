export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

export function validateField(value: any, rule: ValidationRule): string | null {
  if (rule.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
    return 'This field is required';
  }

  if (!value) return null; // Skip other validations if field is empty and not required

  if (rule.minLength && value.length < rule.minLength) {
    return `Must be at least ${rule.minLength} characters`;
  }

  if (rule.maxLength && value.length > rule.maxLength) {
    return `Must be no more than ${rule.maxLength} characters`;
  }

  if (rule.pattern && !rule.pattern.test(value)) {
    return 'Invalid format';
  }

  if (rule.custom) {
    return rule.custom(value);
  }

  return null;
}

export function validateForm(data: Record<string, any>, schema: ValidationSchema): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const [field, rule] of Object.entries(schema)) {
    const error = validateField(data[field], rule);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

// Common validation schemas
export const loginValidationSchema: ValidationSchema = {
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  password: {
    required: true,
    minLength: 6,
  },
};

export const employeeValidationSchema: ValidationSchema = {
  firstName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  lastName: {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  phone: {
    required: true,
    pattern: /^\+?[\d\s\-\(\)]{10,}$/,
  },
  department: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  position: {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  salary: {
    required: true,
    custom: (value) => {
      const num = parseFloat(value);
      if (isNaN(num) || num <= 0) {
        return 'Must be a valid positive number';
      }
      return null;
    },
  },
  hireDate: {
    required: true,
  },
  'address.street': {
    required: true,
    minLength: 5,
    maxLength: 200,
  },
  'address.city': {
    required: true,
    minLength: 2,
    maxLength: 100,
  },
  'address.state': {
    required: true,
    minLength: 2,
    maxLength: 50,
  },
  'address.zipCode': {
    required: true,
    pattern: /^\d{5}(-\d{4})?$/,
  },
};