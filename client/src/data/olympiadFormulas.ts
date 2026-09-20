import type { Formula } from "./formulas";
import { getGeneratedProof } from "./proofs";

type RawFormula = [string, string, string, string, string, string, string];

const raw: RawFormula[] = [
  // 數論
  ["euclidean-algorithm", "輾轉相除法", "Euclidean Algorithm", "數論", "高中資優・奧林匹亞", "gcd(a,b)=gcd(b, a mod b)", "用餘數逐步縮小問題，最後一個非零餘數就是最大公因數。"],
  ["bezout-identity", "裴蜀定理", "Bézout's Identity", "數論", "高中資優・奧林匹亞", "gcd(a,b)=ax+by", "兩數的最大公因數一定可以寫成它們的整數線性組合。"],
  ["gcd-lcm", "最大公因數與最小公倍數關係", "GCD–LCM Identity", "數論", "國中・資優", "gcd(a,b)·lcm(a,b)=|ab|", "把兩數的質因數次方取最小與最大，乘積會還原原來兩數。"],
  ["linear-congruence", "一次同餘方程式", "Linear Congruence", "數論", "高中資優・奧林匹亞", "ax≡b (mod m) 可解 ⇔ gcd(a,m)|b", "係數 a 在模 m 下能產生的剩餘類，必須包含 b。"],
  ["modular-inverse", "模反元素", "Modular Inverse", "數論", "高中資優・奧林匹亞", "aa⁻¹≡1 (mod m) ⇔ gcd(a,m)=1", "只有 a 與模數互質時，乘法才可在同餘系統中逆運算。"],
  ["fermat-little-theorem", "費馬小定理", "Fermat's Little Theorem", "數論", "高中資優・奧林匹亞", "aᵖ⁻¹≡1 (mod p), p∤a", "把 1 到 p−1 各乘 a 後取模，得到同一組非零剩餘。"],
  ["euler-theorem-number", "歐拉定理（數論）", "Euler's Theorem", "數論", "高中資優・奧林匹亞", "aᵠ⁽ⁿ⁾≡1 (mod n), gcd(a,n)=1", "費馬小定理推廣到任意模數，週期由歐拉函數決定。"],
  ["chinese-remainder", "中國剩餘定理", "Chinese Remainder Theorem", "數論", "高中資優・奧林匹亞", "x≡aᵢ (mod mᵢ) ⇒ 唯一 mod ∏mᵢ（mᵢ 兩兩互質）", "彼此互質的模數條件可以拼成一個更大的唯一剩餘類。"],
  ["euler-phi-number", "歐拉函數公式", "Euler's Totient Function", "數論", "高中資優・奧林匹亞", "φ(n)=n∏(1−1/p), p|n", "從 n 個正整數中扣除含各質因數的倍數，再用容斥整理。"],
  ["divisor-count", "正因數個數公式", "Number of Divisors", "數論", "高中資優・奧林匹亞", "n=∏pᵢᵉⁱ ⇒ τ(n)=∏(eᵢ+1)", "每個質因數的次方可從 0 選到 eᵢ，選法相乘。"],
  ["divisor-sum", "正因數和公式", "Sum of Divisors", "數論", "高中資優・奧林匹亞", "σ(n)=∏(pᵉ⁺¹−1)/(p−1)", "將每個質因數的 0 到 e 次方先形成等比和，再相乘。"],
  ["wilson-theorem", "威爾遜定理", "Wilson's Theorem", "數論", "高中資優・奧林匹亞", "(p−1)!≡−1 (mod p) ⇔ p 為質數", "模 p 下每個非零元素與其反元素配對，只留下 1 與 −1。"],
  ["legendre-formula", "勒讓德公式", "Legendre's Formula", "數論", "高中資優・奧林匹亞", "vₚ(n!)=⌊n/p⌋+⌊n/p²⌋+…", "數 n! 中有多少個 p 因子，分別數 p、p²、p³ 的倍數。"],
  ["primitive-pythagorean-triple", "原始勾股數參數式", "Primitive Pythagorean Triples", "數論", "高中資優・奧林匹亞", "a=m²−n², b=2mn, c=m²+n²", "m>n、互質且一奇一偶時，產生所有原始整數直角三角形。"],

  // 不等式
  ["am-gm", "算術幾何平均不等式", "AM–GM Inequality", "不等式", "高中・資優", "(a₁+…+aₙ)/n≥(a₁…aₙ)¹⁄ⁿ", "正數的平均值不小於幾何平均，等號在所有數相等時成立。"],
  ["cauchy-schwarz", "柯西－施瓦茲不等式", "Cauchy–Schwarz Inequality", "不等式", "高中資優・奧林匹亞", "(Σaᵢ²)(Σbᵢ²)≥(Σaᵢbᵢ)²", "平方和永遠非負，展開 Σ(aᵢbⱼ−aⱼbᵢ)² 即可看見差距。"],
  ["cauchy-engel", "柯西施瓦茲的 Engel 形式", "Cauchy–Schwarz Engel Form", "不等式", "高中資優・奧林匹亞", "Σxᵢ²/aᵢ≥(Σxᵢ)²/Σaᵢ", "令 bᵢ=xᵢ/√aᵢ、cᵢ=√aᵢ 後直接套柯西不等式。"],
  ["rms-am", "平方平均與算術平均", "RMS–AM Inequality", "不等式", "高中・資優", "√[(a₁²+…+aₙ²)/n]≥(a₁+…+aₙ)/n", "由平方和不小於平均平方，或由柯西不等式直接得到。"],
  ["hm-gm", "調和平均與幾何平均", "HM–GM Inequality", "不等式", "高中資優", "n/(Σ1/aᵢ)≤(a₁…aₙ)¹⁄ⁿ", "對倒數套用 AM–GM，再取倒數並注意不等號方向。"],
  ["rearrangement-inequality", "重排不等式", "Rearrangement Inequality", "不等式", "高中資優・奧林匹亞", "Σaᵢbᵢ≥Σaᵢb_{π(i)}≥Σaᵢb_{n+1−i}", "同向排序的乘積和最大，反向排序的乘積和最小。"],
  ["chebyshev-sum-inequality", "切比雪夫總和不等式", "Chebyshev's Sum Inequality", "不等式", "高中資優・奧林匹亞", "(1/n)Σaᵢbᵢ≥[(Σaᵢ)/n][(Σbᵢ)/n]", "兩列同向排序時，配對乘積的平均不小於平均值乘積。"],
  ["jensen-inequality", "琴生不等式", "Jensen's Inequality", "不等式", "高中資優・奧林匹亞", "f(Σλᵢxᵢ)≤Σλᵢf(xᵢ), f convex", "凸函數的圖形位於弦線下方，權重平均後保持這個方向。"],
  ["bernoulli-inequality", "伯努利不等式", "Bernoulli's Inequality", "不等式", "高中資優", "(1+x)ʳ≥1+rx (r≥1,x≥−1)", "由二項式展開或數學歸納法，後續項在條件下非負。"],
  ["schur-inequality", "舒爾不等式", "Schur's Inequality", "不等式", "高中資優・奧林匹亞", "Σa(a−b)(a−c)≥0, a≥b≥c≥0", "排序後拆成非負的差與平方組合，常用於三變量不等式。"],
  ["triangle-inequality-advanced", "三角不等式", "Triangle Inequality", "不等式", "國中・資優", "|a+b|≤|a|+|b|", "兩段路徑不會比直接連線更短，等號表示同向。"],

  // 奧林匹亞幾何
  ["stewart-theorem", "史都華定理", "Stewart's Theorem", "奧林匹亞幾何", "高中資優・奧林匹亞", "b²m+c²n=a(d²+mn), m+n=a", "將兩側小三角形套用餘弦定理，再消去共享角度。"],
  ["apollonius-theorem", "阿波羅尼斯定理", "Apollonius's Theorem", "奧林匹亞幾何", "高中資優・奧林匹亞", "b²+c²=2(mₐ²+(a/2)²)", "中線把底邊分成兩半，對兩個小三角形使用畢氏型的距離展開。"],
  ["ceva-theorem", "塞瓦定理", "Ceva's Theorem", "奧林匹亞幾何", "高中資優・奧林匹亞", "(BD/DC)(CE/EA)(AF/FB)=1", "三條共點線分割出的三組三角形面積比相乘後約去。"],
  ["menelaus-theorem", "梅涅勞斯定理", "Menelaus's Theorem", "奧林匹亞幾何", "高中資優・奧林匹亞", "(BD/DC)(CE/EA)(AF/FB)=−1", "一條直線截三角形三邊，使用有向線段的面積比可得。"],
  ["ptolemy-theorem", "托勒密定理", "Ptolemy's Theorem", "奧林匹亞幾何", "高中資優・奧林匹亞", "AC·BD=AB·CD+BC·AD", "圓內接四邊形可用對角線交點與相似三角形證明。"],
  ["power-of-point", "點冪定理", "Power of a Point", "奧林匹亞幾何", "高中資優・奧林匹亞", "PA·PB=PC·PD", "同一點引兩條割線，利用相似三角形得到兩段乘積相等。"],
  ["tangent-secant-theorem", "切割線定理", "Tangent–Secant Theorem", "奧林匹亞幾何", "高中資優・奧林匹亞", "PT²=PA·PB", "切線與割線形成的兩三角形相似，切線段是兩段割線的幾何平均。"],
  ["brahmagupta-formula", "婆羅摩笈多公式", "Brahmagupta's Formula", "奧林匹亞幾何", "高中資優・奧林匹亞", "K=√[(s−a)(s−b)(s−c)(s−d)]", "圓內接四邊形可拆成兩三角形，再利用對角互補化簡。"],
  ["euler-oir", "歐拉三角形外心內心關係", "Euler's OI Formula", "奧林匹亞幾何", "高中資優・奧林匹亞", "OI²=R²−2Rr", "以外心、內心與邊長關係展開距離平方後整理得到。"],
  ["nine-point-circle-radius", "九點圓半徑", "Nine-Point Circle Radius", "奧林匹亞幾何", "高中資優・奧林匹亞", "R₉=R/2", "九點圓通過三邊中點、三個高足與頂點到垂心中點，半徑為外接圓半徑一半。"],
  ["euler-oh", "歐拉線外心垂心距離", "Euler's OH Formula", "奧林匹亞幾何", "高中資優・奧林匹亞", "OH²=9R²−(a²+b²+c²)", "把垂心表示成三個頂點向量的和，再用外心坐標展開。"],
  ["incenter-excenter", "內心與旁心距離公式", "Incenter–Excenter Relation", "奧林匹亞幾何", "高中資優・奧林匹亞", "AI²=4R²+4Rrₐ", "由內切圓、旁切圓半徑與外接圓半徑的關係推得。"],

  // 複數與多項式
  ["vieta-quadratic", "韋達定理（二次）", "Vieta's Formulas for Quadratics", "複數與多項式", "高中資優", "α+β=−b/a, αβ=c/a", "把 a(x−α)(x−β) 展開並對照係數。"],
  ["vieta-cubic", "韋達定理（三次）", "Vieta's Formulas for Cubics", "複數與多項式", "高中資優・奧林匹亞", "α+β+γ=−b/a, αβ+βγ+γα=c/a, αβγ=−d/a", "將三個一次因式相乘，再逐項對照係數。"],
  ["polynomial-remainder", "多項式餘式定理", "Remainder Theorem", "複數與多項式", "高中・資優", "P(x)=(x−a)Q(x)+P(a)", "代入 x=a 後，含 (x−a) 的部分歸零，餘式就是 P(a)。"],
  ["factor-theorem", "因式定理", "Factor Theorem", "複數與多項式", "高中・資優", "(x−a)|P(x) ⇔ P(a)=0", "餘式定理告訴我們餘式為零正好等同於可整除。"],
  ["roots-of-unity", "n 次單位根", "Roots of Unity", "複數與多項式", "高中資優・奧林匹亞", "zᵏ=e²πⁱᵏ⁄ⁿ, k=0,1,…,n−1", "在複平面上，n 個根均勻分布在單位圓上。"],
  ["de-moivre-theorem", "棣美弗定理", "De Moivre's Theorem", "複數與多項式", "高中資優", "(cosθ+i sinθ)ⁿ=cos(nθ)+i sin(nθ)", "用複數乘法的角度相加，對 n 做數學歸納即可。"],
  ["euler-complex-formula", "歐拉公式", "Euler's Formula", "複數與多項式", "高中資優", "eⁱθ=cosθ+i sinθ", "比較兩邊的冪級數展開，偶次項形成 cos，奇次項形成 i sin。"],

  // 進階組合
  ["catalan-number", "卡塔蘭數", "Catalan Numbers", "進階組合", "高中資優・奧林匹亞", "Cₙ=1/(n+1)·C(2n,n)", "計數括號配對、二元樹或不穿越路徑，從全部選法扣掉違規選法。"],
  ["derangement-number", "錯排數", "Derangement Number", "進階組合", "高中資優・奧林匹亞", "!n=n!Σₖ₌₀ⁿ(−1)ᵏ/k!", "用容斥原理排除至少一個物件留在原位的排列。"],
  ["burnside-lemma", "伯恩賽德引理", "Burnside's Lemma", "進階組合", "高中資優・奧林匹亞", "軌道數=(1/|G|)Σg∈G Fix(g)", "把每個對稱操作固定的配置數平均，即得到不同等價類數量。"],
  ["handshaking-lemma", "握手定理", "Handshaking Lemma", "進階組合", "高中資優・奧林匹亞", "Σdeg(v)=2|E|", "每條邊在兩端各貢獻一次度數。"],
  ["euler-planar-graph", "平面圖歐拉公式", "Euler's Formula for Planar Graphs", "進階組合", "高中資優・奧林匹亞", "V−E+F=2", "把平面圖逐步刪去邊或面，基本圖形都維持同一個不變量。"],
  ["cayley-tree", "凱萊公式", "Cayley's Formula", "進階組合", "高中資優・奧林匹亞", "標號樹數量=nⁿ⁻²", "用 Prüfer 編碼將每棵 n 點標號樹與長度 n−2 的序列一一對應。"],
  ["vandermermonde-identity", "范德蒙德恆等式", "Vandermonde's Identity", "進階組合", "高中資優・奧林匹亞", "ΣₖC(r,k)C(s,n−k)=C(r+s,n)", "從兩群人合計 r+s 人中選 n 人，按第一群選幾人分類。"],
  ["hockey-stick-identity", "曲棍球桿恆等式", "Hockey-Stick Identity", "進階組合", "高中資優", "Σₖ₌ᵣⁿC(k,r)=C(n+1,r+1)", "帕斯卡三角形斜線上的組合數相加，會合併成下一列的一項。"],
  ["alternating-binomial", "交錯二項式和", "Alternating Binomial Sum", "進階組合", "高中資優", "Σₖ₌₀ⁿ(−1)ᵏC(n,k)=0 (n≥1)", "由 (1−1)ⁿ 的二項式展開直接得到。"],
  ["fibonacci-binet", "斐波那契數列通項", "Binet's Formula", "進階組合", "高中資優", "Fₙ=(φⁿ−ψⁿ)/√5, φ=(1+√5)/2", "解遞迴式 Fₙ₊₂=Fₙ₊₁+Fₙ 的特徵方程得到。"],
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
    variables: `先確認題目中的條件與符號定義；競賽題常會把限制藏在敘述裡。`,
    proofSteps: getGeneratedProof({ slug, name, category, formula, summary }),
    example: `${summary} 遇到競賽題時，先判斷它是否能把複雜條件化成這個關係。`,
    memory: `競賽提示：不要只套公式，先確認 ${formula} 的使用條件。`,
    tags: [category, "資優數學", "奧林匹亞"],
  };
}

export const olympiadFormulas: Formula[] = raw.map(makeFormula);
