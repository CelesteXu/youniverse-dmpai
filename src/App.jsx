import { useEffect } from 'react';
import Nav from './components/Nav.jsx';
import { Asset, CTA, Demo, FAQ, Footer, Hero, Identity, Problem, Process, Vision } from './components/Sections.jsx';

const stars = [
  { left: '7%', top: '14%', size: 2, delay: '-3s', tone: 'white' },
  { left: '17%', top: '63%', size: 1, delay: '-11s', tone: 'gold' },
  { left: '28%', top: '29%', size: 1, delay: '-7s', tone: 'white' },
  { left: '39%', top: '82%', size: 2, delay: '-15s', tone: 'white' },
  { left: '48%', top: '9%', size: 1, delay: '-4s', tone: 'gold' },
  { left: '58%', top: '48%', size: 1, delay: '-9s', tone: 'white' },
  { left: '67%', top: '21%', size: 2, delay: '-13s', tone: 'gold' },
  { left: '74%', top: '72%', size: 1, delay: '-6s', tone: 'white' },
  { left: '83%', top: '38%', size: 1, delay: '-17s', tone: 'white' },
  { left: '91%', top: '11%', size: 2, delay: '-8s', tone: 'gold' },
  { left: '95%', top: '88%', size: 1, delay: '-2s', tone: 'white' },
  { left: '4%', top: '91%', size: 1, delay: '-12s', tone: 'white' },
];

function StarField() {
  return (
    <div className="ambient-stars" data-parallax="0.006" aria-hidden="true">
      {stars.map((star, index) => (
        <i
          key={index}
          className={`star star--${star.tone}`}
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: star.delay,
          }}
        />
      ))}
    </div>
  );
}

export default function App() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const revealElements = document.querySelectorAll('.reveal');

    if (reducedMotion.matches || !('IntersectionObserver' in window)) {
      revealElements.forEach((element) => element.classList.add('is-visible'));
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -48px' },
    );

    revealElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) return undefined;

    const layers = Array.from(document.querySelectorAll('[data-parallax]'));
    let frame = null;

    const measure = () => {
      for (const layer of layers) {
        const prev = layer.style.transform;
        layer.style.transform = 'none';
        const rect = layer.getBoundingClientRect();
        layer.dataset.docTop = String(rect.top + window.scrollY);
        layer.dataset.docHeight = String(rect.height);
        layer.style.transform = prev;
      }
    };

    const update = () => {
      const viewportH = window.innerHeight;
      const viewportCenter = window.scrollY + viewportH / 2;
      for (const layer of layers) {
        const docTop = Number(layer.dataset.docTop || 0);
        const docHeight = Number(layer.dataset.docHeight || 0);
        const dist = docTop + docHeight / 2 - viewportCenter;
        const x = Number(layer.dataset.parallaxX || 0) * dist;
        const y = Number(layer.dataset.parallax || 0) * dist;
        const scaleRate = Number(layer.dataset.parallaxScale || 0);
        const scale = scaleRate ? Math.max(0.001, 1 + scaleRate * dist) : 1;
        layer.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
      }
      frame = null;
    };

    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };
    const onResize = () => {
      measure();
      update();
    };

    measure();
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const bar = document.querySelector('.scroll-progress');
    if (!bar) return undefined;

    let frame = null;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${progress})`;
      frame = null;
    };
    const onScroll = () => {
      if (frame === null) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    if (reducedMotion.matches || !finePointer.matches) return undefined;

    const onMove = (event) => {
      const target = event.target.closest?.('[data-spotlight]');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      target.style.setProperty('--spot-x', `${event.clientX - rect.left}px`);
      target.style.setProperty('--spot-y', `${event.clientY - rect.top}px`);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, []);

  return (
    <>
      <div className="scroll-progress" aria-hidden="true" />
      <a className="skip-link" href="#main-content">跳至主要内容</a>
      <div className="site-atmosphere" aria-hidden="true" />
      <StarField />
      <Nav />
      <main id="main-content">
        <Hero />
        <Problem />
        <Demo />
        <Identity />
        <Asset />
        <Process />
        <FAQ />
        <Vision />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
