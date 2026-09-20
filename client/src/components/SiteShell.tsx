import { Link } from "wouter";
import { ArrowUpRight, BookOpen, Menu, Sigma } from "lucide-react";
import type { ReactNode } from "react";

const footerImage = "https://abiting.cc/wp-content/uploads/2024/05/cropped-IMG_8491.png";

export default function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f4ee] text-[#17213a]">
      <div className="site-noise" aria-hidden="true" />
      <header className="site-header">
        <div className="container flex items-center justify-between py-4">
          <Link href="/" className="brand-mark" aria-label="回到丁氏數學公式寶典首頁">
            <span className="brand-symbol"><Sigma size={21} strokeWidth={2.5} /></span>
            <span>
              <span className="brand-name">丁氏數學公式寶典</span>
              <span className="brand-kicker">DING MATH / FORMULA INDEX</span>
            </span>
          </Link>
          <nav className="main-nav" aria-label="主要導覽">
            <a href="/#formulas">公式索引</a>
            <a href="/#categories">分類瀏覽</a>
            <a href="/#about">關於寶典</a>
            <Link href="/formula/quadratic-formula" className="nav-cta">
              開始學習 <ArrowUpRight size={15} />
            </Link>
          </nav>
          <button className="mobile-menu" type="button" aria-label="開啟導覽選單" onClick={() => document.querySelector(".main-nav")?.classList.toggle("is-open")}>
            <Menu size={22} />
          </button>
        </div>
      </header>

      <main>{children}</main>

      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-intro">
            <div className="footer-logo"><span className="brand-symbol small"><Sigma size={17} /></span><span>丁氏數學公式寶典</span></div>
            <p>把公式讀懂，把推導留下。<br />陪你準備每一次小考、段考與大考。</p>
          </div>
          <div className="footer-links">
            <span className="footer-label">快速入口</span>
            <a href="/#formulas"><BookOpen size={15} /> 公式索引</a>
            <a href="/#categories"><BookOpen size={15} /> 六大分類</a>
          </div>
          <div className="footer-credit">
            <span className="footer-label">製作與監製</span>
            <a href="https://abiting.cc" target="_blank" rel="noreferrer" className="developer-credit">
              <img src={footerImage} alt="阿比丁網站開發維護識別圖" />
              <span>網站由阿比丁開發與維護<br />並由補教名師丁成監製 <ArrowUpRight size={13} /></span>
            </a>
          </div>
        </div>
        <div className="container copyright">Copyright © 2026 丁氏數學公式寶典</div>
      </footer>
    </div>
  );
}
