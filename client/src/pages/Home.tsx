import { useMemo, useState } from "react";
import { Link } from "wouter";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Compass,
  Grid2X2,
  Search,
  Sparkles,
  Target,
} from "lucide-react";
import { allFormulas as formulas, categories, featuredSlugs } from "@/data/formulas";

const heroImage = "https://abiting.cc/wp-content/uploads/2026/09/Bazaart_A56EE7E9-5473-456E-A809-81C363DE6044.jpeg";

export default function Home() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部公式");

  const visibleFormulas = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return formulas.filter((formula) => {
      const matchesCategory = activeCategory === "全部公式" || formula.category === activeCategory;
      const searchable = [formula.name, formula.english, formula.summary, formula.formula, ...formula.tags].join(" ").toLowerCase();
      return matchesCategory && (!normalized || searchable.includes(normalized));
    });
  }, [activeCategory, query]);

  const featured = featuredSlugs.map((slug) => formulas.find((formula) => formula.slug === slug)).filter(Boolean);

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> 給國高中生的數學自學工具 <span className="eyebrow-line" /></div>
            <h1>丁氏數學<br /><em>公式寶典</em></h1>
            <p className="hero-lead">不只背公式，從每一步推導開始，把數學真正變成自己的語言。</p>
            <p className="hero-description">丁氏數學公式寶典提供最齊全的國、高中數學公式，且每種公式皆附帶推導過程，是莘莘學子準備小考、段考、學測與指考最好的助手。</p>
            <div className="hero-actions">
              <a href="#formulas" className="button-primary">探索公式索引 <ArrowDownRight size={17} /></a>
              <a href="#about" className="button-quiet">了解這本寶典 <ArrowUpRight size={16} /></a>
            </div>
            <div className="hero-proof">
              <span><Check size={14} /> 適合自學複習</span>
              <span><Check size={14} /> 每題附推導</span>
              <span><Check size={14} /> 全站免費閱讀</span>
            </div>
          </div>
          <div className="hero-art-wrap">
            <div className="hero-art-shadow" />
            <div className="hero-art-card">
              <img src={heroImage} alt="丁氏數學公式寶典的數學筆記主視覺" />
              <div className="hero-art-overlay" />
              <div className="hero-art-caption">
                <span className="caption-label">FORMULA / 001</span>
                <strong>把複雜的式子<br />還原成清楚的思路</strong>
              </div>
              <div className="formula-sticker sticker-one">a² + b² = c²</div>
              <div className="formula-sticker sticker-two">∑ n = n(n+1)/2</div>
              <div className="hero-art-corner">DING<br />MATH<br />2026</div>
            </div>
            <div className="art-note"><span>01</span> 從理解開始，而不是從死背開始。</div>
          </div>
        </div>
        <div className="container hero-stats">
          <div><strong>{formulas.length}</strong><span>收錄公式</span></div>
          <div><strong>06</strong><span>大分類</span></div>
          <div><strong>100%</strong><span>附推導說明</span></div>
          <div className="stats-note">/ 公式是壓縮過的推理，<br />展開它，你就看見數學。</div>
        </div>
      </section>

      <section className="intro-section" id="about">
        <div className="container intro-grid">
          <div className="section-index">01 <span>ABOUT THE INDEX</span></div>
          <div className="intro-copy">
            <h2>一座為學生整理的<br /><span>數學思考圖書館。</span></h2>
            <p>公式不是結論的終點，而是思考過程的索引。我們把國中到高中常用的公式，依照學習脈絡重新整理；每張公式卡都留下「為什麼」，讓你在考前快速回顧，也能在卡住時找到下一步。</p>
          </div>
          <div className="intro-aside">
            <div className="aside-icon"><Compass size={21} /></div>
            <span>先選一個分類</span>
            <strong>按自己的節奏<br />建立公式地圖。</strong>
            <a href="#categories">前往分類 <ChevronRight size={15} /></a>
          </div>
        </div>
      </section>

      <section className="featured-section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow eyebrow-dark"><span className="eyebrow-dot" /> 建議先讀</div>
              <h2>四個常用起點</h2>
            </div>
            <p>從最常遇到、最值得理解的公式開始，建立自己的第一張公式地圖。</p>
          </div>
          <div className="featured-grid">
            {featured.map((formula, index) => formula && (
              <Link href={`/formula/${formula.slug}`} className={`featured-card featured-${index + 1}`} key={formula.slug}>
                <div className="featured-top"><span>0{index + 1}</span><ArrowUpRight size={17} /></div>
                <div className="featured-category">{formula.category} · {formula.level}</div>
                <h3>{formula.name}</h3>
                <div className="featured-formula">{formula.formula}</div>
                <p>{formula.summary}</p>
                <span className="read-link">查看推導 <ChevronRight size={15} /></span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="formula-library" id="formulas">
        <div className="container">
          <div className="library-header">
            <div>
              <div className="eyebrow"><span className="eyebrow-dot" /> 完整公式索引</div>
              <h2>所有公式，<em>條列清楚。</em></h2>
            </div>
            <div className="library-count"><span>{visibleFormulas.length.toString().padStart(2, "0")}</span> / {formulas.length} 筆結果</div>
          </div>
          <div className="library-toolbar">
            <label className="search-box">
              <Search size={18} />
              <span className="sr-only">搜尋公式</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋公式名稱、英文或關鍵字…" />
              <kbd>⌘ K</kbd>
            </label>
            <div className="toolbar-tip"><Grid2X2 size={15} /> 點選分類快速篩選</div>
          </div>
          <div className="category-strip" id="categories">
            {categories.map((category) => (
              <button
                key={category.value}
                type="button"
                className={`category-chip ${activeCategory === category.value ? "active" : ""}`}
                onClick={() => setActiveCategory(category.value)}
              >
                <span className={`chip-dot ${category.tone}`} />
                <span>{category.name}</span>
                <small>{category.value === "全部公式" ? formulas.length : formulas.filter((formula) => formula.category === category.value).length}</small>
              </button>
            ))}
          </div>
          {visibleFormulas.length > 0 ? (
            <div className="formula-list">
              {visibleFormulas.map((formula, index) => (
                <article className="formula-row" key={formula.slug}>
                  <div className="formula-number">{(index + 1).toString().padStart(2, "0")}</div>
                  <div className="formula-row-main">
                    <div className="formula-row-meta"><span className="level-pill">{formula.level}</span><span>{formula.category}</span></div>
                    <h3>{formula.name}</h3>
                    <p>{formula.summary}</p>
                  </div>
                  <div className="formula-row-equation">{formula.formula}</div>
                  <Link href={`/formula/${formula.slug}`} className="formula-row-link" aria-label={`查看${formula.name}的推導`}><ArrowUpRight size={19} /></Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state"><Search size={24} /><strong>找不到相符的公式</strong><span>試試看「三角」、「平方」或清除分類。</span><button type="button" onClick={() => { setQuery(""); setActiveCategory("全部公式"); }}>顯示全部</button></div>
          )}
        </div>
      </section>

      <section className="study-note-section">
        <div className="container study-note-grid">
          <div className="study-note-card">
            <div className="note-pin" />
            <div className="eyebrow"><span className="eyebrow-dot" /> STUDY NOTE / 001</div>
            <h2>背公式之前，<br /><em>先問它為什麼。</em></h2>
            <p>當你能從幾何圖形、數列規律或基本定義重新走一遍，公式就不再是考卷上的陌生符號，而是你可以隨時重建的工具。</p>
            <div className="note-signature">— 丁成老師的課堂提醒</div>
          </div>
          <div className="study-note-list">
            <div><span>01</span><div><strong>先讀定義</strong><p>知道每個符號代表什麼，才不會代錯位置。</p></div></div>
            <div><span>02</span><div><strong>再看推導</strong><p>理解式子怎麼來，遇到變形題也能靈活處理。</p></div></div>
            <div><span>03</span><div><strong>最後練習</strong><p>用一題簡單例題，把抽象公式放回具體情境。</p></div></div>
          </div>
        </div>
      </section>
    </>
  );
}
