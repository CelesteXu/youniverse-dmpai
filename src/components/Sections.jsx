import { useEffect, useRef, useState } from 'react';
import {
  assets,
  bookingEmail,
  bookingHref,
  comparisonRows,
  faqs,
  getBookingHref,
  mechanisms,
  plans,
  problems,
  processSteps,
  wechatId,
} from '../data.js';
import ProductDemo, { HeroSitePreview } from './ProductDemo.jsx';
import { SectionHeader, SpotlightPanel, TextButton } from './UI.jsx';
import { ArrowUpRight, AssetOrbit, CtaGeometry, FacetFloat, LineGlyph, OrbitSignature } from './Visuals.jsx';

export function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-brand-scroll" data-parallax="-0.02">
        <div className="hero-brand container hero-enter" style={{ '--enter-order': 0 }}>
          <OrbitSignature className="hero-brand__orbit" />
          <p className="hero-brand__name" aria-label="Youniverse">YOUNIVERSE</p>
          <div className="hero-brand__descriptor">
            <span>多面派</span>
            <span>你的个人数字身份</span>
          </div>
        </div>
      </div>
      <div className="hero-inner container">
        <div className="hero-copy" data-parallax="0.015">
          <h1 id="hero-title" className="hero-enter" style={{ '--enter-order': 1 }}>
            让第一印象，<br />
            <span>经得起了解。</span>
          </h1>
          <p className="hero-subtitle hero-enter" style={{ '--enter-order': 2 }}>
            一个定制个人网站，呈现你的不同面向，<br className="desktop-break" />
            让关键介绍有据可查。
          </p>
          <div className="hero-actions hero-enter" style={{ '--enter-order': 3 }}>
            <TextButton href="#contact" className="button--primary">预约定制个人网站</TextButton>
            <TextButton href="#demo" className="button--outline">查看产品演示</TextButton>
          </div>
          <div className="hero-meta hero-enter" style={{ '--enter-order': 4 }} aria-label="交付特点">
            <span>多页面网站</span>
            <span>源码交付</span>
          </div>
        </div>
        <div className="hero-enter hero-enter--visual" style={{ '--enter-order': 2 }}>
          <HeroSitePreview />
        </div>
      </div>
      <div className="hero-scroll container" aria-hidden="true">
        <span>SCROLL TO EXPLORE</span>
        <i />
      </div>
    </section>
  );
}

