// window-manager.js
// Handles drag, resize, focus, open/close, and URL sync for desktop windows.

let zCounter = 100;

function blurAllWindows() {
  document.querySelectorAll('.window').forEach(w => w.classList.remove('win-focused'));
}

function focusWindow(winEl) {
  blurAllWindows();
  winEl.classList.add('win-focused');
}

/** Bring a window element to front */
function bringToFront(winEl) {
  winEl.style.zIndex = ++zCounter;
  focusWindow(winEl);
}

/** Open a window by id, or focus it if already open */
export function openWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  if (win.classList.contains('win-hidden')) {
    win.classList.remove('win-hidden');
  }
  bringToFront(win);
  history.pushState({}, '', `/${id}`);
  updateDockIndicators();
}

/** Close a window by id */
export function closeWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  win.classList.add('win-hidden');
  win.classList.remove('win-focused');
  const next = [...document.querySelectorAll('.window:not(.win-hidden)')]
    .sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];
  if (next) focusWindow(next);
  const openWindows = [...document.querySelectorAll('.window:not(.win-hidden)')];
  if (openWindows.length === 0) {
    history.pushState({}, '', '/');
  }
  updateDockIndicators();
}

/** Toggle minimize: hide if visible, show if hidden */
export function toggleWindow(id) {
  const win = document.getElementById(`win-${id}`);
  if (!win) return;
  if (win.classList.contains('win-hidden')) {
    openWindow(id);
  } else {
    win.classList.add('win-hidden');
    win.classList.remove('win-focused');
    const next = [...document.querySelectorAll('.window:not(.win-hidden)')]
      .sort((a, b) => (+b.style.zIndex || 0) - (+a.style.zIndex || 0))[0];
    if (next) focusWindow(next);
    updateDockIndicators();
  }
}

function updateDockIndicators() {
  document.querySelectorAll('[data-dock-id]').forEach(dockItem => {
    const id = dockItem.dataset.dockId;
    const win = document.getElementById(`win-${id}`);
    const dot = dockItem.querySelector('.dock-indicator');
    if (!dot || !win) return;
    dot.classList.toggle('active', !win.classList.contains('win-hidden'));
  });
}

/** Initialize drag on a window's title bar */
function initDrag(winEl) {
  const titleBar = winEl.querySelector('.win-titlebar');
  if (!titleBar) return;

  let startX, startY, startLeft, startTop;

  function onMouseMove(e) {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    const newLeft = Math.max(-winEl.offsetWidth + 80, startLeft + dx);
    const newTop = Math.max(28, startTop + dy); // keep below status bar
    winEl.style.left = newLeft + 'px';
    winEl.style.top = newTop + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  titleBar.addEventListener('mousedown', e => {
    if (e.target.closest('.win-btn')) return; // don't drag on buttons
    startX = e.clientX;
    startY = e.clientY;
    startLeft = winEl.offsetLeft;
    startTop = winEl.offsetTop;
    bringToFront(winEl);
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  // Touch support
  titleBar.addEventListener('touchstart', e => {
    if (e.target.closest('.win-btn')) return;
    const touch = e.touches[0];
    startX = touch.clientX;
    startY = touch.clientY;
    startLeft = winEl.offsetLeft;
    startTop = winEl.offsetTop;
    bringToFront(winEl);
  }, { passive: true });

  titleBar.addEventListener('touchmove', e => {
    const touch = e.touches[0];
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    winEl.style.left = Math.max(-winEl.offsetWidth + 80, startLeft + dx) + 'px';
    winEl.style.top = Math.max(28, startTop + dy) + 'px';
  }, { passive: true });
}

/** Initialize resize on a window's resize handle */
function initResize(winEl) {
  const handle = winEl.querySelector('.win-resize-handle');
  if (!handle) return;

  let startX, startY, startW, startH;
  const MIN_W = 280, MIN_H = 200;

  function onMouseMove(e) {
    const dw = e.clientX - startX;
    const dh = e.clientY - startY;
    winEl.style.width = Math.max(MIN_W, startW + dw) + 'px';
    winEl.style.height = Math.max(MIN_H, startH + dh) + 'px';
  }

  function onMouseUp() {
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  }

  handle.addEventListener('mousedown', e => {
    e.stopPropagation();
    startX = e.clientX;
    startY = e.clientY;
    startW = winEl.offsetWidth;
    startH = winEl.offsetHeight;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });
}

/** Initialize focus-on-click for a window */
function initFocus(winEl) {
  winEl.addEventListener('mousedown', () => bringToFront(winEl));
}

/** Bootstrap all windows on page load */
export function initWindowManager() {
  document.querySelectorAll('.window').forEach(win => {
    initDrag(win);
    initResize(win);
    initFocus(win);
  });

  // Auto-open window based on URL
  const path = window.location.pathname.replace(/^\//, '').replace(/\/$/, '');
  const validWindows = ['about', 'projects', 'blog', 'movies', 'books', 'contact'];
  if (path && validWindows.includes(path)) {
    openWindow(path);
  }

  updateDockIndicators();
}
