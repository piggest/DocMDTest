/* eslint-disable */
// サイドバーのピン留めトグル: html.sidebar-pinned クラスで CSS を制御
if (typeof window !== 'undefined') {
  const KEY = 'docmdtest-sidebar-pinned';

  function apply() {
    const pinned = localStorage.getItem(KEY) === '1';
    document.documentElement.classList.toggle('sidebar-pinned', pinned);
    const btn = document.getElementById('sidebar-pin-btn');
    if (btn) {
      btn.textContent = pinned ? '📍' : '📌';
      btn.title = pinned ? 'サイドバーを解除' : 'サイドバーをピン留め';
      btn.setAttribute('aria-pressed', String(pinned));
    }
  }

  function toggle() {
    const pinned = localStorage.getItem(KEY) === '1';
    localStorage.setItem(KEY, pinned ? '0' : '1');
    apply();
  }

  function createBtn() {
    if (document.getElementById('sidebar-pin-btn')) return;
    const btn = document.createElement('button');
    btn.id = 'sidebar-pin-btn';
    btn.style.cssText = [
      'position:fixed',
      'top:14px',
      'right:14px',
      'z-index:1001',
      'width:34px',
      'height:34px',
      'border-radius:50%',
      'border:1px solid var(--ifm-color-emphasis-300, #ddd)',
      'background:var(--ifm-background-surface-color, #fff)',
      'cursor:pointer',
      'font-size:16px',
      'display:flex',
      'align-items:center',
      'justify-content:center',
      'box-shadow:0 1px 3px rgba(0,0,0,0.12)',
      'padding:0',
    ].join(';');
    btn.onclick = toggle;
    document.body.appendChild(btn);
    apply();
  }

  // SPA 遷移にも対応: ボタンを必ず一回作る
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', createBtn);
  } else {
    createBtn();
  }

  // Docusaurus のルート切替後も apply される保険
  const observer = new MutationObserver(() => createBtn());
  if (document.body) observer.observe(document.body, { childList: true });
  else document.addEventListener('DOMContentLoaded', () => observer.observe(document.body, { childList: true }));
}
