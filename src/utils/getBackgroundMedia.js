import { useMemo, useEffect } from 'react';

// Helper to select the first available media file for a given name and extensions.
function getMedia(name, extensions = ['mp4', 'gif', 'jpg', 'png']) {
  const basePath = `/images/${name}`;
  if (typeof window !== 'undefined' && window.__MEDIA_EXISTS__) {
    for (const ext of extensions) {
      if (window.__MEDIA_EXISTS__[`${name}.${ext}`]) {
        let type = ext === 'mp4' ? 'video' : ext === 'gif' ? 'gif' : 'image';
        // Debug: log selected media
        console.debug(`[getMedia] Found media: ${basePath}.${ext} (type: ${type})`);
        return { type, src: `${basePath}.${ext}`, ext };
      }
    }
  }
  // Debug: log fallback
  console.debug(`[getMedia] Fallback to: ${basePath}.jpg`);
  return { type: 'image', src: `${basePath}.jpg`, ext: 'jpg' };
}

// Returns an object describing the background media (image, gif, or video) to use
// based on the weather condition and whether it's night time.
export function getBackgroundMedia(condition, isNightTime) {
  const condStr = typeof condition === 'string' ? condition.toLowerCase() : '';
  console.debug(`[getBackgroundMedia] condition: ${condition}, isNightTime: ${isNightTime}`);

  // Overcast condition (day or night)
  if (condStr.includes('overcast')) {
    const media = isNightTime
      ? getMedia('night-overcast', ['mp4', 'jpg'])
      : getMedia('overcast', ['mp4', 'jpg']);
    console.debug('[getBackgroundMedia] Overcast selected:', media);
    return media;
  }

  // Thunderstorm condition
  if (/thunderstorm/i.test(condStr)) {
    const media = getMedia('thunderstorm', ['mp4', 'jpg']);
    console.debug('[getBackgroundMedia] Thunderstorm selected:', media);
    return media;
  }

  // Scattered/Broken Clouds
  if (/scattered clouds?|broken clouds?/i.test(condStr)) {
    const media = isNightTime
      ? getMedia('night-broken-clouds', ['mp4', 'jpg'])
      : getMedia('broken-clouds', ['mp4', 'jpg']);
    console.debug('[getBackgroundMedia] Broken/Scattered Clouds selected:', media);
    return media;
  }

  // Night time backgrounds
  if (isNightTime) {
    if (/clouds?|cloudy/.test(condStr) && !condStr.includes('overcast')) {
      const media = getMedia('night-cloudy', ['mp4', 'jpg']);
      console.debug('[getBackgroundMedia] Night Cloudy selected:', media);
      return media;
    }
    if (condStr === 'clear') {
      const media = getMedia('night-clear', ['mp4', 'jpg']);
      console.debug('[getBackgroundMedia] Night Clear selected:', media);
      return media;
    }
    if (['mist', 'drizzle'].includes(condStr)) {
      const media = getMedia('night-mist', ['mp4', 'jpg']);
      console.debug('[getBackgroundMedia] Night Mist/Drizzle selected:', media);
      return media;
    }
    if (condStr === 'fog' || condStr === 'haze') {
      const media = getMedia('night-fog', ['mp4', 'jpg']);
      console.debug('[getBackgroundMedia] Night Fog/Haze selected:', media);
      return media;
    }
    const media = getMedia('night', ['mp4', 'jpg']);
    console.debug('[getBackgroundMedia] Default Night selected:', media);
    return media;
  }

  // Daytime mist
  if (condStr === 'mist') {
    const media = getMedia('mist', ['mp4', 'jpg']);
    console.debug('[getBackgroundMedia] Day Mist selected:', media);
    return media;
  }

  // Daytime fog or haze
  if (condStr === 'fog' || condStr === 'haze') {
    const media = getMedia('fog', ['mp4', 'jpg']);
    console.debug('[getBackgroundMedia] Day Fog/Haze selected:', media);
    return media;
  }

  // Fallback if no condition is provided
  if (!condition) {
    console.debug('[getBackgroundMedia] No condition, fallback to blue-ribbon');
    return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  }

  // Default: try all extensions for the given condition
  const media = getMedia(condStr, ['mp4', 'gif', 'jpg', 'png']);
  console.debug('[getBackgroundMedia] Default selected:', media);
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
        <video autoPlay loop muted playsInline>
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
