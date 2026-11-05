import { useEffect, useRef, useState } from 'react';
import { Asset, CTA, FAQ, Footer, Process, Vision } from '../components/Sections.jsx';
import ProductDemo from './OriginalProductDemo.jsx';
import { mechanisms, problems } from '../data.js';
import './traveler.css';
import './traveler-dark.css';

const faces = problems.map((item) => ({
  title: item.title,
  en: 'THE GAP',
  copy: item.title,
  detail: item.text,
}));
const storySteps = [
  { label: mechanisms[0].title, en: 'THE MECHANISM', title: mechanisms[0].title, copy: mechanisms[0].text, fields: ['首页', '关于', '作品'], note: mechanisms[0].proof },
  { label: mechanisms[1].title, en: 'THE MECHANISM', title: mechanisms[1].title, copy: mechanisms[1].text, fields: ['首页', '关于', '作品'], note: mechanisms[1].proof },
  { label: mechanisms[2].title, en: 'THE MECHANISM', title: mechanisms[2].title, copy: mechanisms[2].text, fields: ['经历', '项目', '依据'], note: mechanisms[2].proof },
];

function Arrow({ down = false }) { return <span aria-hidden="true">{down ? '↓' : '↗'}</span>; }
function BreadMark() { return <svg className="traveler-bread-mark" viewBox="0 0 32 34" fill="none" aria-hidden="true"><path d="M7 15C-2 9 5 1 16 2s18 7 9 13v14c0 2-2 3-4 3H11c-3 0-4-1-4-3V15Z" /><path d="M11 18v8m5-10v10m5-8v8" /></svg>; }
function FacetMark() { return <svg viewBox="0 0 32 36" fill="none" aria-hidden="true"><path d="M16 1 30 10v16L16 35 2 26V10L16 1Z M2 10l14 9 14-9M16 19v16M2 26l14-7 14 7M16 1v18" /></svg>; }

function TypedPrompt() {
  const prompts = ['把做过的作品，认真地介绍给别人。', '我有很多面，想让你慢慢认识。', '给经历、作品和热爱，一个共同的入口。'];
  const [text, setText] = useState(prompts[0]);
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let index = 0, count = prompts[0].length, deleting = false, timer;
    const tick = () => {
      if (!deleting && count === prompts[index].length) {
        deleting = true; timer = setTimeout(tick, 3200); return;
      }
      if (deleting) {
        count = Math.max(0, count - 2);
        if (!count) { deleting = false; index = (index + 1) % prompts.length; }
      } else count++;
      setText(prompts[index].slice(0, count));
      timer = setTimeout(tick, count === 0 ? 420 : deleting ? 35 : 105);
    };
    timer = setTimeout(tick, 1200);
    return () => clearTimeout(timer);
  }, []);
  return <div className="traveler-prompt traveler-reveal">
    <span className="traveler-prompt__tab" aria-hidden="true">“</span>
    <p className="traveler-label">从一句介绍开始</p>
    <div className="traveler-prompt__box" aria-hidden="true">{text}<i /></div>
    <span className="sr-only">把经历、作品和热爱，放进一个属于你的网站。</span>
    <small>YOUR STORY, IN YOUR OWN WAY.</small>
  </div>;
}

