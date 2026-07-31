/** AgriSphere AI — Feature Flags */
export const FEATURE_FLAGS = {
  VOICE_ASSISTANT: true,
  MARKETPLACE: true,
  GRAIN_GRADING: true,
  YIELD_PREDICTION: true,
  NDVI_SATELLITE: true,
  WEATHER_INTELLIGENCE: true,
  OFFLINE_EDGE_SCAN: true,
  ADMIN_ANALYTICS: true,
};

/** Helper to check if a feature flag is enabled */
export function isFeatureEnabled(flagName) {
  return Boolean(FEATURE_FLAGS[flagName]);
}
