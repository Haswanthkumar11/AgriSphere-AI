/** Profile Form Validation Schema */
export function validateProfile({ name, region, land }) {
  const errors = {};
  if (!name || !name.trim()) errors.name = 'Name cannot be empty';
  if (!region || !region.trim()) errors.region = 'Region cannot be empty';
  if (land === undefined || land <= 0) errors.land = 'Land size must be greater than 0';

  return { isValid: Object.keys(errors).length === 0, errors };
}
