export function getBackgroundMedia(condition, isNightTime) {
  if (isNightTime) {
    if (condition === 'clear') {
      if (window && window.__MEDIA_EXISTS__) {
        if (window.__MEDIA_EXISTS__['night-clear.mp4']) {
          return { type: 'video', src: '/images/night-clear.mp4', ext: 'mp4' };
        }
        if (window.__MEDIA_EXISTS__['night-clear.jpg']) {
          return { type: 'image', src: '/images/night-clear.jpg', ext: 'jpg' };
        }
      }
      return { type: 'image', src: '/images/night-clear.jpg', ext: 'jpg' };
    }
    if (condition === 'mist') {
      if (window && window.__MEDIA_EXISTS__) {
        if (window.__MEDIA_EXISTS__['night-mist.mp4']) {
          return { type: 'video', src: '/images/night-mist.mp4', ext: 'mp4' };
        }
        if (window.__MEDIA_EXISTS__['night-mist.jpg']) {
          return { type: 'image', src: '/images/night-mist.jpg', ext: 'jpg' };
        }
      }
      return { type: 'image', src: '/images/night-mist.jpg', ext: 'jpg' };
    }
    if (window && window.__MEDIA_EXISTS__) {
      if (window.__MEDIA_EXISTS__['night.mp4']) {
        return { type: 'video', src: '/images/night.mp4', ext: 'mp4' };
      }
      if (window.__MEDIA_EXISTS__['night.jpg']) {
        return { type: 'image', src: '/images/night.jpg', ext: 'jpg' };
      }
    }
    return { type: 'image', src: '/images/night.jpg', ext: 'jpg' };
  }
  if (condition === 'mist') {
    if (window && window.__MEDIA_EXISTS__) {
      if (window.__MEDIA_EXISTS__['mist.mp4']) {
        return { type: 'video', src: '/images/mist.mp4', ext: 'mp4' };
      }
      if (window.__MEDIA_EXISTS__['mist.jpg']) {
        return { type: 'image', src: '/images/mist.jpg', ext: 'jpg' };
      }
    }
    return { type: 'image', src: '/images/mist.jpg', ext: 'jpg' };
  }
  if (!condition) return { type: 'image', src: '/images/blue-ribbon.jpg', ext: 'jpg' };
  const base = `/images/${condition}`;
  if (window && window.__MEDIA_EXISTS__) {
    if (window.__MEDIA_EXISTS__[`${condition}.mp4`]) {
      return { type: 'video', src: `${base}.mp4`, ext: 'mp4' };
    }
    if (window.__MEDIA_EXISTS__[`${condition}.gif`]) {
      return { type: 'gif', src: `${base}.gif`, ext: 'gif' };
    }
    if (window.__MEDIA_EXISTS__[`${condition}.jpg`]) {
      return { type: 'image', src: `${base}.jpg`, ext: 'jpg' };
    }
    if (window.__MEDIA_EXISTS__[`${condition}.png`]) {
      return { type: 'image', src: `${base}.png`, ext: 'png' };
    }
  }
  return { type: 'image', src: `${base}.jpg`, ext: 'jpg' };
}