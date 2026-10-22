import React, { useEffect, useMemo, useState } from "react";
import { marked } from "marked";
import { ArrowLeft, ArrowRight, Link2, Check } from "lucide-react";
import { C, THEME, CSS, Nav, BrandIcon, sendToInbox, isEmail } from "./Portfolio.jsx";

/* ------------------------------------------------------------------
   HOW POSTS WORK
   Every .md file in the /posts folder becomes a post on this page.
   Files starting with "_" (like _TEMPLATE.md) are ignored.
   Each file starts with a small header between --- lines:
     title, date (YYYY-MM-DD), summary, type (issue or trend), tags
   Newest date shows first. Nothing else needs changing.
------------------------------------------------------------------- */
const files = import.meta.glob("../posts/*.md", { query: "?raw", import: "default", eager: true });

function parse(path, raw) {
  const slug = path.split("/").pop().replace(/\.md$/, "");
  const m = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*\r?\n?([\s\S]*)$/);
  const meta = {};
  let body = raw;
  if (m) {
    body = m[2];
    m[1].split(/\r?\n/).forEach((line) => {
      const i = line.indexOf(":");
      if (i > 0) meta[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    });
  }
  return {
    slug,
    title: meta.title || slug,
    date: meta.date || "",
    summary: meta.summary || "",
    type: (meta.type || "issue").toLowerCase() === "trend" ? "trend" : "issue",
    tags: (meta.tags || "").split(",").map((t) => t.trim()).filter(Boolean),
    body,
    minutes: Math.max(1, Math.round(body.split(/\s+/).length / 220)),
  };
}

const POSTS = Object.entries(files)
  .filter(([p]) => !p.split("/").pop().startsWith("_"))
  .map(([p, raw]) => parse(p, raw))
  .sort((a, b) => (b.date || "").localeCompare(a.date || ""));

const fmtDate = (d) => {
  const t = Date.parse(d);
  return isNaN(t) ? d : new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};

const N = {
  name: "The Detection Brief",
  lead: "Practical notes on Wazuh, detection engineering and SOC automation: new open-source releases, deployment walkthroughs and the security trends worth your attention.",
  formTitle: "Get new issues by email",
  formNote: "No spam. One email when a new issue is out. Unsubscribe any time by replying.",
  empty: "The first issue is on its way. Subscribe and it lands in your inbox.",
};

