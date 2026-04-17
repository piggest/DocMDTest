/* eslint-disable */
// Docusaurus は window.matchMedia('(max-width: 996px)') で mobile/desktop を判定し、
// mobile 判定時にサイドバーを描画しない。
// viewport が 601px 以上なら常に「desktop」として振る舞うよう matchMedia を override する。
// （600px 未満は本物のモバイルドロワーを使わせる）

if (typeof window !== 'undefined') {
  const TARGET_QUERY = '(max-width: 996px)';
  const FORCE_DESKTOP_MIN_WIDTH = 600;
  const origMatchMedia = window.matchMedia.bind(window);

  window.matchMedia = function (query) {
    if (query !== TARGET_QUERY) {
      return origMatchMedia(query);
    }

    const listeners = new Set();
    const computeMatches = () => window.innerWidth < FORCE_DESKTOP_MIN_WIDTH;

    const fake = {
      get matches() { return computeMatches(); },
      media: query,
      onchange: null,
      addListener(cb) { listeners.add(cb); },
      removeListener(cb) { listeners.delete(cb); },
      addEventListener(type, cb) { if (type === 'change') listeners.add(cb); },
      removeEventListener(type, cb) { if (type === 'change') listeners.delete(cb); },
      dispatchEvent() { return true; },
    };

    let prev = computeMatches();
    window.addEventListener('resize', () => {
      const curr = computeMatches();
      if (prev !== curr) {
        prev = curr;
        for (const cb of listeners) {
          try { cb({ matches: curr, media: query }); } catch (_) {}
        }
      }
    });

    return fake;
  };
}
