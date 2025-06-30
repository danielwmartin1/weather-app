// Returns an object describing the background media (image, gif, or video) to use
// based on the weather condition and whether it's night time.
export function getBackgroundMedia(condition, isNightTime) {
  // Helper to select the first available media file for a given name and extensions.
  // Uses window.__MEDIA_EXISTS__ to check which files exist.
  function getMedia(name, extensions = ['mp4', 'gif', 'jpg', 'png']) {
    const basePath = `/images/${name}`;
    if (window && window.__MEDIA_EXISTS__) {
      for (const ext of extensions) {
        if (window.__MEDIA_EXISTS__[`${name}.${ext}`]) {
          let type = ext === 'mp4' ? 'video' : ext === 'gif' ? 'gif' : 'image';
          return { type, src: `${basePath}.${ext}`, ext };
        }
      }
    }
    // Default to jpg if nothing found
    return { type: 'image', src: `${basePath}.jpg`, ext: 'jpg' };
  }

  // Example: you could add more condition handling here if needed.

  // Handle night time backgrounds
  if (isNightTime) {
    if (/clouds?|cloudy/.test(condition)) {
      return getMedia('night-cloudy', ['mp4', 'jpg']);
    }
    if (condition === 'clear') {
      return getMedia('night-clear', ['mp4', 'jpg']);
    }
    if (['mist', 'drizzle'].includes(condition)) {
      return getMedia('night-mist', ['mp4', 'jpg']);
    }
    return getMedia('night', ['mp4', 'jpg']);
  }

  // Handle daytime mist
  if (condition === 'mist') {
    return getMedia('mist', ['mp4', 'jpg']);
  }

  // Fallback if no condition
  if (!condition) {
    return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  }

  // Default: try all extensions for the condition
  return getMedia(condition, ['mp4', 'gif', 'jpg', 'png']);
}