export default function TravelerPage() {
  const root = useRef(null), journey = useRef(null);
  const [chapter, setChapter] = useState(0);
  const [active, setActive] = useState(0), [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false), [face, setFace] = useState(1), [story, setStory] = useState(0);

  useEffect(() => {
    let previousStoryStep = -1;
    const onScroll = () => {
      const el = journey.current;
      if (!el) return;
      const viewportHeight = el.querySelector('.traveler-journey__viewport').offsetHeight;
      const overflow = Math.max(0, viewportHeight - innerHeight);
      const firstHeight = el.querySelector('.traveler-product-anchor').offsetTop + innerHeight;
      const range = Math.max(1, firstHeight - viewportHeight);
      const p = Math.max(0, Math.min(1, (scrollY - el.offsetTop - overflow) / range));
      const next = Math.max(0, Math.min(1, (scrollY - el.offsetTop - overflow - range) / (innerHeight * 1.5)));
      const handoff = Math.max(0, Math.min(1, (scrollY - el.offsetTop - overflow - range - innerHeight * 1.5) / (innerHeight * .55)));
      const storyProgress = (scrollY - el.offsetTop - overflow - range - innerHeight * 1.5) / (innerHeight * 1.4);
      if (storyProgress >= 0 && storyProgress <= 1) {
        const step = Math.min(2, Math.floor(storyProgress * 3));
        if (step !== previousStoryStep) { previousStoryStep = step; setStory(step); }
      }
      el.style.setProperty('--journey', p);
      const ease = (a, b) => { const t = Math.max(0, Math.min(1, (p-a)/(b-a))); return t*t*(3-2*t); };
      el.style.setProperty('--intro-out', ease(.12, .32));
      el.style.setProperty('--open', ease(.30, .78));
      el.style.setProperty('--settle', ease(.68, .94));
      el.style.setProperty('--paper-one', ease(.32, .62));
      el.style.setProperty('--paper-two', ease(.40, .70));
      el.style.setProperty('--paper-three', ease(.48, .78));
      const nextEase = (a, b) => { const t = Math.max(0, Math.min(1, (next-a)/(b-a))); return t*t*(3-2*t); };
      el.style.setProperty('--next-out', nextEase(.14, .40));
      el.style.setProperty('--story-open', nextEase(.32, .78));
      el.dataset.phase = handoff > .05 ? 'story-handoff' : next > .78 ? 'story-reading' : next > .14 ? 'story-opening' : p < .13 ? 'welcome' : p < .78 ? 'opening' : 'reading';
      setChapter(next > .4 ? 2 : p > .34 ? 1 : 0);
      setActive(scrollY > el.offsetTop + el.offsetHeight - innerHeight * .3 ? 3 : next > .4 ? 2 : p > .34 ? 1 : 0);
      setScrolled(scrollY > 40);
    };
    onScroll();
    // This route is lazy-loaded, so the browser may resolve its fragment before it exists.
    const fragmentFrame = requestAnimationFrame(() => {
      if (location.hash) {
        try { document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({ behavior: 'instant' }); }
        catch { /* An invalid URL fragment should not prevent the page from opening. */ }
      }
      onScroll();
    });
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    root.current.querySelectorAll('.reveal, .traveler-reveal').forEach(el => observer.observe(el));
    return () => { cancelAnimationFrame(fragmentFrame); removeEventListener('scroll', onScroll); removeEventListener('resize', onScroll); observer.disconnect(); };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = event => {
      if (event.key !== 'Escape') return;
      setMenuOpen(false);
      root.current?.querySelector('.traveler-menu')?.focus();
    };
    addEventListener('keydown', closeOnEscape);
    return () => removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return <div className="traveler" ref={root}>
    <a className="skip-link" href="#main-content">跳至主要内容</a>
    <div className="traveler-guides" aria-hidden="true"><i /><i /><i /></div>
    <div className={`traveler-notice ${scrolled ? 'is-hidden' : ''}`}><span>多面派 · 你的个人数字身份</span><a href="#contact">预约定制个人网站 <Arrow /></a></div>
    <header className={`traveler-nav ${scrolled ? 'is-scrolled' : ''}`}>
      <a className="traveler-brand" href="#top" aria-label="多面派首页" onClick={closeMenu}><FacetMark /><span>YOUNIVERSE<small>多面派</small></span></a>
      <nav className={menuOpen ? 'is-open' : ''} id="traveler-navigation" aria-label="主导航">
        <a href="#traveler-product" onClick={closeMenu}>不同面向</a><a href="#demo" onClick={closeMenu}>网站演示</a><a href="#process" onClick={closeMenu}>定制流程</a><a href="#faq" onClick={closeMenu}>常见问题</a>
      </nav>
      <a className="traveler-nav__cta" href="#contact">定制我的网站 <Arrow /></a>
      <button className="traveler-menu" type="button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-controls="traveler-navigation" aria-label={menuOpen ? '收起导航' : '展开导航'}>{menuOpen ? '关闭' : '菜单'} <span>{menuOpen ? '−' : '+'}</span></button>
    </header>

    <aside className={`traveler-rail ${active > 2 ? 'is-hidden' : ''}`} aria-label="页面章节">
      {['初次见面', '展开多面', '慢慢了解'].map((label, i) => <a key={label} href={['#top', '#traveler-product', '#traveler-thoughts'][i]} aria-current={active === i ? 'location' : undefined}><i /><span>{label}</span></a>)}
      <a className="traveler-rail__details" href="#demo">查看演示 ↓</a>
    </aside>

    <main id="main-content">
      <div className="traveler-journey" ref={journey} id="top" data-phase="welcome">
        <div className="traveler-product-anchor" id="traveler-product" /><div className="traveler-story-anchor" id="traveler-thoughts" />
        <div className="traveler-journey__viewport">
          <div className="traveler-section-stamp"><span>A LITTLE WARMTH. A WORLD OF YOU.</span><span>{['01 / 初次见面', '02 / 展开多面', '03 / 继续了解'][chapter]}</span></div>
          <section className="traveler-intro" aria-labelledby="traveler-title" aria-hidden={chapter !== 0} inert={chapter !== 0 ? true : undefined}>
            <div className="traveler-intro__headline">
              <div className="traveler-intro__brand">
                <h1 id="traveler-title">YOUNIVERSE</h1>
                <p className="traveler-intro__brand-descriptor"><span>多面派</span><span>你的个人数字身份</span></p>
              </div>
              <div className="traveler-intro__copy">
                <p className="traveler-intro__tagline">让第一印象，<br /><span>经得起了解。</span></p>
                <p className="traveler-intro__description">一个定制个人网站，呈现你的不同面向，<br />让关键介绍有据可查。</p>
                <div className="traveler-intro__actions"><a className="traveler-primary" href="#contact">预约定制个人网站 <Arrow down /></a><a className="traveler-text-link" href="#demo">查看产品演示 <Arrow /></a></div>
                <div className="traveler-prompt traveler-reveal"><p className="traveler-label">多页面网站 · 源码交付</p></div>
              </div>
            </div>
          </section>
          <section className="traveler-product" aria-labelledby="traveler-product-title" aria-hidden={chapter !== 1} inert={chapter !== 1 ? true : undefined}>
            <div className="traveler-product__copy"><p className="traveler-label">FIRST IMPRESSION.</p><h2 id="traveler-product-title">很多机会，<br /><span>输在第一次介绍。</span></h2><p className="traveler-product__intro">第一次介绍，对方看到的往往只有一句话、一张名片、几段零散经历。<br />是否继续了解，往往就取决于这些有限的信息。</p></div>
            <div className="traveler-folio" aria-label="第一次介绍的三个问题">
              {faces.map((item, i) => <button className={`traveler-paper traveler-paper--${i + 1}`} type="button" key={item.title} onClick={() => setFace(i)} aria-pressed={face === i}>
                <span className="traveler-paper__tab">0{i+1} / {item.en}</span>
                <span className="traveler-paper__icon" aria-hidden="true">{i === 0 ? '↗' : i === 1 ? '✳' : '✦'}</span>
                <strong>{item.title}</strong><span className="traveler-paper__summary">{item.detail}</span>
                <span className="traveler-paper__foot">{i === face ? '当前问题' : '查看问题'} <Arrow /></span>
              </button>)}
            </div>
            <div className="traveler-face-copy" key={face} aria-live="polite"><h3>{faces[face].copy}</h3><p>{faces[face].detail}</p></div>
            <a className="traveler-text-link" href="#demo">查看产品演示 <Arrow /></a>
          </section>
          <section className="traveler-story" aria-labelledby="traveler-story-title" aria-hidden={chapter !== 2} inert={chapter !== 2 ? true : undefined}>
            <p className="traveler-label">DIGITAL IDENTITY.</p>
            <h2 id="traveler-story-title">一个网址，<br /><span>让了解继续。</span></h2>
            <p className="traveler-story__intro">定制个人网站把分散的内容收进统一导航；经历关联项目，项目附上记录与来源，方便对方核验。</p>
            <div className="traveler-story__route" role="group" aria-label="展开了解的三个步骤">
              {storySteps.map((item, i) => <button type="button" key={item.label} aria-pressed={story === i} onClick={() => setStory(i)}><span>0{i+1}</span>{item.label}{i < 2 && <b aria-hidden="true">→</b>}</button>)}
            </div>
            <div className="traveler-story__sheet" key={story} aria-live="polite">
              <div className="traveler-story__sheet-top"><span>{storySteps[story].en}</span><span>{storySteps[story].proof || '内容结构示意'} / 0{story+1}</span></div>
              <h3>{storySteps[story].title}</h3><p>{storySteps[story].copy}</p>
              <div className="traveler-story__fields">{storySteps[story].fields.map((field,i) => <span key={field}><i>{['↗','✳','↗'][i]}</i>{field}</span>)}</div>
              <div className="traveler-story__sheet-foot"><BreadMark /><span>{storySteps[story].note}</span></div>
            </div>
            <a className="traveler-text-link" href="#demo">查看产品演示 <Arrow /></a>
          </section>
          <div className="traveler-screen-bottom"><span><BreadMark /> 多面派 · 你的个人数字身份</span><span className="traveler-journey__hint">{chapter === 2 ? '经历 · 项目 · 依据' : chapter ? '首页 · 关于 · 作品' : 'SCROLL TO EXPLORE'}</span><a href={chapter === 2 ? '#demo' : chapter ? '#traveler-thoughts' : '#traveler-product'}>{chapter === 2 ? '查看产品演示' : chapter ? '继续了解' : '向下滚动'} <Arrow down /></a></div>
        </div>
      </div>


      <div className="traveler-details">
        <section className="section traveler-live-demo" id="demo" aria-labelledby="traveler-demo-title"><div className="container">
          <div className="traveler-demo-stamp reveal"><span>THE STORY IS YOURS TO EXPLORE.</span><span>04 / 亲手翻阅</span></div>
          <div className="traveler-detail-heading reveal"><div><p className="traveler-label"><BreadMark /> PRODUCT DEMO.</p><h2 id="traveler-demo-title">从一句话，<span>继续了解一个人。</span></h2></div><p>以下为虚构人物与内容的产品演示。切换页面与设备，查看经历、项目与依据如何在同一个网址里相互连接。</p></div>
          <ProductDemo />
          <div className="traveler-demo-foot"><span>演示人物与项目为虚构，仅用于展示网站结构。</span><a className="traveler-text-link" href="#asset">你得到的不是页面，是数字资产 <Arrow down /></a></div>
        </div></section>
      </div>
      <div className="original-tail"><Asset /><Process /><FAQ /><Vision /><CTA /><Footer /></div>
    </main>
  </div>;
}
