import { useState } from 'react';
import useScrollSteps from './useScrollSteps.js';

const pages = [
  { id: 'home', label: '首页' },
  { id: 'about', label: '关于' },
  { id: 'work', label: '作品' },
];

const projects = [
  {
    id: 'street',
    number: '01',
    title: '街区观察计划',
    type: '城市研究 · 公共项目',
    summary: '从日常行走出发，记录街区变化与真实使用者的感受。',
    evidence: ['项目记录', '公开文章'],
  },
  {
    id: 'data',
    number: '02',
    title: '公共数据手记',
    type: '研究写作 · 数据整理',
    summary: '把分散的公开资料整理成可阅读、可复核的研究笔记。',
    evidence: ['研究笔记', '资料来源'],
  },
  {
    id: 'weekend',
    number: '03',
    title: '周末影像档案',
    type: '影像记录 · 长期专题',
    summary: '用持续的影像专题，保留城市生活里容易被忽略的细节。',
    evidence: ['影像档案', '创作手记'],
  },
];

const evidenceSteps = [
  {
    id: 'experience',
    number: '01',
    label: '研究经历',
    text: '知道一个人长期关注什么',
    page: 'about',
  },
  {
    id: 'project',
    number: '02',
    label: '街区观察计划',
    text: '继续看见经历如何变成行动',
    page: 'work',
  },
  {
    id: 'evidence',
    number: '03',
    label: '项目记录与文章',
    text: '陈述背后，还有可以阅读的依据',
    page: 'work',
  },
];

function BrowserFrame({ page, children, compact = false }) {
  return (
    <div className={`demo-browser ${compact ? 'demo-browser--compact' : ''}`}>
      <div className="demo-browser__bar">
        <div className="demo-browser__dots" aria-hidden="true"><i /><i /><i /></div>
        <span className="demo-browser__address">linzhiyuan.demo / {page}</span>
        <span className="demo-browser__badge">DEMO</span>
      </div>
      {children}
    </div>
  );
}
function DemoNavigation({ page, onNavigate }) {
  return (
    <div className="demo-site__header">
      <span className="demo-site__brand">LIN ZHIYUAN</span>
      <div className="demo-site__nav" aria-label="演示网站页面">
        {pages.map((item) => (
          onNavigate ? (
            <button
              type="button"
              key={item.id}
              className={page === item.id ? 'is-active' : ''}
              aria-pressed={page === item.id}
              onClick={() => onNavigate(item.id)}
            >
              {item.label}
            </button>
          ) : (
            <span key={item.id} className={page === item.id ? 'is-active' : ''}>{item.label}</span>
          )
        ))}
      </div>
    </div>
  );
}

function HomePage({ compact }) {
  return (
    <div className="demo-home">
      <div className="demo-site__eyebrow">
        <span>RESEARCH / PROJECTS / NOTES</span>
        <span>KEEP EXPLORING</span>
      </div>
      <div className="demo-home__statement">
        <span className="demo-site__index">01 — HELLO</span>
        <p className="demo-person-name">林知远</p>
        <p className="demo-person-statement">把研究，<br />放回真实生活。</p>
        <p className="demo-person-intro">关注城市、技术与人的连接方式。这里收拢我的研究、项目，以及仍在生长的思考。</p>
      </div>
      {!compact && (
        <div className="demo-home__topics" aria-label="内容主题">
          <span>城市研究</span><span>公共项目</span><span>持续写作</span>
        </div>
      )}
      <div className="demo-home__footer">
        <span className="demo-monogram">知</span>
        <div><strong>研究 · 项目 · 写作</strong><span>一个持续更新的个人网址</span></div>
        <span className="demo-home__arrow" aria-hidden="true">↗</span>
      </div>
    </div>
  );
}

