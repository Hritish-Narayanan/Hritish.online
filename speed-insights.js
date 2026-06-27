// Vercel Speed Insights initialization
// This script injects the Speed Insights tracking script into the page
import { injectSpeedInsights } from '@vercel/speed-insights';

// Initialize Speed Insights
// The injectSpeedInsights function will automatically track web vitals
// and performance metrics when deployed on Vercel
injectSpeedInsights({
  debug: false, // Set to true to enable debug logging in development
  // Note: Speed Insights does not track data in development mode
});
