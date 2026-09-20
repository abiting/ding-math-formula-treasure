import { allFormulas } from "../client/src/data/formulas";
import { writeFileSync } from "node:fs";

const rows = allFormulas.map(({ slug, name, english, category, level, formula, summary }) => ({
  slug,
  name,
  english,
  category,
  level,
  formula,
  summary,
}));

writeFileSync("/home/ubuntu/ding-math-formula-treasure/.formula-export.json", JSON.stringify(rows, null, 2));
console.log(`Exported ${rows.length} formulas.`);
