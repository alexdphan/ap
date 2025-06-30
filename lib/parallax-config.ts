/**
 * Parallax configuration utility
 * Reads parallax strength from environment variable with fallback
 */

export const getParallaxStrength = (): number => {
  // Read from environment variable with fallback to 0.25
  const envValue = process.env.NEXT_PUBLIC_PARALLAX_STRENGTH;
  
  if (envValue) {
    const parsed = parseFloat(envValue);
    // Ensure value is between 0 and 1
    if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
      return parsed;
    }
  }
  
  // Default fallback value
  return 0.25;
};

// Export as constant for consistent usage
export const PARALLAX_STRENGTH = getParallaxStrength(); 