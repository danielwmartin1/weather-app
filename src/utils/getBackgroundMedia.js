// Returns an object describing the background media (image, gif, or video) to use
// based on the weather condition and whether it's night time.
export function getBackgroundMedia(condition, isNightTime) {
  // Selects the first available media file for a given name and extensions.
  // Checks window.__MEDIA_EXISTS__ to see which files exist.
  const getMedia = (name, exts = ['mp4', 'gif', 'jpg', 'png']) => {
    const base = `/images/${name}`;
    if (window && window.__MEDIA_EXISTS__) {
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
    return { type: 'image', src: `${base}.jpg`, ext: 'jpg' };
  };

  if (isNightTime) {
    if (/clouds?|cloudy/.test(condition)) {
      return getMedia('night-cloudy', ['mp4', 'jpg']);
    }
    if (condition === 'clear') {
      return getMedia('night-clear', ['mp4', 'jpg']);
    }
    if (condition === 'mist' || condition === 'drizzle') {
      return getMedia('night-mist', ['mp4', 'jpg']);
    }
    return getMedia('night', ['mp4', 'jpg']);
  }

  if (condition === 'mist') {
    return getMedia('mist', ['mp4', 'jpg']);
  }

  if (!condition) {
    return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  }

  return getMedia(condition, ['mp4', 'gif', 'jpg', 'png']);
}
