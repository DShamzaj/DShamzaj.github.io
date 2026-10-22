import React, { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, ArrowDown, Github } from "lucide-react";
import { C, THEME, CSS, Nav, BrandIcon } from "./Portfolio.jsx";

/* Page content. The tool list itself lives in C.openSource (Portfolio.jsx). */
const L = {
  eyebrow: "Wazuh Ambassador · Pakistan",
  title: "Community Contributions",
  lead: "Selected by Wazuh as an Ambassador. Here is my official profile, followed by the free tools I build and publish for the community.",
  profileAlt: "Hamza Jameel's official Wazuh Ambassador profile: Senior Endpoint Security Engineer, Pakistan, with bio and quote.",
  profileLink: "https://wazuh.com/ambassadors-program/",
  explore: "Explore the tools",
  articlesHeading: "Read the write-ups",
  articlesIntro: "How each project works, why it exists, and how to deploy it.",
  ctaHeading: "Want one of these running in your environment?",
  ctaBody: "I deploy, tune and extend these for SOC teams and MSSPs. Tell me about your setup and I'll scope it on a short call.",
  ctaBtn: "Book a call",
  profile: "/ambassador-profile.png",
  bgBlur: "/ambassador-profile-blur.jpg",
};

const LAB_CSS = `
  .lab { color: var(--dark-muted); background: var(--dark-1); min-height: 100vh; position: relative; }
  .lab .nav { position: fixed; left: 0; right: 0; }
  .lab-bg, .lab-shade { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .lab-bg { background-size: cover; background-position: center; transform: scale(1.08); }
  .lab-shade { background: linear-gradient(180deg, rgba(10,14,26,.55), rgba(10,14,26,.88)); }
  .lab-body { position: relative; z-index: 1; }

  .lab-hero { padding: 128px 0 70px; }
  .lab-intro { max-width: 760px; margin: 0 auto 34px; text-align: center; }
  .lab-eyebrow { font-size: 15px; font-weight: 600; color: #7FA6FF; }
  .lab-hero h1 { font-size: clamp(38px, 6vw, 68px); font-weight: 700; line-height: 1; letter-spacing: -0.03em; margin: 12px 0 18px; color: #fff; }
  .lab-hero p { font-size: 18px; color: #C3CDE0; }
  .profile-wrap { max-width: 1376px; margin: 0 auto; padding: 0 20px; }
  .profile-frame { display: block; border-radius: 18px; overflow: hidden; border: 1px solid rgba(255,255,255,.14);
                   box-shadow: 0 40px 90px -30px rgba(0,0,0,.7); background: #26282e; transition: transform .3s, border-color .3s; }
  .profile-frame:hover { border-color: rgba(127,166,255,.6); }
  .profile-frame img { display: block; width: 100%; height: auto; image-rendering: auto; }
  .profile-cap { display: flex; justify-content: center; gap: 10px; flex-wrap: wrap; margin-top: 28px; }
  .profile-tip { display: none; text-align: center; font-size: 13px; color: var(--dark-muted); margin-top: 12px; }

  .lab-sec { padding: 40px 0 90px; }
  .lab-head { max-width: 640px; margin-bottom: 34px; }
  .lab-head h2 { color: var(--dark-ink); font-size: clamp(30px, 4.4vw, 46px); font-weight: 700; line-height: 1.08; }
  .lab-head p { color: var(--dark-muted); font-size: 17px; margin-top: 14px; }

  .tool-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px; }
  .tool { background: rgba(14,23,41,.58); border: 1px solid rgba(255,255,255,.10); border-radius: 22px; padding: 30px; display: flex; flex-direction: column;
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); transition: border-color .2s; }
  .tool:hover { border-color: rgba(47,107,246,.55); }
  .tool:first-child { grid-column: 1 / -1; }
  .tool .kind { font-size: 13px; font-weight: 600; color: #7FA6FF; }
  .tool h3 { color: #fff; font-size: 24px; font-weight: 700; margin: 6px 0 12px; }
  .tool:first-child h3 { font-size: 30px; }
  .tool p { color: #B7C2D6; font-size: 15px; margin-bottom: 18px; max-width: 70ch; }
  .tool .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 24px; }
  .tool .tag { font-size: 12.5px; font-weight: 500; color: #DCE4F2; background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.10); padding: 5px 11px; border-radius: 999px; }
  .tool .acts { display: flex; gap: 10px; flex-wrap: wrap; margin-top: auto; }
  .btn.btn--ghost { background: rgba(255,255,255,.08); color: #fff; border-color: rgba(255,255,255,.16); }
  .btn.btn--ghost:hover { border-color: var(--accent); background: rgba(47,107,246,.18); }

  .art-list { border-top: 1px solid rgba(255,255,255,.10); }
  .art { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding: 22px 4px; border-bottom: 1px solid rgba(255,255,255,.10); color: #fff; }
  .art:hover .art-t { color: #7FA6FF; }
  .art-t { font-family: var(--f-disp); font-size: 19px; font-weight: 600; transition: color .2s; }
  .art-s { font-size: 13px; color: var(--dark-muted); margin-top: 4px; }
  .art svg { flex-shrink: 0; color: #7FA6FF; }

  .lab-cta { background: rgba(14,23,41,.70); border: 1px solid rgba(255,255,255,.10); border-radius: 26px; padding: 44px; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
             display: grid; grid-template-columns: 1.4fr 1fr; gap: 30px; align-items: center; }
  .lab-cta h2 { color: #fff; font-size: clamp(26px, 3.4vw, 36px); line-height: 1.12; font-weight: 700; }
  .lab-cta p { color: #B7C2D6; margin-top: 12px; }
  .lab-cta .acts { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
  .lab-note { font-size: 13px; color: var(--sub); text-align: center; padding: 34px 0 10px; }
  .lab-foot { text-align: center; font-size: 13px; color: var(--sub); padding: 10px 0 40px; }
  .lab-foot a { color: var(--dark-muted); text-decoration: underline; }

  @media (max-width: 900px) {
    .tool-grid, .lab-cta { grid-template-columns: 1fr; }
    .lab-cta { padding: 30px; } .lab-cta .acts { justify-content: flex-start; }
    .lab-hero { padding-top: 112px; }
    .lab-hero p { font-size: 16px; }
    .profile-wrap { padding: 0 12px; }
    .profile-tip { display: block; }
  }
`;

