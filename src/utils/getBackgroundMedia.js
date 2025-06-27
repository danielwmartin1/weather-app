// Returns an object describing the background media (image, gif, or video) to use
// based on the weather condition and whether it's night time.
export function getBackgroundMedia(condition, isNightTime) {
  // Helper function to select the first available media file for a given name and extensions.
  // Checks a global window.__MEDIA_EXISTS__ object to see which files exist.
  const getMedia = (name, exts = ['mp4', 'gif', 'jpg', 'png']) => {
    const base = `/images/${name}`;
    if (window && window.__MEDIA_EXISTS__) {
      // Loop through the preferred extensions and return the first one that exists.
      for (const ext of exts) {
        if (window.__MEDIA_EXISTS__[`${name}.${ext}`]) {
          return {
            type: ext === 'mp4' ? 'video' : ext === 'gif' ? 'gif' : 'image',
            src: `${base}.${ext}`,
            ext,
          };
        }
      }
    }
    // If no media file is found, default to a jpg image.
    return { type: 'image', src: `${base}.jpg`, ext: 'jpg' };
  };

  // Night time backgrounds
  if (isNightTime) {
    // Cloudy night
    if (/clouds?|cloudy/.test(condition)) {
      return getMedia('night-cloudy', ['mp4', 'jpg']);
    }
    // Clear night
    if (condition === 'clear') {
      return getMedia('night-clear', ['mp4', 'jpg']);
    }
    // Misty or drizzly night
    if (condition === 'mist' || condition === 'drizzle') {
      return getMedia('night-mist', ['mp4', 'jpg']);
    }
    // Generic night background
    return getMedia('night', ['mp4', 'jpg']);
  }

  // Misty day background
  if (condition === 'mist') {
    return getMedia('mist', ['mp4', 'jpg']);
  }

  // If no condition is provided, use a default image.
  if (!condition) {
    return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  }

  // Fallback: try to find a media file matching the condition.
  return getMedia(condition, ['mp4', 'gif', 'jpg', 'png']);
}
