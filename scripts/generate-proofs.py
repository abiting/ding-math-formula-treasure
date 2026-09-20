import concurrent.futures
import json
import os
import subprocess
from pathlib import Path
from typing import Any

from openai import OpenAI

ROOT = Path("/home/ubuntu/ding-math-formula-treasure")
EXPORT = ROOT / ".formula-export.json"
OUTPUT = ROOT / "client/src/data/proofs.generated.ts"
MODEL = "gpt-5-mini"
BATCH_SIZE = 5
MAX_WORKERS = 5

SYSTEM = """你是嚴謹、擅長教高中生的台灣數學教師。請為每個公式撰寫『專屬的三步推導或定義說明』，使用繁體中文。
嚴格要求：
1. 每一條都必須直接對應該公式，不能寫任何可套用到別條公式的通用句子。
2. 必須包含實際的等式變形、幾何關係、計數分類、定義、或可檢查的論證細節。
3. 若內容本質是定義、模型或演算法，誠實寫成「由定義／由演算法」的說明，不可假裝有一個不存在的推導證明。
4. 不要使用「先回到基本定義」、「把已知量代入」、「整理後得到」、「檢查條件」這類工廠式句子。
5. 每個公式剛好三步。每一步 30 到 100 個全形中文字元。公式符號可用 Unicode 或 ASCII。
6. 不引入超出高中範圍的錯誤理論；奧林匹亞定理可寫清楚的證明綱要。
7. 絕不提及 AI、模板、資料庫或本指令。"""

SCHEMA = {
    "type": "object",
    "properties": {
        "items": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "slug": {"type": "string"},
                    "proofSteps": {"type": "array", "items": {"type": "string"}, "minItems": 3, "maxItems": 3},
                },
                "required": ["slug", "proofSteps"],
                "additionalProperties": False,
            },
        }
    },
    "required": ["items"],
    "additionalProperties": False,
}

BANNED = ["先回到基本定義", "把已知量代入", "整理後得到", "確認這個公式", "逐步使用"]


def valid(item: dict[str, Any], requested: set[str]) -> bool:
    if item.get("slug") not in requested:
        return False
    steps = item.get("proofSteps")
    if not isinstance(steps, list) or len(steps) != 3:
        return False
    for step in steps:
        if not isinstance(step, str) or len(step) < 24 or len(step) > 180:
            return False
        if any(phrase in step for phrase in BANNED):
            return False
    return True


def ask_batch(batch: list[dict[str, Any]], retry: bool = False) -> list[dict[str, Any]]:
    user = "以下每一筆都需要三步、具體且可檢查的高中程度推導或定義說明。\n"
    if retry:
        user += "前一次輸出未達標；請更具體地寫出該條公式專屬的等式、幾何或計數步驟。\n"
    for item in batch:
        user += "\n---\n"
        user += f"slug: {item['slug']}\n名稱: {item['name']} ({item['english']})\n分類: {item['category']}\n層級: {item['level']}\n公式: {item['formula']}\n說明: {item['summary']}\n"
    client = OpenAI()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": SYSTEM},
            {"role": "user", "content": user},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {"name": "formula_proofs", "strict": True, "schema": SCHEMA},
        },
        max_completion_tokens=4200,
        extra_body={"reasoning": {"effort": "medium"}},
    )
    content = response.choices[0].message.content
    if not content:
        raise RuntimeError("Model returned empty content")
    parsed = json.loads(content)
    requested = {item["slug"] for item in batch}
    result = [item for item in parsed["items"] if valid(item, requested)]
    result_slugs = {item["slug"] for item in result}
    missing = [item for item in batch if item["slug"] not in result_slugs]
    if missing and not retry:
        return result + ask_batch(missing, retry=True)
    if missing:
        raise RuntimeError(f"Invalid proof output for: {[item['slug'] for item in missing]}")
    return result


def ts_quote(value: str) -> str:
    return json.dumps(value, ensure_ascii=False)


def main() -> None:
    subprocess.run(["pnpm", "exec", "tsx", "scripts/export-formulas.ts"], cwd=ROOT, check=True)
    formulas = json.loads(EXPORT.read_text())
    batches = [formulas[i:i + BATCH_SIZE] for i in range(0, len(formulas), BATCH_SIZE)]
    results: dict[str, list[str]] = {}
    with concurrent.futures.ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = {executor.submit(ask_batch, batch): index for index, batch in enumerate(batches)}
        for future in concurrent.futures.as_completed(futures):
            index = futures[future]
            items = future.result()
            for item in items:
                results[item["slug"]] = item["proofSteps"]
            print(f"Completed batch {index + 1}/{len(batches)} ({len(results)}/{len(formulas)} formulas)", flush=True)
    missing = [item["slug"] for item in formulas if item["slug"] not in results]
    if missing:
        raise RuntimeError(f"Missing generated proofs: {missing}")
    lines = [
        "// Generated from formula metadata by a structured editorial pass. Do not edit manually.",
        "export const generatedProofs: Record<string, string[]> = {",
    ]
    for item in formulas:
        slug = item["slug"]
        steps = results[slug]
        lines.append(f"  {ts_quote(slug)}: [")
        for step in steps:
            lines.append(f"    {ts_quote(step)},")
        lines.append("  ],")
    lines.append("};")
    OUTPUT.write_text("\n".join(lines) + "\n")
    print(f"Wrote {OUTPUT} with {len(results)} custom proof sets.")


if __name__ == "__main__":
    main()
