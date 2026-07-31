/** Register Form Validation Schema */
export function validateRegister({ name, phone, password, confirmPassword, district }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Full name is required';
  if (!district || !district.trim()) errors.district = 'District is required';

  if (!phone || !phone.trim()) {
    errors.phone = 'Phone number is required';
  } else if (!/^\+?[0-9]{10,12}$/.test(phone.replace(/\s+/g, ''))) {
    errors.phone = 'Enter a valid 10-digit phone number';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