const NEWS_CSS = `
  .news { background: radial-gradient(120% 60% at 50% 0%, #10192E, var(--dark-1) 70%); min-height: 100vh; }
  .news-hero { padding: 132px 0 40px; text-align: center; }
  .news-eyebrow { font-size: 14px; font-weight: 600; color: var(--accent-text); }
  .news-hero h1 { font-size: clamp(40px, 6.4vw, 72px); font-weight: 700; line-height: 1; letter-spacing: -0.03em; margin: 12px 0 18px; }
  .news-hero p { max-width: 640px; margin: 0 auto; font-size: 18px; }
  .sub-box { max-width: 560px; margin: 32px auto 0; }
  .sub-box .emailbar { max-width: none; }
  .news-hero .sub-note, .sub-note { font-size: 13px; color: var(--sub); margin-top: 10px; }
  .news-hero .sub-msg { font-size: 14px; }
  .sub-msg { font-size: 14px; margin-top: 10px; color: var(--accent-text); } .sub-msg.err { color: #F08A73; }

  .news-filters { display: flex; justify-content: center; gap: 8px; margin: 46px 0 26px; flex-wrap: wrap; }
  .nf { font: 600 14px var(--f-body); padding: 8px 16px; border-radius: 999px; border: 1px solid var(--line); background: var(--card); color: var(--body); cursor: pointer; }
  .nf.on { background: var(--accent); border-color: var(--accent); color: #fff; }

  .post-list { max-width: 860px; margin: 0 auto 90px; display: grid; gap: 16px; }
  .post-card { display: block; background: var(--card); border: 1px solid var(--line); border-radius: 20px; padding: 28px 30px; color: inherit; transition: border-color .2s, transform .2s; }
  .post-card:hover { border-color: rgba(47,107,246,.55); transform: translateY(-2px); }
  .post-meta { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; font-size: 13px; color: var(--sub); }
  .ptype { font-size: 12px; font-weight: 600; padding: 3px 10px; border-radius: 999px; background: var(--accent-soft); color: var(--accent-text); text-transform: capitalize; }
  .ptype.trend { background: rgba(53,199,124,.14); color: #5BD99A; }
  .post-card h2 { font-size: 24px; font-weight: 700; margin: 12px 0 8px; line-height: 1.2; }
  .post-card p { font-size: 15.5px; }
  .post-tags { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; }
  .post-tags span { font-size: 12.5px; color: #DCE4F2; background: rgba(255,255,255,.06); border: 1px solid var(--line); padding: 4px 10px; border-radius: 999px; }
  .post-read { display: inline-flex; align-items: center; gap: 7px; margin-top: 18px; font-weight: 600; font-size: 14px; color: var(--accent-text); }
  .news-empty { text-align: center; color: var(--sub); padding: 40px 0 90px; }

  .article-wrap { max-width: 760px; margin: 0 auto; padding: 120px 0 40px; }
  .back { display: inline-flex; align-items: center; gap: 7px; font-size: 14px; font-weight: 600; color: var(--accent-text); background: none; border: none; cursor: pointer; padding: 0; }
  .article-head h1 { font-size: clamp(32px, 5vw, 50px); font-weight: 700; line-height: 1.08; letter-spacing: -0.02em; margin: 18px 0 14px; }
  .article-head .lede { font-size: 19px; color: var(--body); }
  .article-head .post-meta { margin-top: 18px; padding-bottom: 26px; border-bottom: 1px solid var(--line); }
  .copy-link { margin-left: auto; display: inline-flex; align-items: center; gap: 6px; font: 600 13px var(--f-body); color: var(--body); background: var(--card); border: 1px solid var(--line); border-radius: 999px; padding: 6px 12px; cursor: pointer; }

  .prose { font-size: 17px; line-height: 1.75; color: #C7D0E0; padding-top: 10px; }
  .prose > * + * { margin-top: 1.1em; }
  .prose h2 { font-size: 28px; font-weight: 700; margin-top: 1.8em; line-height: 1.2; }
  .prose h3 { font-size: 21px; font-weight: 700; margin-top: 1.5em; }
  .prose h4 { font-size: 17px; font-weight: 700; margin-top: 1.3em; }
  .prose a { color: var(--accent-text); text-decoration: underline; text-underline-offset: 3px; }
  .prose strong { color: #fff; }
  .prose ul, .prose ol { padding-left: 1.4em; } .prose li + li { margin-top: .4em; } .prose li::marker { color: var(--accent-text); }
  .prose blockquote { border-left: 3px solid var(--accent); background: rgba(47,107,246,.08); padding: 14px 18px; border-radius: 0 12px 12px 0; color: #DCE4F2; }
  .prose code { font-family: var(--f-mono); font-size: .88em; background: rgba(255,255,255,.07); border: 1px solid var(--line); padding: 2px 6px; border-radius: 6px; color: #E6EDF7; }
  .prose pre { background: #0B1120; border: 1px solid var(--line); border-radius: 14px; padding: 18px 20px; overflow-x: auto; }
  .prose pre code { background: none; border: none; padding: 0; font-size: 13.5px; line-height: 1.7; }
  .prose img { max-width: 100%; height: auto; border-radius: 14px; border: 1px solid var(--line); }
  .prose hr { border: none; border-top: 1px solid var(--line); margin: 2.2em 0; }
  .prose .tbl { overflow-x: auto; border: 1px solid var(--line); border-radius: 12px; }
  .prose table { width: 100%; border-collapse: collapse; font-size: 15px; }
  .prose th, .prose td { text-align: left; padding: 10px 14px; border-bottom: 1px solid var(--line); vertical-align: top; }
  .prose th { color: #fff; background: rgba(255,255,255,.04); font-weight: 600; }
  .prose tr:last-child td { border-bottom: none; }
  .article-sub { margin: 56px 0 30px; background: var(--card); border: 1px solid var(--line); border-radius: 22px; padding: 30px; text-align: center; }
  .article-sub h3 { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
  .news-foot { text-align: center; font-size: 13px; color: var(--sub); padding: 10px 0 40px; }
  .news-foot a { color: var(--dark-muted); text-decoration: underline; }
  @media (max-width: 600px) { .post-card { padding: 22px; } .prose { font-size: 16px; } .copy-link { margin-left: 0; } }
`;

