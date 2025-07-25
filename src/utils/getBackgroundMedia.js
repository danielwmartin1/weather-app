import { useMemo, useEffect } from 'react';

// Helper to select the first available media file for a given name and extensions.
function getMedia(name, extensions = ['mp4', 'gif', 'jpg', 'png']) {
  const basePath = `/images/${name}`;
  if (typeof window !== 'undefined' && window.__MEDIA_EXISTS__) {
    for (const ext of extensions) {
      if (window.__MEDIA_EXISTS__[`${name}.${ext}`]) {
        let type = ext === 'mp4' ? 'video' : ext === 'gif' ? 'gif' : 'image';
        return { type, src: `${basePath}.${ext}`, ext };
      } 
    }
  }
  return { type: 'image', src: `${basePath}.jpg`, ext: 'jpg' };
}

// Returns an object describing the background media (image, gif, or video) to use
// based on the weather condition and whether it's night time.
export function getBackgroundMedia(condition, isNightTime) {
  const condStr = typeof condition === 'string' ? condition.toLowerCase() : '';
  // Overcast condition (day or night)
  // Prioritize 'overcast' only if 'overcast' is explicitly in the condition string,
  // otherwise let 'cloudy' match to 'cloudy' media (not overcast).
  if (/overcast/i.test(condStr)) {
    const media = isNightTime
      ? getMedia('night-overcast', ['mp4', 'jpg'])
      : getMedia('overcast', ['mp4', 'jpg']);
    return media;
  }

  // Scattered/Broken Clouds
  if (/(scattered clouds|broken clouds)/i.test(condStr)) {
    const media = isNightTime
      ? getMedia('night-broken-clouds', ['mp4', 'jpg'])
      : getMedia('broken-clouds', ['mp4', 'jpg']);
    return media;
  }

  // Thunderstorm condition
  if (/thunderstorm/i.test(condStr)) {
    const media = getMedia('thunderstorm', ['mp4', 'jpg']);
    return media;
  }

  // Night time backgrounds
  if (isNightTime) {
    if ((/clouds|cloudy/i.test(condStr)) && !condStr.includes('overcast')) {
      const media = getMedia('night-cloudy', ['mp4', 'jpg']);
      return media;
    }
    if (condStr === 'clear') {
      const media = getMedia('night-clear', ['mp4', 'jpg']);
      return media;
    }
    if (['mist', 'drizzle'].includes(condStr)) {
      const media = getMedia('night-mist', ['mp4', 'jpg']);
      return media;
    }
    if (condStr === 'fog' || condStr === 'haze') {
      const media = getMedia('night-fog', ['mp4', 'jpg']);
      return media;
    }
    const media = getMedia('night', ['mp4', 'jpg']);
    return media;
  }

  // Daytime mist
  if (condStr === 'mist') {
    const media = getMedia('mist', ['mp4', 'jpg']);
    return media;
  }

  // Daytime fog or haze
  if (condStr === 'fog' || condStr === 'haze') {
    const media = getMedia('fog', ['mp4', 'jpg']);
    return media;
  }

  // Fallback if no condition is provided or condition is an empty string
  if (!condition || (typeof condition === 'string' && condition.trim() === '')) {
    return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  }

  // Default: try all extensions for the given condition
  const media = getMedia(condStr, ['mp4', 'gif', 'jpg', 'png']);
  return media;
}

export function BackgroundMediaComponent({ weatherData }) {
  // Accepts either { condition, isNightTime } or just condition
  const condition = weatherData?.condition ?? weatherData;
  const isNightTime = weatherData?.isNightTime ?? false;

  const backgroundMedia = useMemo(
    () => getBackgroundMedia(condition, isNightTime),
    [condition, isNightTime]
  );

  // Debug: log selected backgroundMedia
  useEffect(() => {
    console.log('[BackgroundMediaComponent] Rendering background:', {
      condition,
      isNightTime,
      backgroundMedia,
    });
  }, [condition, isNightTime, backgroundMedia]);

  return (
    <div>
      {backgroundMedia.type === 'video' ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          poster={backgroundMedia.src.replace('.mp4', '.jpg')}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        >
          <source src={backgroundMedia.src} type="video/mp4" />
          {/* Fallback image if video fails */}
          <img src={backgroundMedia.src.replace('.mp4', '.jpg')} alt="Weather Background" />
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
