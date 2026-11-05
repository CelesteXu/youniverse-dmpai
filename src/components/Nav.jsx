import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, BrandSymbol } from './Visuals.jsx';

const navItems = [
  { href: '#demo', label: '产品演示' },
  { href: '#asset', label: '数字资产' },
  { href: '#faq', label: '常见问题' },
];

export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeHref, setActiveHref] = useState('');
  const navRef = useRef(null);
  const toggleRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    const onResize = () => {
      if (window.innerWidth > 700) setMenuOpen(false);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector(item.href))
      .filter(Boolean);
    if (!('IntersectionObserver' in window)) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveHref(`#${entry.target.id}`);
        });
      },
      { rootMargin: '-24% 0px -62% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen);
    return () => document.body.classList.remove('menu-open');
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const navigation = navRef.current;
    const toggle = toggleRef.current;
    const links = Array.from(navigation.querySelectorAll('a[href]'));
    const firstLink = links[0];
    const lastLink = links[links.length - 1];
    const focusFrame = window.requestAnimationFrame(() => firstLink?.focus());

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
        window.requestAnimationFrame(() => toggle?.focus());
        return;
      }

      if (event.key !== 'Tab') return;
      const focusables = [...links, toggle];
      const currentIndex = focusables.indexOf(document.activeElement);
      if (event.shiftKey && currentIndex <= 0) {
        event.preventDefault();
        toggle?.focus();
      } else if (!event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        firstLink?.focus();
      } else if (!event.shiftKey && document.activeElement === lastLink) {
        event.preventDefault();
        toggle?.focus();
      } else if (event.shiftKey && document.activeElement === toggle) {
        event.preventDefault();
        lastLink?.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      window.cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className={`site-nav ${scrolled ? 'site-nav--scrolled' : ''}`}>
      <div className="nav-inner container">
        <a className="brand" href="#top" aria-label="YOUNIVERSE 首页" onClick={closeMenu}>
          <BrandSymbol className="brand__symbol" />
          <span className="brand__wordmark">YOUNIVERSE</span>
          <span className="brand__chinese">多面派</span>
        </a>

        <nav ref={navRef} className={`nav-links ${menuOpen ? 'nav-links--open' : ''}`} id="mobile-navigation" aria-label="主导航">
          <div className="nav-links__items">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className={activeHref === item.href ? 'is-active' : ''}
                aria-current={activeHref === item.href ? 'location' : undefined}
              >
                {item.label}
              </a>
            ))}
          </div>
          <a className="button button--outline button--small nav-cta" href="#contact" onClick={closeMenu}>
            <span>预约定制个人网站</span>
            <ArrowUpRight className="button__icon" />
          </a>
        </nav>

        <button
          ref={toggleRef}
          className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`}
          type="button"
          aria-label={menuOpen ? '关闭导航菜单' : '打开导航菜单'}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
