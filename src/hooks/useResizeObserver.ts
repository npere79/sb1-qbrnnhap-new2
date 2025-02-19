import { useEffect, useState, useRef, RefObject } from 'react';

interface Dimensions {
  width: number | null;
  height: number | null;
}

const DEBOUNCE_DELAY = 100; // Increased delay for better performance

export function useResizeObserver(ref: RefObject<HTMLElement>): Dimensions {
  const [dimensions, setDimensions] = useState<Dimensions>({ width: null, height: null });
  const timeoutRef = useRef<number>();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new ResizeObserver((entries) => {
      // Clear existing timeout
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }

      // Debounce the update
      timeoutRef.current = window.setTimeout(() => {
        if (!Array.isArray(entries) || !entries.length) return;

        const entry = entries[0];
        const { width, height } = entry.contentRect;
        
        setDimensions({ width, height });
      }, DEBOUNCE_DELAY);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [ref]);

  return dimensions;
}