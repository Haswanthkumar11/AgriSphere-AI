/** Yield Prediction Form Validation Schema */
export function validateYieldRequest({ crop, farm_size_acres, season }) {
  const errors = {};
  if (!crop) errors.crop = 'Please select a crop';
  if (!season) errors.season = 'Please select a season';
  if (!farm_size_acres || Number(farm_size_acres) <= 0) {
    errors.farm_size_acres = 'Farm size must be positive';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}