export function Problem() {
  return (
    <section className="section problem-section" id="why" aria-labelledby="why-title">
      <FacetFloat className="facet-float--problem" parallax="0.045" />
      <div className="container">
        <SectionHeader
          kicker="FIRST IMPRESSION."
          title="很多机会，输在第一次介绍。"
          intro="第一次介绍，对方看到的往往只有一句话、一张名片、几段零散经历。是否继续了解，往往就取决于这些有限的信息。"
          id="why-title"
        />
        <div className="problem-grid">
          {problems.map((problem, index) => (
            <article className="problem-card reveal" key={problem.number} style={{ '--delay': `${index * 80}ms` }}>
              <div className="card-topline">
                <span>{problem.number}</span>
                <span>THE GAP</span>
              </div>
              <LineGlyph type={problem.type} />
              <h3>{problem.title}</h3>
              <p>{problem.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Demo() {
  return (
    <section className="section demo-section" id="demo" aria-labelledby="demo-title">
      <div className="container">
        <SectionHeader
          kicker="PRODUCT DEMO."
          title="从一句话，继续了解一个人。"
          intro="以下为虚构人物与内容的产品演示。切换页面与设备，查看经历、项目与依据如何在同一个网址里相互连接。"
          id="demo-title"
        />
        <ProductDemo />
      </div>
    </section>
  );
}

export function Identity() {
  return (
    <section className="section identity-section" id="identity" aria-labelledby="identity-title">
      <FacetFloat className="facet-float--identity" parallax="-0.035" />
      <div className="container identity-layout">
        <div className="identity-heading">
          <SectionHeader
            kicker="DIGITAL IDENTITY."
            title="一个网址，让了解继续。"
            intro="定制个人网站把分散的内容收进统一导航；经历关联项目，项目附上记录与来源，方便对方核验。"
            id="identity-title"
          />
          <p className="identity-note reveal">第一印象，只是了解的开始。</p>
        </div>
        <div className="mechanism-list">
          {mechanisms.map((mechanism, index) => (
            <article className="mechanism-row reveal" key={mechanism.number} style={{ '--delay': `${index * 70}ms` }}>
              <span className="mechanism-number">{mechanism.number}</span>
              <div className="mechanism-copy">
                <h3>{mechanism.title}</h3>
                <p>{mechanism.text}</p>
                <span className="mechanism-proof">{mechanism.proof}</span>
              </div>
              <LineGlyph type={mechanism.type} />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Asset() {
  const listRef = useRef(null);

  useEffect(() => {
    const list = listRef.current;
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lockedUntil = 0;
    const onWheel = (event) => {
      if (motion.matches || event.ctrlKey || Math.abs(event.deltaY) < Math.abs(event.deltaX)) return;
      const rows = Array.from(list.children);
      const center = window.innerHeight / 2;
      const bounds = list.getBoundingClientRect();
      if (center < bounds.top || center > bounds.bottom) return;
      const now = Date.now();
      if (now < lockedUntil) { event.preventDefault(); return; }
      const current = rows.reduce((closest, row, index) => {
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(rect.top + rect.height / 2 - center);
        return distance < closest.distance ? { index, distance } : closest;
      }, { index: 0, distance: Infinity }).index;
      const next = current + (event.deltaY > 0 ? 1 : -1);
      if (!event.deltaY || next < 0 || next >= rows.length) return;
      event.preventDefault();
      lockedUntil = now + 700;
      rows[next].scrollIntoView({ behavior: 'smooth', block: 'center' });
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, []);

  return (
    <section className="section asset-section" id="asset" aria-labelledby="asset-title">
      <div className="container">
        <div className="asset-shell">
          <SectionHeader
            kicker="DIGITAL ASSET."
            title="你得到的不是页面，是数字资产。"
            intro="源码与部署教程交付给你，之后可自行更新内容，长期使用同一个网址。"
            id="asset-title"
            className="asset-header"
          />
          <div className="asset-content">
            <AssetOrbit />
            <div className="asset-list" ref={listRef}>
              {assets.map((asset, index) => (
                <article className="asset-item reveal" key={asset.number} style={{ '--delay': `${index * 70}ms` }}>
                  <span>{asset.number}</span>
                  <div>
                    <h3>{asset.title}</h3>
                    <p>{asset.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <p className="asset-closing reveal">信任复利，<span>从现在开始。</span></p>
        </div>
      </div>
    </section>
  );
}

function PlanComparison() {
  const [selectedPlan, setSelectedPlan] = useState(1);

  return (
    <div className="plan-comparison reveal">
      <div className="comparison-heading">
        <div>
          <span className="kicker">COMPARE THE DETAILS.</span>
          <h3>四档方案，逐项比较。</h3>
        </div>
        <p>比较信息结构、叙事、视觉、微调次数与交付方式。</p>
      </div>

      <div className="comparison-mobile-switch" aria-label="选择要比较的方案">
        {plans.map((plan, index) => (
          <button
            type="button"
            key={plan.code}
            className={selectedPlan === index ? 'is-active' : ''}
            aria-pressed={selectedPlan === index}
            onClick={() => setSelectedPlan(index)}
          >
            {plan.name}
          </button>
        ))}
      </div>

      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <caption className="sr-only">切面、深度、维度、全景 四档个人网站方案交付比较</caption>
          <thead>
            <tr>
              <th scope="col">交付内容</th>
              {plans.map((plan) => <th scope="col" key={plan.code}>{plan.name} <span>{plan.en}</span></th>)}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                {row.values.map((value, index) => <td key={`${row.label}-${plans[index].code}`}>{value}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="comparison-mobile">
        <div className="comparison-mobile__title">
          <strong>{plans[selectedPlan].name} {plans[selectedPlan].en}</strong>
          <span>{plans[selectedPlan].beta}</span>
        </div>
        <dl>
          {comparisonRows.map((row) => (
            <div key={row.label}>
              <dt>{row.label}</dt>
              <dd>{row.values[selectedPlan]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function Pricing() {
  return (
    <section className="section pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHeader
          kicker="PRICING."
          title="选择适合你的定制方案。"
          intro="二测期间，四档方案均享早鸟 4.8 折。交付完整个人网站源码与部署教程，无平台年费。"
          id="pricing-title"
        />
        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <article
              className={`price-card reveal ${plan.featured ? 'price-card--featured' : ''}`}
              key={plan.code}
              data-spotlight="true"
              style={{ '--delay': `${index * 80}ms` }}
            >
              <div className="price-card__header">
                <div>
                  <span className="plan-code">{plan.code}</span>
                  <h3>{plan.name}</h3>
                  {plan.en && <span className="plan-en">{plan.en}</span>}
                </div>
                {plan.featured && <span className="plan-tag">推荐</span>}
                {plan.upcoming && <span className="plan-tag plan-tag--upcoming">在研中</span>}
              </div>
              <p className="price-description">{plan.description}</p>
              <div className="price-block">
                <div className="price-label">
                  <span>二测早鸟价</span>
                  <del>原价 {plan.original}</del>
                </div>
                <p className="price">{plan.beta}</p>
              </div>
              <ul className="plan-features">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <div className="booking-price">
                <span>预约折后</span>
                <strong>{plan.booking}</strong>
              </div>
              {plan.upcoming ? (
                <span className="button price-card__button button--outline" aria-disabled="true">
                  <span>本轮不开放</span>
                </span>
              ) : (
                <a className={`button price-card__button ${plan.featured ? 'button--primary' : 'button--outline'}`} href={getBookingHref(plan)}>
                  <span>预约 {plan.name}</span>
                  <ArrowUpRight className="button__icon" />
                </a>
              )}
            </article>
          ))}
        </div>

        <PlanComparison />

        <div className="pricing-terms reveal">
          <div><span>预约权益</span><p>预约访谈或问卷提交，在二测早鸟价基础上再享 9 折。</p></div>
          <div><span>付款方式</span><p>确认需求与排期后，支付 30% 定金启动制作。</p></div>
        </div>
        <div className="pricing-action reveal">
          <div className="pricing-action__copy">
            <span className="status-dot" />
            <p>已经想清楚，或还不确定选哪档，都可以从一次预约开始。</p>
          </div>
          <TextButton href="#contact" className="button--primary">预约定制个人网站</TextButton>
        </div>
      </div>
    </section>
  );
}

export function Process() {
  return (
    <section className="section process-section" id="process" aria-labelledby="process-title">
      <div className="container">
        <SectionHeader
          kicker="HOW IT WORKS."
          title="从预约，到属于你的网站。"
          intro="六个步骤，从预约沟通到交付源码与部署教程。"
          id="process-title"
        />
        <div className="process-list">
          {processSteps.map((step, index) => (
            <article className="process-step reveal" key={step.number} style={{ '--delay': `${index * 70}ms` }}>
              <span className="process-step__number">{step.number}</span>
              <div className="process-step__line" aria-hidden="true"><i /></div>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQ() {
  return (
    <section className="section faq-section" id="faq" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div className="faq-heading">
          <SectionHeader
            kicker="BEFORE WE BEGIN."
            title="开始之前，先把问题说清楚。"
            intro="以下回答交付、预览、部署与授权的实际问题。"
            id="faq-title"
          />
        </div>
        <div className="faq-list reveal">
          {faqs.map((faq, index) => (
            <details key={faq.question} open={index === 0}>
              <summary>
                <span>{faq.question}</span>
                <i aria-hidden="true" />
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Vision() {
  return (
    <section className="section vision-section" id="vision" aria-labelledby="vision-title">
      <div className="container">
        <h2 className="kicker reveal" id="vision-title">使命与愿景 / MISSION & VISION</h2>
        <SpotlightPanel className="vision-grid">
          <div className="vision-item reveal">
            <span>使命 / MISSION.</span>
            <p>让机会，<br />不再输给第一印象。</p>
          </div>
          <div className="vision-item reveal" style={{ '--delay': '90ms' }}>
            <span>愿景 / VISION.</span>
            <p>让信任，<br />不再靠运气。</p>
          </div>
        </SpotlightPanel>
      </div>
    </section>
  );
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  const copied = document.execCommand('copy');
  document.body.removeChild(textarea);
  if (!copied) throw new Error('Copy failed');
}

export function CTA() {
  const [copyStatus, setCopyStatus] = useState('');

  const handleCopy = async (text, successLabel) => {
    try {
      await copyText(text);
      setCopyStatus(successLabel);
    } catch {
      setCopyStatus('复制失败，请手动复制');
    }
  };

  return (
    <section className="section cta-section" id="contact" aria-labelledby="cta-title">
      <div className="container">
        <div className="cta-shell reveal">
          <div className="cta-geometry-wrap">
            <CtaGeometry />
          </div>
          <div className="cta-content">
            <p className="kicker">YOUR UNIVERSE STARTS HERE.</p>
            <h2 id="cta-title">你的个人网站，<br />从这里开始。</h2>
            <p>预约定制；随后通过访谈或问卷，确认需求与排期。</p>
            <div className="cta-actions">
              <a className="button button--primary button--large" href={bookingHref}>
                <span>预约定制个人网站</span>
                <ArrowUpRight className="button__icon" />
              </a>
              <button className="button button--outline button--large" type="button" onClick={() => handleCopy(bookingEmail, '邮箱已复制')}>复制邮箱</button>
              <button className="button button--outline button--large" type="button" onClick={() => handleCopy(wechatId, '微信已复制')}>复制微信</button>
            </div>
            <div className="cta-contact-line">
              <a href={`mailto:${bookingEmail}`}>{bookingEmail}</a>
              <span>微信 {wechatId}</span>
              <span role="status" aria-live="polite">{copyStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <div className="footer-brand">
          <span className="brand__wordmark">YOUNIVERSE</span>
          <p>多面派 · Youniverse</p>
        </div>
        <div className="footer-contact">
          <span>CONTACT.</span>
          <a href={`mailto:${bookingEmail}`}>{bookingEmail}</a>
          <span>微信 {wechatId}</span>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 多面派 · Youniverse</span>
        <a href="#top">回到顶部 ↑</a>
      </div>
    </footer>
  );
}
