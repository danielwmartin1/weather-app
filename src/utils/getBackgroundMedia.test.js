import { getBackgroundMedia } from './getBackgroundMedia';

describe('getBackgroundMedia', () => {
  beforeEach(() => {
    // Mock window and __MEDIA_EXISTS__ for each test
    global.window = Object.create(window);
    window.__MEDIA_EXISTS__ = {
      'thunderstorm.mp4': true,
      // 'thunderstorm.jpg': true, // Ensure jpg is not available so only video is returned
      'night-overcast.jpg': true,
      'night-cloudy.mp4': true,
      'night-cloudy.jpg': true,
      'night-clear.jpg': true,
      'night-mist.mp4': true,
      'night-mist.jpg': true,
      'night.jpg': true,
      'mist.mp4': true,
      'mist.jpg': true,
      'clear.mp4': false,
      'unknown.gif': true,
    };
  });

  it('returns thunderstorm media for thunderstorm condition', () => {
    const result = getBackgroundMedia('thunderstorm', false);
    expect(result).toEqual({
      type: 'video',
      src: '/images/thunderstorm.mp4',
      ext: 'mp4',
    });
  });

  it('returns night-overcast media for night overcast', () => {
    const result = getBackgroundMedia('overcast', true);
    expect(result).toEqual({
      type: 'image',
      src: '/images/night-overcast.jpg',
      ext: 'jpg',
    });
  });

  it('returns night-cloudy media for night cloudy', () => {
    const result = getBackgroundMedia('cloudy', true);
    expect(result).toEqual({
      type: 'video',
      src: '/images/night-cloudy.mp4',
      ext: 'mp4',
    });
  });

  it('returns night-clear media for night clear', () => {
    const result = getBackgroundMedia('clear', true);
    expect(result).toEqual({
      type: 'image',
      src: '/images/night-clear.jpg',
      ext: 'jpg',
    });
  });

  it('returns night-mist media for night mist', () => {
    const result = getBackgroundMedia('mist', true);
    expect(result).toEqual({
      type: 'video',
      src: '/images/night-mist.mp4',
      ext: 'mp4',
    });
  });

  it('returns night-mist media for night drizzle', () => {
    const result = getBackgroundMedia('drizzle', true);
    expect(result).toEqual({
      type: 'video',
      src: '/images/night-mist.mp4',
      ext: 'mp4',
    });
  });

  it('returns night media for night with unknown condition', () => {
    const result = getBackgroundMedia('random', true);
    expect(result).toEqual({
      type: 'image',
      src: '/images/night.jpg',
      ext: 'jpg',
    });
  });

  it('returns mist media for daytime mist', () => {
    const result = getBackgroundMedia('mist', false);
    expect(result).toEqual({
      type: 'video',
      src: '/images/mist.mp4',
      ext: 'mp4',
    });
  });

  it('returns fallback image if no condition is provided', () => {
    const result = getBackgroundMedia(undefined, false);
    expect(result).toEqual({
      type: 'image',
      src: '/images/blue-ribbon.jpg',
      ext: 'jpg',
    });
  });
  it('returns first available extension for unknown condition', () => {
    const result = getBackgroundMedia('unknown', false);
    expect(result).toEqual({
      type: 'gif',
      src: '/images/unknown.gif',
      ext: 'gif',
    });
  });
});