function AboutPage() {
  const items = [
    { label: '研究', title: '从问题开始', text: '关注城市空间、公共生活与技术变化。' },
    { label: '项目', title: '让思考进入现场', text: '把研究转化为可以参与、可以讨论的行动。' },
    { label: '写作', title: '保留理解的过程', text: '持续整理观察、方法与尚未有答案的问题。' },
  ];

  return (
    <div className="demo-about">
      <div className="demo-site__eyebrow"><span>ABOUT / THE PATH</span><span>02</span></div>
      <p className="demo-page-title">不止一份履历，<br />而是一条持续展开的路径。</p>
      <div className="demo-about__list">
        {items.map((item, index) => (
          <div className="demo-about__item" key={item.label}>
            <span>0{index + 1} / {item.label}</span>
            <div><strong>{item.title}</strong><p>{item.text}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WorkPage({ activeProject, onSelectProject, highlightEvidence }) {
  const project = projects[activeProject];

  return (
    <div className="demo-work">
      <div className="demo-site__eyebrow"><span>SELECTED WORK</span><span>03</span></div>
      <div className="demo-work__layout">
        <div className="demo-project-list" aria-label="演示项目">
          {projects.map((item, index) => (
            <button
              type="button"
              key={item.id}
              className={index === activeProject ? 'is-active' : ''}
              aria-pressed={index === activeProject}
              onClick={() => onSelectProject?.(index)}
              disabled={!onSelectProject}
            >
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <i aria-hidden="true">↗</i>
            </button>
          ))}
        </div>
        <div className="demo-project-detail">
          <span className="demo-project-detail__type">{project.type}</span>
          <p className="demo-project-detail__title">{project.title}</p>
          <p className="demo-project-detail__summary">{project.summary}</p>
          <div className={`demo-project-evidence ${highlightEvidence ? 'is-highlighted' : ''}`}>
            <span>RELATED EVIDENCE</span>
            <div>{project.evidence.map((item) => <strong key={item}>{item}<i aria-hidden="true">↗</i></strong>)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SiteCanvas({ page, activeProject, onNavigate, onSelectProject, highlightEvidence, compact = false }) {
  return (
    <div className={`demo-site demo-site--${page} ${compact ? 'demo-site--compact' : ''}`}>
      <DemoNavigation page={page} onNavigate={onNavigate} />
      <div className="demo-site__body">
        {page === 'home' && <HomePage compact={compact} />}
        {page === 'about' && <AboutPage />}
        {page === 'work' && (
          <WorkPage
            activeProject={activeProject}
            onSelectProject={onSelectProject}
            highlightEvidence={highlightEvidence}
          />
        )}
      </div>
    </div>
  );
}

export function HeroSitePreview() {
  return (
    <div className="hero-product" data-parallax="0.035" data-parallax-scale="-0.00005">
      <div className="hero-product__meta">
        <span>PERSONAL WEBSITE</span>
        <span>虚构演示 / 001</span>
      </div>
      <BrowserFrame page="home" compact>
        <SiteCanvas page="home" compact />
      </BrowserFrame>
      <div className="hero-product__caption">
        <span><i />首页 · 关于 · 作品</span>
        <span>经历与依据，都在一个网址</span>
      </div>
    </div>
  );
}

export default function ProductDemo() {
  const [page, setPage] = useState('home');
  const [device, setDevice] = useState('desktop');
  const [activeProject, setActiveProject] = useState(0);
  const [selectedEvidence, setSelectedEvidence] = useState('project');
  const scrollTrack = useScrollSteps(index => setPage(pages[index].id));

  const selectEvidence = (step) => {
    setSelectedEvidence(step.id);
    setPage(step.page);
    if (step.id !== 'experience') setActiveProject(0);
  };

  return (
    <div className="product-demo reveal">
      <div className="traveler-scroll-steps" ref={scrollTrack}><div className="traveler-scroll-steps__sticky">
      <div className="demo-toolbar">
        <div className="demo-page-switch" aria-label="切换演示页面">
          {pages.map((item) => (
            <button
              type="button"
              key={item.id}
              className={page === item.id ? 'is-active' : ''}
              aria-pressed={page === item.id}
              onClick={() => setPage(item.id)}
            >
              <span>{item.label}</span>
              <small>0{pages.findIndex((pageItem) => pageItem.id === item.id) + 1}</small>
            </button>
          ))}
        </div>
        <div className="demo-device-switch" aria-label="切换预览设备">
          <button type="button" className={device === 'desktop' ? 'is-active' : ''} aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}>
            <span className="device-icon device-icon--desktop" aria-hidden="true" />桌面
          </button>
          <button type="button" className={device === 'mobile' ? 'is-active' : ''} aria-pressed={device === 'mobile'} onClick={() => setDevice('mobile')}>
            <span className="device-icon device-icon--mobile" aria-hidden="true" />手机
          </button>
        </div>
      </div>

      <div className={`demo-stage demo-stage--${device}`}>
        <div className="demo-stage__coordinate demo-stage__coordinate--top" aria-hidden="true">VIEWPORT / {device === 'desktop' ? '1440' : '390'}</div>
        <div className="demo-device">
          <BrowserFrame page={page}>
            <SiteCanvas
              page={page}
              activeProject={activeProject}
              onNavigate={setPage}
              onSelectProject={setActiveProject}
              highlightEvidence={selectedEvidence === 'evidence'}
            />
          </BrowserFrame>
        </div>
        <div className="demo-stage__coordinate demo-stage__coordinate--bottom" aria-hidden="true">FICTIONAL CONTENT / PRODUCT DEMO</div>
      </div>

      </div></div>
      <div className="evidence-explorer">
        <div className="evidence-explorer__heading">
          <span className="kicker">FOLLOW THE EVIDENCE.</span>
          <p>点选经历、项目或依据，上方演示会切换到对应页面。</p>
        </div>
        <div className="evidence-path">
          {evidenceSteps.map((step, index) => (
            <div className="evidence-path__item" key={step.id}>
              <button
                type="button"
                className={selectedEvidence === step.id ? 'is-active' : ''}
                aria-pressed={selectedEvidence === step.id}
                data-spotlight="true"
                onClick={() => selectEvidence(step)}
              >
                <span>{step.number}</span>
                <strong>{step.label}</strong>
                <small>{step.text}</small>
              </button>
              {index < evidenceSteps.length - 1 && <i className="evidence-path__line" aria-hidden="true" />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
