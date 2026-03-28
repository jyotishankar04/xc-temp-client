"use client";

import { useEffect, useRef } from "react";

interface UseClickOutsideOptions {
  enabled?: boolean;
  handler: (event: MouseEvent | TouchEvent) => void;
}

export function useClickOutside<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null>,
  options: UseClickOutsideOptions
) {
  const { enabled = true, handler } = options;

  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;

    const handleEvent = (event: MouseEvent | TouchEvent) => {
      const el = ref?.current;
      if (!el || el.contains(event.target as Node)) return;
      savedHandler.current(event);
    };

    document.addEventListener("mousedown", handleEvent);
    document.addEventListener("touchstart", handleEvent);

    return () => {
      document.removeEventListener("mousedown", handleEvent);
      document.removeEventListener("touchstart", handleEvent);
    };
  }, [ref, enabled]);
}
