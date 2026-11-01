import { useEffect, useState, useCallback, useRef } from 'react';

export function useSpatialNav() {
  const [isTvMode, setIsTvMode] = useState<boolean>(() => {
    try {
      return localStorage.getItem('tvmax_tv_mode') === 'true';
    } catch {
      return false;
    }
  });

  const lastFocusedRef = useRef<HTMLElement | null>(null);
  const gamepadTimerRef = useRef<number | null>(null);
  const lastButtonTimeRef = useRef<number>(0);

  const toggleTvMode = useCallback(() => {
    setIsTvMode((prev) => {
      const next = !prev;
      localStorage.setItem('tvmax_tv_mode', String(next));
      if (next) {
        document.body.classList.add('tv-mode-active');
      } else {
        document.body.classList.remove('tv-mode-active');
      }
      return next;
    });
  }, []);

  // Set body class
  useEffect(() => {
    if (isTvMode) {
      document.body.classList.add('tv-mode-active');
    } else {
      document.body.classList.remove('tv-mode-active');
    }
  }, [isTvMode]);

  // Spatial Navigation Engine
  const moveFocus = useCallback((direction: 'up' | 'down' | 'left' | 'right') => {
    const focusableSelectors = [
      'button:not([disabled])',
      'a[href]',
      'input:not([disabled])',
      '[tabindex="0"]',
      '[data-nav="true"]',
    ].join(', ');

    const elements = Array.from(document.querySelectorAll<HTMLElement>(focusableSelectors)).filter(
      (el) => {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && window.getComputedStyle(el).visibility !== 'hidden';
      }
    );

    if (elements.length === 0) return;

    const current = (document.activeElement as HTMLElement) || lastFocusedRef.current || elements[0];
    const currentRect = current.getBoundingClientRect();

    let bestElement: HTMLElement | null = null;
    let minDistance = Infinity;

    elements.forEach((el) => {
      if (el === current) return;
      const rect = el.getBoundingClientRect();

      const dx = rect.left + rect.width / 2 - (currentRect.left + currentRect.width / 2);
      const dy = rect.top + rect.height / 2 - (currentRect.top + currentRect.height / 2);

      let isValidDirection = false;
      if (direction === 'right' && dx > 15) isValidDirection = true;
      if (direction === 'left' && dx < -15) isValidDirection = true;
      if (direction === 'down' && dy > 15) isValidDirection = true;
      if (direction === 'up' && dy < -15) isValidDirection = true;

      if (isValidDirection) {
        // Manhattan distance with directional weight
        const distance =
          direction === 'left' || direction === 'right'
            ? Math.abs(dx) + Math.abs(dy) * 2
            : Math.abs(dy) + Math.abs(dx) * 2;

        if (distance < minDistance) {
          minDistance = distance;
          bestElement = el;
        }
      }
    });

    if (bestElement) {
      (bestElement as HTMLElement).focus();
      (bestElement as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      lastFocusedRef.current = bestElement;
    }
  }, []);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle TV mode on 't' or 'T' if not inside an input
      if (
        !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName) &&
        (e.key === 't' || e.key === 'T')
      ) {
        toggleTvMode();
        return;
      }

      if (!isTvMode) return;

      // Handle arrows in TV Mode
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
          return;
        }
        e.preventDefault();
        switch (e.key) {
          case 'ArrowUp':
            moveFocus('up');
            break;
          case 'ArrowDown':
            moveFocus('down');
            break;
          case 'ArrowLeft':
            moveFocus('left');
            break;
          case 'ArrowRight':
            moveFocus('right');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isTvMode, moveFocus, toggleTvMode]);

  // Gamepad Controller Polling Loop
  useEffect(() => {
    let animId: number;

    const pollGamepad = () => {
      const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
      const gp = gamepads.find((g) => g && g.connected);

      if (gp) {
        const now = Date.now();
        if (now - lastButtonTimeRef.current > 200) {
          // D-Pad / Axes
          const axesX = gp.axes[0] || 0;
          const axesY = gp.axes[1] || 0;
          const dpadUp = gp.buttons[12]?.pressed;
          const dpadDown = gp.buttons[13]?.pressed;
          const dpadLeft = gp.buttons[14]?.pressed;
          const dpadRight = gp.buttons[15]?.pressed;

          const btnA = gp.buttons[0]?.pressed; // Confirm
          const btnB = gp.buttons[1]?.pressed; // Back

          if (dpadUp || axesY < -0.5) {
            moveFocus('up');
            lastButtonTimeRef.current = now;
          } else if (dpadDown || axesY > 0.5) {
            moveFocus('down');
            lastButtonTimeRef.current = now;
          } else if (dpadLeft || axesX < -0.5) {
            moveFocus('left');
            lastButtonTimeRef.current = now;
          } else if (dpadRight || axesX > 0.5) {
            moveFocus('right');
            lastButtonTimeRef.current = now;
          } else if (btnA) {
            const activeEl = document.activeElement as HTMLElement;
            if (activeEl) activeEl.click();
            lastButtonTimeRef.current = now;
          } else if (btnB) {
            window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
            lastButtonTimeRef.current = now;
          }
        }
      }

      animId = requestAnimationFrame(pollGamepad);
    };

    animId = requestAnimationFrame(pollGamepad);
    return () => cancelAnimationFrame(animId);
  }, [moveFocus]);

  return { isTvMode, toggleTvMode };
}