export default function OpenSource() {
  const [p, setP] = useState(0); // 0 = top of page, 1 = scrolled past the hero

  useEffect(() => {
    const onScroll = () => setP(Math.min(1, Math.max(0, window.scrollY / (window.innerHeight * 0.75))));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items = C.openSource.items;
  const articles = items.filter((o) => o.article);

  return (
    <div className="pf lab">
      <style>{THEME}{CSS}{LAB_CSS}</style>
      <div className="lab-bg" style={{ backgroundImage: `url(${L.bgBlur})` }} aria-hidden="true" />
      <div className="lab-shade" style={{ opacity: 0.55 + p * 0.45 }} aria-hidden="true" />

      <Nav base="../" current="lab" />

      <div className="lab-body">
        <header className="lab-hero">
          <div className="wrap lab-intro">
            <div className="lab-eyebrow">{L.eyebrow}</div>
            <h1>{L.title}</h1>
            <p>{L.lead}</p>
          </div>
          <div className="profile-wrap" style={{ opacity: 1 - p * 0.35 }}>
            <a className="profile-frame" href={L.profile} target="_blank" rel="noopener noreferrer" title="Open full size">
              <img src={L.profile} alt={L.profileAlt} width="1336" height="856" />
            </a>
            <p className="profile-tip">Tap the profile to open it full size.</p>
            <div className="profile-cap">
              <a href="#tools" className="btn btn--accent">{L.explore} <ArrowDown size={16} /></a>
              <a href={L.profileLink} target="_blank" rel="noopener noreferrer" className="btn btn--ghost">Wazuh Ambassadors program <ArrowUpRight size={15} /></a>
            </div>
          </div>
        </header>

        <section id="tools" className="lab-sec">
          <div className="wrap">
            <div className="lab-head">
              <h2>{C.openSource.heading[0]} {C.openSource.heading[1]}</h2>
              <p>{C.openSource.intro}</p>
            </div>
            <div className="tool-grid">
              {items.map((o) => (
                <article className="tool" key={o.name}>
                  <span className="kind">{o.kind}</span>
                  <h3>{o.name}</h3>
                  <p>{o.blurb}</p>
                  <div className="tags">{o.tags.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
                  <div className="acts">
                    <a href={o.repo} target="_blank" rel="noopener noreferrer" className="btn btn--accent btn--sm"><Github size={15} /> View on GitHub</a>
                    {o.article && <a href={o.article} target="_blank" rel="noopener noreferrer" className="btn btn--ghost btn--sm">Read the article <ArrowUpRight size={15} /></a>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {articles.length > 0 && (
          <section className="lab-sec" style={{ paddingTop: 10 }}>
            <div className="wrap">
              <div className="lab-head"><h2>{L.articlesHeading}</h2><p>{L.articlesIntro}</p></div>
              <div className="art-list">
                {articles.map((o) => (
                  <a className="art" key={o.name} href={o.article} target="_blank" rel="noopener noreferrer">
                    <span><div className="art-t">{o.name}</div><div className="art-s">Medium · {o.kind}</div></span>
                    <ArrowUpRight size={20} />
                  </a>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="lab-sec" style={{ paddingTop: 10, paddingBottom: 20 }}>
          <div className="wrap">
            <div className="lab-cta">
              <div><h2>{L.ctaHeading}</h2><p>{L.ctaBody}</p></div>
              <div className="acts">
                <a href="../#contact" className="btn btn--accent">{L.ctaBtn} <ArrowRight size={16} /></a>
                <a href={C.socials.fiverr} target="_blank" rel="noopener noreferrer" className="btn btn--fiverr"><BrandIcon name="fiverr" /> Fiverr</a>
                <a href={C.socials.upwork} target="_blank" rel="noopener noreferrer" className="btn btn--upwork"><BrandIcon name="upwork" /> Upwork</a>
              </div>
            </div>
            <p className="lab-note">{C.openSource.disclaimer}</p>
            <p className="lab-foot">© {new Date().getFullYear()} {C.fullName} · <a href="../">Back to the main site</a></p>
          </div>
        </section>
      </div>
    </div>
  );
}
