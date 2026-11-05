import { useEffect, useRef } from 'react';

export default function useScrollSteps(onStep, count = 3) {
  const track = useRef(null);
  const callback = useRef(onStep);
  callback.current = onStep;

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    let previous = -1;
    const update = () => {
      const rect = element.getBoundingClientRect();
      const content = element.firstElementChild;
      if (!content) return;
      const top = Math.min(90, innerHeight - content.offsetHeight - 16);
      element.style.setProperty('--step-sticky-top', `${top}px`);
      const distance = Math.max(1, element.offsetHeight - content.offsetHeight);
      const progress = (top - rect.top) / distance;
      if (progress < 0 || progress > 1) return;
      const step = Math.min(count - 1, Math.floor(progress * count));
      if (step !== previous) { previous = step; callback.current(step); }
    };
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    const observer = new ResizeObserver(update);
    observer.observe(element.firstElementChild);
    update();
    return () => { observer.disconnect(); removeEventListener('scroll', update); removeEventListener('resize', update); };
  }, [count]);
  return track;
}
