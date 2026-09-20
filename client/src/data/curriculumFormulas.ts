import type { Formula } from "./formulas";
import { getGeneratedProof } from "./proofs";

type RawFormula = [string, string, string, string, string, string, string];

const raw: RawFormula[] = [
  // 統計與資料分析
  ["arithmetic-mean-statistics", "算術平均數", "Arithmetic Mean", "統計與資料分析", "高中共同基礎", "x̄=(x₁+x₂+…+xₙ)/n", "把所有資料加總後除以資料筆數，描述資料的集中位置。"],
  ["weighted-mean", "加權平均數", "Weighted Mean", "統計與資料分析", "高中共同基礎", "x̄w=Σwᵢxᵢ/Σwᵢ", "不同資料的重要程度不同時，用權重反映其貢獻。"],
  ["median-position", "中位數位置", "Median", "統計與資料分析", "高中共同基礎", "n為奇數：x₍ₙ₊₁₎⁄₂；n為偶數：(xₙ⁄₂+xₙ⁄₂₊₁)/2", "先排序資料，再找出正中央的位置。"],
  ["quartile-position", "四分位數位置", "Quartiles", "統計與資料分析", "高中共同基礎", "Q₁位於25%，Q₂位於50%，Q₃位於75%", "把排序後的資料分成四段，觀察分布位置與離散程度。"],
  ["variance-population", "母體變異數", "Population Variance", "統計與資料分析", "高中共同基礎", "σ²=Σ(xᵢ−μ)²/n", "每筆資料與平均數差距的平方平均。"],
  ["sample-variance", "樣本變異數", "Sample Variance", "統計與資料分析", "高中共同基礎", "s²=Σ(xᵢ−x̄)²/(n−1)", "用樣本估計母體時，分母使用 n−1 以修正偏差。"],
  ["standard-deviation-data", "資料標準差", "Standard Deviation of Data", "統計與資料分析", "高中共同基礎", "σ=√[Σ(xᵢ−μ)²/n]", "變異數開根號，回到與原資料相同的單位。"],
  ["z-score", "標準化分數", "Z-Score", "統計與資料分析", "高中共同基礎", "z=(x−μ)/σ", "把不同平均數與標準差的資料轉成可比較的尺度。"],
  ["covariance", "共變異數", "Covariance", "統計與資料分析", "高中共同基礎", "Cov(X,Y)=Σ(xᵢ−x̄)(yᵢ−ȳ)/n", "觀察兩個變數是否同向或反向變動。"],
  ["correlation-coefficient", "相關係數", "Correlation Coefficient", "統計與資料分析", "高中共同基礎", "r=Cov(X,Y)/(σₓσᵧ)", "把共變異數標準化，r 介於 −1 與 1 之間。"],
  ["least-squares-slope", "最小平方法斜率", "Least-Squares Slope", "統計與資料分析", "高中共同基礎", "b=Σ(xᵢ−x̄)(yᵢ−ȳ)/Σ(xᵢ−x̄)²", "找出使殘差平方和最小的直線斜率。"],
  ["least-squares-intercept", "最適直線截距", "Least-Squares Intercept", "統計與資料分析", "高中共同基礎", "a=ȳ−bx̄", "最適直線 y=a+bx 一定通過資料的平均點 (x̄,ȳ)。"],
  ["expected-value-table", "離散資料期望值", "Expected Value from a Table", "統計與資料分析", "高中甲乙", "E(X)=Σxᵢpᵢ", "每個可能值乘上它的機率，再把所有結果加總。"],

  // 矩陣與線性代數
  ["matrix-addition", "矩陣加法", "Matrix Addition", "矩陣與線性代數", "高中數學A／B", "(A+B)ᵢⱼ=aᵢⱼ+bᵢⱼ", "只有相同大小的矩陣能逐項相加。"],
  ["matrix-product", "矩陣乘法", "Matrix Multiplication", "矩陣與線性代數", "高中數學A／B", "(AB)ᵢⱼ=Σₖaᵢₖbₖⱼ", "第 i 列與第 j 欄做內積，得到乘積矩陣的一個元素。"],
  ["determinant-two", "二階行列式", "2×2 Determinant", "矩陣與線性代數", "高中數學A", "|a b; c d|=ad−bc", "主對角線乘積減去副對角線乘積。"],
  ["determinant-three", "三階行列式", "3×3 Determinant", "矩陣與線性代數", "高中數學A", "det(A)=Σsgn(π)a₁π(1)a₂π(2)a₃π(3)", "依排列的正負號展開，或用餘子式逐層降階。"],
  ["matrix-inverse-two", "二階矩陣反方陣", "2×2 Matrix Inverse", "矩陣與線性代數", "高中數學A／B", "A⁻¹=1/(ad−bc)[d −b; −c a]", "交換主對角線、改變副對角線符號，再除以行列式。"],
  ["cramer-two", "克拉瑪公式二元版", "Cramer's Rule for Two Variables", "矩陣與線性代數", "高中數學A", "x=Dₓ/D, y=Dᵧ/D", "用係數行列式與替換後行列式的比例解聯立方程組。"],
  ["matrix-linear-transform", "矩陣線性變換", "Matrix Linear Transformation", "矩陣與線性代數", "高中數學A", "T(v)=Av", "矩陣把向量的座標線性地映射到另一個位置。"],
  ["transition-matrix", "轉移矩陣模型", "Transition Matrix", "矩陣與線性代數", "高中數學B", "vₙ₊₁=Avₙ", "每一步的狀態由矩陣乘上前一步狀態得到。"],

  // 向量與空間
  ["vector-component", "向量分量表示", "Vector Components", "向量與空間", "高中數學A／B", "v=⟨v₁,v₂,v₃⟩", "用各座標方向的分量描述平面或空間中的向量。"],
  ["vector-dot-space", "空間向量內積", "Dot Product in Space", "向量與空間", "高中數學A", "u·v=u₁v₁+u₂v₂+u₃v₃=|u||v|cosθ", "座標乘積和與長度夾角兩種表示相等。"],
  ["vector-cross-product", "向量外積", "Cross Product", "向量與空間", "高中數學A", "u×v=⟨u₂v₃−u₃v₂,u₃v₁−u₁v₃,u₁v₂−u₂v₁⟩", "外積垂直於兩向量，長度等於它們張成的平行四邊形面積。"],
  ["cross-product-area", "外積求面積", "Area from Cross Product", "向量與空間", "高中數學A", "A△ABC=1/2|AB×AC|", "兩邊向量的外積長度是平行四邊形面積，再除以二。"],
  ["scalar-triple-product", "純量三重積", "Scalar Triple Product", "向量與空間", "高中數學A", "u·(v×w)=det[u v w]", "純量三重積的絕對值等於三個向量張成的平行六面體體積。"],
  ["line-parametric-space", "空間直線參數式", "Parametric Line in Space", "向量與空間", "高中數學A", "(x,y,z)=P+t(a,b,c)", "由一個通過點與方向向量描述空間直線。"],
  ["plane-normal-equation", "平面方程式", "Plane Equation", "向量與空間", "高中數學A", "a(x−x₀)+b(y−y₀)+c(z−z₀)=0", "平面上的位移向量與法向量內積為零。"],
  ["point-plane-distance", "點到平面距離", "Point-to-Plane Distance", "向量與空間", "高中數學A", "d=|ax₀+by₀+cz₀−d|/√(a²+b²+c²)", "用點代入平面式的代數值，除以法向量長度。"],
  ["line-plane-angle", "直線與平面夾角", "Angle Between Line and Plane", "向量與空間", "高中數學A", "sinθ=|n·v|/(|n||v|)", "直線與平面的角度等於方向向量與法向量夾角的餘角。"],

  // 集合與邏輯
  ["set-union-cardinality", "集合聯集個數", "Cardinality of a Union", "集合與邏輯", "高中共同基礎", "|A∪B|=|A|+|B|−|A∩B|", "把兩集合相加時，交集被重複計算一次，需扣回。"],
  ["de-morgan-set", "集合的德摩根律", "De Morgan's Laws for Sets", "集合與邏輯", "高中共同基礎", "(A∪B)ᶜ=Aᶜ∩Bᶜ；(A∩B)ᶜ=Aᶜ∪Bᶜ", "不屬於聯集等同於同時不屬於兩集合；不屬於交集等同於至少不屬於一個。"],
  ["set-difference", "集合差集公式", "Set Difference", "集合與邏輯", "高中共同基礎", "A−B=A∩Bᶜ", "在 A 中排除 B，就是留在 A 且不在 B 的元素。"],
  ["logical-implication", "命題蘊涵", "Logical Implication", "集合與邏輯", "高中共同基礎", "p⇒q 等價於 ¬p∨q", "只有 p 真而 q 假時，蘊涵命題才是假。"],
  ["contrapositive", "逆否命題", "Contrapositive", "集合與邏輯", "高中共同基礎", "p⇒q ⇔ ¬q⇒¬p", "命題與逆否命題的真值完全相同。"],
  ["necessary-sufficient", "充分必要條件", "Necessary and Sufficient Conditions", "集合與邏輯", "高中共同基礎", "p⇔q ⇔ (p⇒q)∧(q⇒p)", "要成為充要條件，正向與反向都必須成立。"],
  ["quantifier-negation", "量詞否定", "Negation of Quantifiers", "集合與邏輯", "高中共同基礎", "¬(∀x P)=∃x¬P；¬(∃x P)=∀x¬P", "全稱與存在互換，並把敘述否定。"],

  // 函數與模型
  ["function-composition", "函數合成", "Composition of Functions", "函數與模型", "高中數學A／B", "(f∘g)(x)=f(g(x))", "先作用 g，再把 g(x) 的結果代入 f。"],
  ["function-inverse", "反函數關係", "Inverse Function", "函數與模型", "高中數學A／B", "f⁻¹(f(x))=x", "反函數把輸出送回原本的輸入，需注意一對一條件。"],
  ["even-function", "偶函數對稱", "Even Function", "函數與模型", "高中共同基礎", "f(−x)=f(x)", "圖形關於 y 軸對稱。"],
  ["odd-function", "奇函數對稱", "Odd Function", "函數與模型", "高中共同基礎", "f(−x)=−f(x)", "圖形關於原點對稱。"],
  ["function-translation", "函數平移", "Function Translation", "函數與模型", "高中共同基礎", "y=f(x−h)+k", "圖形向右 h、向上 k 平移，頂點或特徵點同步移動。"],
  ["average-growth-rate", "平均成長率", "Average Growth Rate", "函數與模型", "高中數學B", "(f(b)−f(a))/(b−a)", "用輸出變化量除以輸入變化量，描述一段區間的平均變化。"],
  ["continuous-compound", "連續複利模型", "Continuous Compounding", "函數與模型", "高中數學B", "A=Peʳᵗ", "複利次數趨近無限時，有限期數模型趨近 e 的指數模型。"],
  ["periodic-model", "週期模型", "Periodic Model", "函數與模型", "高中數學B", "y=A sin(Bx+C)+D", "A 控制振幅，2π/|B| 控制週期，C 控制水平位移，D 控制中線。"],
  ["linear-approximation", "線性近似", "Linear Approximation", "函數與模型", "高中數學甲", "f(x)≈f(a)+f′(a)(x−a)", "在 a 附近用切線取代曲線，快速估計函數值。"],

  // 線性規劃
  ["linear-program-feasible", "線性規劃可行域", "Feasible Region", "線性規劃", "高中數學乙", "R={(x,y): all linear constraints}", "所有同時滿足線性限制式的點形成可行域。"],
  ["linear-program-objective", "線性規劃目標函數", "Objective Function", "線性規劃", "高中數學乙", "z=ax+by", "用一次式表示要最大化或最小化的量。"],
  ["linear-program-vertex", "線性規劃頂點原理", "Vertex Principle of Linear Programming", "線性規劃", "高中數學乙", "線性目標函數的極值出現在可行域頂點", "平行移動目標函數直線，最後接觸可行域的頂點就是候選最值。"],
  ["linear-program-boundary", "線性規劃邊界交點", "Boundary Intersections", "線性規劃", "高中數學乙", "兩條邊界聯立求交點", "可行域頂點來自限制式邊界的交會，需再檢查是否符合所有限制。"],

  // 數值與誤差
  ["absolute-error", "絕對誤差", "Absolute Error", "數值與誤差", "高中共同基礎", "絕對誤差=|近似值−真值|", "描述近似值離真值的實際距離。"],
  ["relative-error", "相對誤差", "Relative Error", "數值與誤差", "高中共同基礎", "相對誤差=|近似值−真值|/|真值|", "把誤差除以真值，適合比較不同尺度的誤差。"],
  ["percentage-error", "百分比誤差", "Percentage Error", "數值與誤差", "高中共同基礎", "百分比誤差=相對誤差×100%", "把相對誤差改用百分比表達。"],
  ["error-propagation-sum", "和的誤差上界", "Error Bound for a Sum", "數值與誤差", "高中共同基礎", "|Δ(x±y)|≤|Δx|+|Δy|", "最保守估計時，總誤差不超過各項誤差絕對值的和。"],
  ["significant-figures", "有效位數", "Significant Figures", "數值與誤差", "高中共同基礎", "有效位數保留非零數字與必要的零", "有效位數反映測量或計算結果的精確程度。"],
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
    variables: `先確認符號、定義域與題目條件；統計題還要先判斷是母體還是樣本。`,
    proofSteps: getGeneratedProof({ slug, name, category, formula, summary }),
    example: `${summary} 解題時先辨識題目所屬的正式課綱單元，再選擇對應工具。`,
    memory: `課綱提示：${formula}`,
    tags: [category, "108課綱", "高中公式"],
  };
}

export const curriculumFormulas: Formula[] = raw.map(makeFormula);
