import type { Formula } from "./formulas";
import { getGeneratedProof } from "./proofs";

type RawFormula = [string, string, string, string, string, string, string];

const raw: RawFormula[] = [
  ["limit-definition", "函數極限定義", "Definition of a Limit", "微積分", "高中・微積分", "limₓ→a f(x)=L", "當 x 越靠近 a，f(x) 越靠近 L；極限描述的是靠近的趨勢。"],
  ["limit-laws", "極限運算法則", "Limit Laws", "微積分", "高中・微積分", "lim(f±g)=lim f±lim g; lim(fg)=lim f·lim g", "若各極限存在，和、差、積、商可以分別運算。"],
  ["squeeze-theorem", "夾擠定理", "Squeeze Theorem", "微積分", "高中・微積分", "g(x)≤f(x)≤h(x), lim g=lim h=L ⇒ lim f=L", "若函數被兩個極限相同的函數夾住，也必須趨近同一個值。"],
  ["standard-trig-limits", "基本三角極限", "Standard Trigonometric Limits", "微積分", "高中・微積分", "limₓ→0 sinx/x=1; limₓ→0(1−cosx)/x²=1/2", "這兩個極限是推導三角函數導數的核心入口。"],
  ["continuity-definition", "連續函數定義", "Continuity", "微積分", "高中・微積分", "f continuous at a ⇔ limₓ→a f(x)=f(a)", "函數值、左極限與右極限在該點接得起來，就是連續。"],
  ["derivative-definition", "導數定義", "Definition of the Derivative", "微積分", "高中・微積分", "f′(a)=limₕ→0[f(a+h)−f(a)]/h", "割線斜率在兩點無限靠近時的極限，就是切線斜率。"],
  ["derivative-power", "冪次微分法則", "Power Rule", "微積分", "高中・微積分", "d/dx(xⁿ)=nxⁿ⁻¹", "由二項式定理展開差商，除去不含 h 的項後取極限。"],
  ["derivative-constant", "常數微分法則", "Derivative of a Constant", "微積分", "高中・微積分", "d/dx(c)=0", "常數函數圖形是水平線，瞬時變化率為零。"],
  ["derivative-sum", "和差微分法則", "Sum and Difference Rule", "微積分", "高中・微積分", "(f±g)′=f′±g′", "差商可拆成兩個差商，極限也可分開。"],
  ["derivative-product", "乘積微分法則", "Product Rule", "微積分", "高中・微積分", "(fg)′=f′g+fg′", "在 f(x+h)g(x+h) 中加減 f(x)g(x+h)，再取極限。"],
  ["derivative-quotient", "商的微分法則", "Quotient Rule", "微積分", "高中・微積分", "(f/g)′=(f′g−fg′)/g²", "將商寫成乘積 f·g⁻¹，再用乘積與冪次法則。"],
  ["chain-rule", "鏈鎖律", "Chain Rule", "微積分", "高中・微積分", "d/dx f(g(x))=f′(g(x))g′(x)", "外層變化率乘上內層變化率，反映複合函數的連鎖變化。"],
  ["derivative-exponential", "指數函數微分", "Derivative of Exponential Function", "微積分", "高中・微積分", "d/dx(eˣ)=eˣ; d/dx(aˣ)=aˣlna", "eˣ 的瞬時變化率正好等於函數本身，再用換底處理 aˣ。"],
  ["derivative-logarithm", "對數函數微分", "Derivative of Logarithm", "微積分", "高中・微積分", "d/dx(lnx)=1/x; d/dx(logₐx)=1/(x ln a)", "令 y=ln x，利用 eʸ=x 做隱函數微分。"],
  ["derivative-sine", "正弦函數微分", "Derivative of Sine", "微積分", "高中・微積分", "d/dx(sinx)=cosx", "用正弦加角公式拆開差商，再套基本三角極限。"],
  ["derivative-cosine", "餘弦函數微分", "Derivative of Cosine", "微積分", "高中・微積分", "d/dx(cosx)=−sinx", "用餘弦減角公式與基本三角極限，負號來自方向變化。"],
  ["derivative-tangent", "正切函數微分", "Derivative of Tangent", "微積分", "高中・微積分", "d/dx(tanx)=sec²x", "tanx=sinx/cosx，套商法則並用 sin²+cos²=1。"],
  ["inverse-function-derivative", "反函數微分法則", "Derivative of an Inverse Function", "微積分", "高中・微積分", "(f⁻¹)′(x)=1/f′(f⁻¹(x))", "由 f(f⁻¹(x))=x 兩邊微分，再用鏈鎖律。"],
  ["implicit-differentiation", "隱函數微分", "Implicit Differentiation", "微積分", "高中・微積分", "若 F(x,y)=0，對 x 兩邊微分並解 y′", "把 y 視為 x 的函數，含 y 的項都需使用鏈鎖律。"],
  ["tangent-line", "切線方程式", "Tangent Line Equation", "微積分", "高中・微積分", "y−f(a)=f′(a)(x−a)", "切線通過 (a,f(a))，斜率就是 f′(a)。"],
  ["normal-line", "法線方程式", "Normal Line Equation", "微積分", "高中・微積分", "y−f(a)=−[1/f′(a)](x−a)", "法線與切線垂直，兩斜率乘積為 −1。"],
  ["critical-number", "臨界數", "Critical Number", "微積分", "高中・微積分", "f′(c)=0 或 f′(c) 不存在", "局部極值只能出現在導數為零或導數不存在的位置。"],
  ["first-derivative-test", "一階導數判別法", "First Derivative Test", "微積分", "高中・微積分", "f′: +→− 為極大；−→+ 為極小", "導數符號代表函數升降，符號改變即可判斷局部極值。"],
  ["second-derivative-test", "二階導數判別法", "Second Derivative Test", "微積分", "高中・微積分", "f′(c)=0, f″(c)>0 為極小；f″(c)<0 為極大", "二階導數描述斜率的變化方向，也就是圖形凹凸。"],
  ["mean-value-theorem", "拉格朗日中值定理", "Mean Value Theorem", "微積分", "高中・微積分", "f′(c)=[f(b)−f(a)]/(b−a)", "連續且可微時，某一點的瞬時斜率會等於整段平均斜率。"],
  ["integral-power", "冪次積分法則", "Power Rule for Integration", "微積分", "高中・微積分", "∫xⁿdx=xⁿ⁺¹/(n+1)+C, n≠−1", "反過來想：找一個微分後會得到 xⁿ 的函數。"],
  ["integral-log", "倒數積分法則", "Integral of 1/x", "微積分", "高中・微積分", "∫1/x dx=ln|x|+C", "ln|x| 微分後是 1/x，絕對值涵蓋 x<0 的情況。"],
  ["fundamental-theorem-calculus", "微積分基本定理", "Fundamental Theorem of Calculus", "微積分", "高中・微積分", "d/dx∫ₐˣf(t)dt=f(x)", "積分累積量的瞬時變化率，就是當下的函數值。"],
  ["definite-integral-antiderivative", "定積分與原函數", "Evaluation of a Definite Integral", "微積分", "高中・微積分", "∫ₐᵇf(x)dx=F(b)−F(a), F′=f", "把面積累積問題轉成找原函數，再代上下限相減。"],
  ["u-substitution", "換元積分法", "u-Substitution", "微積分", "高中・微積分", "∫f(g(x))g′(x)dx=∫f(u)du", "把複合函數的內層設成 u，將鏈鎖律反向使用。"],
  ["integration-by-parts", "分部積分法", "Integration by Parts", "微積分", "高中・微積分", "∫u dv=uv−∫v du", "由乘積微分法則積分而來，適合處理兩個函數相乘。"],
  ["area-under-curve", "曲線下方面積", "Area Under a Curve", "微積分", "高中・微積分", "A=∫ₐᵇf(x)dx (f≥0)", "把區間切成很多窄長方形，寬度趨近零後取總和極限。"],
  ["area-between-curves", "兩曲線間面積", "Area Between Curves", "微積分", "高中・微積分", "A=∫ₐᵇ[上方函數−下方函數]dx", "每個垂直小片的高度是上下函數差，再沿 x 累加。"],
  ["average-value-function", "函數平均值", "Average Value of a Function", "微積分", "高中・微積分", "f_avg=1/(b−a)∫ₐᵇf(x)dx", "總累積量除以區間長度，就是連續資料的平均。"],
  ["disk-method", "圓盤法體積", "Disk Method", "微積分", "高中・微積分", "V=π∫ₐᵇ[R(x)]²dx", "把立體切成薄圓盤，半徑平方乘 π 後累積。"],
  ["washer-method", "墊圈法體積", "Washer Method", "微積分", "高中・微積分", "V=π∫ₐᵇ[R(x)²−r(x)²]dx", "每片是外圓盤扣掉內圓盤的面積。"],
  ["shell-method", "圓柱殼法體積", "Cylindrical Shell Method", "微積分", "高中・微積分", "V=2π∫ₐᵇ(radius)(height)dx", "薄長方形繞軸旋轉形成圓柱殼，再累積所有殼。"],
  ["separable-differential-equation", "可分離變數微分方程", "Separable Differential Equation", "微積分", "高中・微積分", "dy/dx=g(x)h(y) ⇒ ∫dy/h(y)=∫g(x)dx", "把含 y 的項移到 dy 側、含 x 的項移到 dx 側再積分。"],
  ["exponential-differential-equation", "指數成長微分方程", "Exponential Differential Equation", "微積分", "高中・微積分", "dy/dt=ky ⇒ y=Ceᵏᵗ", "函數與自身成正比的變化率，解就是指數函數。"],
];

function makeFormula(item: RawFormula): Formula {
  const [slug, name, english, category, level, formula, summary] = item;
  return {
    slug,
    name,
    english,
    category,
    level,
    summary,
    formula,
    variables: `先確認定義域、可微條件與積分常數 C；遇到題目要留意端點與不可微點。`,
    proofSteps: getGeneratedProof({ slug, name, category, formula, summary }),
    example: `${summary} 解題時先寫出已知函數與區間，再決定要使用導數、定積分或換元。`,
    memory: `學習提示：微分問「變化多快」，積分問「累積多少」；${formula}`,
    tags: [category, "高中微積分", "推導"],
  };
}

export const calculusFormulas: Formula[] = raw.map(makeFormula);
