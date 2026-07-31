/** Login Form Validation Schema */
export function validateLogin({ phone, password }) {
  const errors = {};
  if (!phone || !phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[0-9]{10,12}$/.test(phone.replace(/\s+/g, ''))) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 4) {
    errors.password = 'Password must be at least 4 characters';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