function Subscribe() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("");
  const go = async () => {
    if (!isEmail(email)) { setState("bad"); return; }
    setState("sending");
    const ok = await sendToInbox({ subject: `New newsletter subscriber: ${email}`, from_name: "Newsletter signup", email, replyto: email, message: `${email} subscribed to ${N.name}.` });
    setState(ok ? "ok" : "err"); if (ok) setEmail("");
  };
  return (
    <div className="sub-box">
      <div className="emailbar">
        <input type="email" aria-label="Your email" placeholder="you@company.com" value={email} onChange={(e) => { setEmail(e.target.value); setState(""); }} onKeyDown={(e) => e.key === "Enter" && go()} />
        <button className="btn btn--accent" onClick={go} disabled={state === "sending"}>{state === "sending" ? "Subscribing…" : "Subscribe"}</button>
      </div>
      {state === "ok" && <p className="sub-msg" role="status">You're subscribed. New issues will reach your inbox.</p>}
      {state === "bad" && <p className="sub-msg err" role="alert">Enter a valid email address.</p>}
      {state === "err" && <p className="sub-msg err" role="alert">That didn't go through. Email {C.contact.email} to subscribe.</p>}
      {!state && <p className="sub-note">{N.formNote}</p>}
    </div>
  );
}

function renderMarkdown(md) {
  const html = marked.parse(md, { gfm: true, breaks: false });
  return html
    .replace(/<table>/g, '<div class="tbl"><table>').replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
}

export default function Newsletter() {
  const [slug, setSlug] = useState(() => decodeURIComponent(window.location.hash.slice(1)));
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const onHash = () => { setSlug(decodeURIComponent(window.location.hash.slice(1))); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const post = POSTS.find((p) => p.slug === slug);
  useEffect(() => { document.title = post ? `${post.title} — ${N.name}` : `${N.name} — Newsletter by ${C.fullName}`; }, [post]);

  const types = useMemo(() => Array.from(new Set(POSTS.map((p) => p.type))), []);
  const shown = POSTS.filter((p) => filter === "all" || p.type === filter);

  const copy = async () => {
    try { await navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <div className="pf news">
      <style>{THEME}{CSS}{NEWS_CSS}</style>
      <Nav base="../" current="news" />

      {post ? (
        <main className="wrap">
          <article className="article-wrap">
            <button className="back" onClick={() => { window.location.hash = ""; }}><ArrowLeft size={16} /> All issues</button>
            <header className="article-head">
              <h1>{post.title}</h1>
              {post.summary && <p className="lede">{post.summary}</p>}
              <div className="post-meta">
                <span className={`ptype ${post.type}`}>{post.type}</span>
                {post.date && <span>{fmtDate(post.date)}</span>}
                <span>· {post.minutes} min read</span>
                <button className="copy-link" onClick={copy}>{copied ? <><Check size={14} /> Copied</> : <><Link2 size={14} /> Copy link</>}</button>
              </div>
            </header>
            <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.body) }} />
            <div className="article-sub">
              <h3>{N.formTitle}</h3>
              <p>{N.lead}</p>
              <Subscribe />
            </div>
          </article>
        </main>
      ) : (
        <main>
          <header className="news-hero wrap">
            <div className="news-eyebrow">Newsletter · by {C.fullName}</div>
            <h1>{N.name}</h1>
            <p>{N.lead}</p>
            <Subscribe />
          </header>
          <div className="wrap">
            {POSTS.length === 0 ? <p className="news-empty">{N.empty}</p> : (
              <>
                {types.length > 1 && (
                  <div className="news-filters">
                    {["all", ...types].map((t) => <button key={t} className={`nf ${filter === t ? "on" : ""}`} onClick={() => setFilter(t)}>{t === "all" ? "All" : t === "issue" ? "Issues" : "Trends"}</button>)}
                  </div>
                )}
                <div className="post-list" style={types.length > 1 ? undefined : { marginTop: 50 }}>
                  {shown.map((p) => (
                    <a className="post-card" key={p.slug} href={`#${p.slug}`}>
                      <div className="post-meta"><span className={`ptype ${p.type}`}>{p.type}</span>{p.date && <span>{fmtDate(p.date)}</span>}<span>· {p.minutes} min read</span></div>
                      <h2>{p.title}</h2>
                      {p.summary && <p>{p.summary}</p>}
                      {p.tags.length > 0 && <div className="post-tags">{p.tags.map((t) => <span key={t}>{t}</span>)}</div>}
                      <span className="post-read">Read issue <ArrowRight size={15} /></span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      )}
      <p className="news-foot">© {new Date().getFullYear()} {C.fullName} · <a href="../">Main site</a> · <a href="../open-source/">{C.lab.label}</a></p>
    </div>
  );
}
