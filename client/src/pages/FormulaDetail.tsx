import { useEffect } from "react";
import { Link, useRoute } from "wouter";
import {
  ArrowLeft,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Lightbulb,
  Play,
  Quote,
} from "lucide-react";
import { allFormulas as formulas, getFormula } from "@/data/formulas";

const formulaImage = "https://abiting.cc/wp-content/uploads/2026/09/Bazaart_2CFD4296-8962-42D3-A411-DCA141E15615.jpeg";

export default function FormulaDetail() {
  const [, params] = useRoute("/formula/:slug");
  const formula = params ? getFormula(params.slug) : undefined;

  useEffect(() => {
    if (!formula) return;
    document.title = `${formula.name}（${formula.english}）`;
    const description = document.querySelector('meta[name="description"]');
    description?.setAttribute("content", formula.summary);
    const ogTitle = document.querySelector('meta[property="og:title"]');
    ogTitle?.setAttribute("content", `${formula.name}（${formula.english}）`);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    ogDescription?.setAttribute("content", formula.summary);
  }, [formula]);

  if (!formula) {
    return (
      <section className="not-found-page container">
        <div className="eyebrow"><span className="eyebrow-dot" /> 404 / FORMULA NOT FOUND</div>
        <h1>這張公式卡還沒整理好。</h1>
        <p>回到索引頁，從其他公式開始探索吧。</p>
        <Link href="/#formulas" className="button-primary">回到公式索引 <ArrowUpRight size={17} /></Link>
      </section>
    );
  }

  const currentIndex = formulas.findIndex((item) => item.slug === formula.slug);
  const nextFormula = formulas[(currentIndex + 1) % formulas.length];

  return (
    <article className="detail-page">
      <div className="container detail-breadcrumbs">
        <Link href="/">首頁</Link><ChevronRight size={14} /><Link href="/#formulas">公式索引</Link><ChevronRight size={14} /><span>{formula.name}</span>
      </div>
      <section className="detail-hero">
        <div className="container detail-hero-grid">
          <div className="detail-title-block">
            <Link href="/#formulas" className="back-link"><ArrowLeft size={15} /> 回到公式索引</Link>
            <div className="formula-row-meta"><span className="level-pill">{formula.level}</span><span>{formula.category}</span></div>
            <h1>{formula.name}</h1>
            <p className="detail-english">{formula.english}</p>
            <p className="detail-intro">{formula.summary}</p>
            <div className="detail-tags">{formula.tags.map((tag) => <span key={tag}>#{tag}</span>)}</div>
          </div>
          <div className="detail-equation-card">
            <div className="equation-label"><span>CORE EQUATION</span><span>#{String(currentIndex + 1).padStart(2, "0")}</span></div>
            <div className="big-equation">{formula.formula}</div>
            <div className="equation-bottom"><span><Play size={13} fill="currentColor" /> 先記住這個樣子</span><span>推導時間 03:20</span></div>
          </div>
        </div>
      </section>

      <section className="detail-content-section">
        <div className="container detail-content-grid">
          <div className="detail-main-content">
            <div className="content-kicker"><span>01</span><span>READ THE IDEA</span></div>
            <h2>先知道每個符號<br /><em>站在什麼位置。</em></h2>
            <p className="detail-body-intro">{formula.summary} 下面先把公式中的角色拆開，再一步一步回到它的來源。讀懂這個過程，你就能在忘記公式時自己把它重建出來。</p>

            <div className="variables-card">
              <div className="variables-icon"><BookOpen size={19} /></div>
              <div><span className="card-eyebrow">符號小辭典 / SYMBOLS</span><p>{formula.variables}</p></div>
            </div>

            <div className="proof-heading"><div className="content-kicker"><span>02</span><span>PROOF, STEP BY STEP</span></div><h2>推導證明</h2><p>不用跳步，每一行都說清楚它為什麼成立。</p></div>
            <div className="proof-list">
              {formula.proofSteps.map((step, index) => (
                <div className="proof-step" key={step}>
                  <div className="proof-step-number">{String(index + 1).padStart(2, "0")}</div>
                  <div className="proof-step-line" />
                  <p>{step}</p>
                </div>
              ))}
            </div>

            <div className="example-card">
              <div className="example-head"><span className="example-icon"><CheckCircle2 size={17} /></span><div><span className="card-eyebrow">試著算一次 / QUICK EXAMPLE</span><h3>把公式放回題目裡</h3></div></div>
              <p>{formula.example}</p>
            </div>

            <div className="memory-card"><Lightbulb size={20} /><div><span className="card-eyebrow">記憶鉤子 / MEMORY HOOK</span><p>{formula.memory}</p></div></div>
          </div>
          <aside className="detail-aside">
            <figure className="detail-image-card">
              <img src={formulaImage} alt={`${formula.name}推導示意與數學筆記圖片`} />
              <figcaption><span>VISUAL NOTE</span><strong>把抽象符號，<br />放回圖形與情境。</strong></figcaption>
            </figure>
            <div className="quote-card"><Quote size={22} /><p>真正會用公式的人，不是背得最多的人，而是知道它從哪裡來的人。</p><span>— 丁成老師</span></div>
            <div className="next-card"><span className="card-eyebrow">接著讀 / UP NEXT</span><Link href={`/formula/${nextFormula.slug}`}><strong>{nextFormula.name}</strong><ArrowUpRight size={17} /></Link><span>{nextFormula.category}</span></div>
          </aside>
        </div>
      </section>
    </article>
  );
}
