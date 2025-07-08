import { useMemo } from 'react';

// Returns an object describing the background media (image, gif, or video) to use
// based on the weather condition and whether it's night time.
export function getBackgroundMedia(condition, isNightTime) {
  // Helper to select the first available media file for a given name and extensions.
  // Uses window.__MEDIA_EXISTS__ to check which files exist.
  function getMedia(name, extensions = ['mp4', 'gif', 'jpg', 'png']) {
    const basePath = `/images/${name}`;
    if (typeof window !== 'undefined' && window.__MEDIA_EXISTS__) {
      // Loop through the provided extensions and return the first existing media file
      for (const ext of extensions) {
        if (window.__MEDIA_EXISTS__[`${name}.${ext}`]) {
          // Determine the media type based on the extension
          let type = ext === 'mp4' ? 'video' : ext === 'gif' ? 'gif' : 'image';
          return { type, src: `${basePath}.${ext}`, ext };
        }
      }
    }
    // Default to jpg if nothing found
    return { type: 'image', src: `${basePath}.jpg`, ext: 'jpg' };
  }

  // --- Thunderstorm condition ---
  // Use thunderstorm-specific media if the condition matches
  if (/thunderstorm/i.test(condition)) {
    return getMedia('thunderstorm', ['mp4', 'jpg']);
  }

  // --- Night overcast condition ---
  // Use night-overcast media if it's night and overcast
  if (isNightTime && /overcast/i.test(condition)) {
    return getMedia('night-overcast', ['mp4', 'jpg']);
  }

  // --- Fog or Haze condition (day or night) ---
  // Use fog-specific media if the condition matches
  if (/fog|haze/i.test(condition)) {
    return getMedia('fog', ['mp4', 'jpg']);
  }

  // Handle night time backgrounds
  if (isNightTime) {
    // Use night-cloudy media for cloudy conditions at night
    if (/clouds?|cloudy/.test(condition)) {
      return getMedia('night-cloudy', ['mp4', 'jpg']);
    }
    // Use night-clear media for clear conditions at night
    if (condition === 'clear') {
      return getMedia('night-clear', ['mp4', 'jpg']);
    }
    // Use night-mist media for mist or drizzle at night
    if (['mist', 'drizzle'].includes(condition)) {
      return getMedia('night-mist', ['mp4', 'jpg']);
    }
    // Use night-fog media for fog or haze at night
    if (condition === 'fog' || condition === 'haze') {
      return getMedia('night-fog', ['mp4', 'jpg']);
    }
    // Default night background
    return getMedia('night', ['mp4', 'jpg']);
  }

  // Handle daytime mist
  if (condition === 'mist') {
    return getMedia('mist', ['mp4', 'jpg']);
  }

  // Handle daytime fog or haze
  if (condition === 'fog' || condition === 'haze') {
    return getMedia('fog', ['mp4', 'jpg']);
  }

  // Fallback if no condition is provided
  if (!condition) {
    return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  }

  // Default: try all extensions for the given condition
  return getMedia(condition, ['mp4', 'gif', 'jpg', 'png']);
}

export function BackgroundMediaComponent({ weatherData }) {
  const backgroundMedia = useMemo(() => getBackgroundMedia(weatherData), [weatherData]);

  return (
    <div>
      {backgroundMedia.type === 'video' ? (
        <video autoPlay loop muted>
          <source src={backgroundMedia.src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : backgroundMedia.type === 'gif' ? (
        <img src={backgroundMedia.src} alt="Weather GIF" />
      ) : (
        <img src={backgroundMedia.src} alt="Weather Background" />
      )}
    </div>
  );
}
