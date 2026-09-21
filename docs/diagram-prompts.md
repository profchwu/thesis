# 圖像生成 Prompt 紀錄

用途：論文完稿室的系統功能圖與分析流程圖，供 GitHub README 與教學使用。

生成方式：內建 image_gen 工具，搭配 imagegen 技能。使用者要求 image2；此工具未提供模型版本選擇或可核實版本資訊，因此不宣稱已驗證使用特定 image2 模型。未使用 CLI 或使用者 API Key。

## 系統功能圖

輸出：`images/system-features.png`。

```text
Use case: infographic-diagram.
Create ONE polished, publication-quality Traditional Chinese system feature infographic for the real website「論文完稿室」. Wide landscape 16:10, high resolution, crisp readable Traditional Chinese typography. White/ivory background, deep forest green header (#174d3b), pale mint panels, blue accents for deterministic functions, purple accents ONLY for optional AI, warm gold for reports. Flat editorial vector-like shapes rendered as an image, restrained academic design, ample whitespace, neat aligned cards, small simple line icons. No photographs, no decorative illegible small text, no pseudo-code. Render every specified Chinese label exactly and clearly.

Title at top:「論文完稿室｜系統功能圖」
Small subtitle:「先檢查、再確認；保留研究原貌」
Small brand tile green with white「論文」.

Main layout: two clearly separated columns. LEFT about 62% width, heading「基本功能｜不需 AI Key」, six organized feature cards in 2 columns x 3 rows:
1「檔案與規範」 /「上傳 Word 論文」/「PDF、Word、TXT 規範」/「已存規範下拉選單」
2「排版修正」 /「紙張、邊界、字型、行距」/「先列修改清單，再確認套用」/「下載 Word 與修改說明」
3「文獻格式檢核」 /「APA 7／IEEE 期刊基本規則」/「直接列出修正建議」/「Original／Revised 紅字對照」
4「學術來源查證」 /「Crossref、OpenAlex、PubMed」/「華藝、博碩士論文網等人工查證」/「RefCheck 匯出／匯入」
5「統計規則檢查」 /「p 值、標準差、信賴區間」/「部分檢定值一致性」/「僅查錯，不更改數值」
6「分區檢核報告」 /「修正結果、需補資料、詳細對照」/「紅字標示變動與疑點」/「網頁、HTML、PDF」

RIGHT about 34% width with purple frame, heading「AI 進階分析｜選用」:
three stacked cards:
「自備 API Key」/「OpenAI／Gemini／Grok」/「同意傳送後才分析」
「進階判讀」/「學校規範、引用格式與語意」/「統計敘述疑點」
「模型管理」/「模型清單與實際測試」/「記住已驗證模型，不保存金鑰」/「排除明確不可用模型」
Below right cards a small note:「基本查證結果可供 AI 判讀」

Full-width footer banner heading「作者保留最終判斷」
Footer text:「不自動改寫文獻、不更改統計數值；資料不足不補造；結果須人工核對。」
At very bottom small but readable author credit:「國立清華大學 數理教育研究所 吳智鴻教授」

Accuracy constraints: This is a FEATURE MAP, not a sequential workflow. Do not imply paid AI is required for basic citation checking. Do not imply automatic RefCheck API submission; it is export/import. Manual sources must be visibly labeled manual. Do not assert complete academic compliance, plagiarism certification, universal reference-style coverage, or guaranteed correctness. Avoid adding any extra features or claims. No numbered workflow arrows between feature cards.
```

### 背景與標題修正

以首版功能圖為編輯來源，使用內建圖像編輯工具修正透明背景與標題可讀性。

```text
Edit this system feature infographic. Preserve every existing feature card, all its Chinese text, their positions, palette, icons and footer. Fix ONLY background and header readability: render the entire canvas on a solid opaque warm white #FAFCF9 background, including the transparent header and all gaps and margins. Absolutely no alpha/transparency anywhere. Restore the main title「論文完稿室｜系統功能圖」and subtitle「先檢查、再確認；保留研究原貌」in solid dark forest green filled lettering, not outlined lettering. Remove the two tiny decorative lines of Chinese text at the upper right corner; leave that space blank. Keep the top-left green「論文」tile. Maintain all feature card text and the author footer unchanged and legible. Output one finished opaque image.
```

## 分析流程圖

輸出：`images/analysis-workflow.png`。

```text
Use case: infographic-diagram.
Create ONE polished Traditional Chinese ANALYSIS WORKFLOW diagram for「論文完稿室」, matching a forest-green academic web application identity. Wide landscape 16:10, high resolution, crisp Traditional Chinese labels, white/ivory background, forest-green headers, blue/mint basic workflow, purple optional AI branch, gold report outputs, red only for unresolved findings. Clean flat infographic, orthogonal arrows with clear directions and no crossings, ample whitespace, aligned boxes. No photos, no extra invented labels.

Title「論文完稿室｜分析流程圖」
Subtitle「基本檢查免 AI；進階分析由使用者選用」

Layout: a TOP shared start node, TWO clearly separate middle lanes (left main analysis/checking about 65%, right optional Word formatting about 30%), then a bottom ethics banner. This diagram must show correct logical flows; no implication that reference suggestions are written to Word.

Top centered starting box:
「01 上傳 Word 論文」
One fork down into left analysis lane and right formatting lane.

LEFT lane heading「檢查與分析」
Flow downward:
Box「02 選擇基本檢查」
small lines「確認參考文獻範圍與 APA 7／IEEE」「可選文獻查證、統計規則」
Arrow to box「03 執行基本檢查」
small lines「本機規則檢查」「同意後查詢學術資料庫」
Arrow to decision diamond「使用 AI？」
Branch labeled「否」 goes directly down to「05 整理檢核結果」.
Branch labeled「是」 routes to an adjacent PURPLE box「04 AI 進階分析」:
「選供應商與模型、輸入金鑰」
「模型測試與資料傳送同意」
「分析規範、引用與統計敘述」
Then purple arrow merges into「05 整理檢核結果」.
Box 05 small lines「有足夠依據：列出完整修正建議」「資料不足：另列需補資料」「紅字標示變動；保留原文對照」
Then arrow to box「06 人工核對與下載」
small lines「作者確認來源與修正建議」「分區網頁報告／HTML／PDF」

RIGHT lane heading「Word 排版｜選用」
Vertical connected boxes:
「A 載入學校規範」 /「上傳或選取已存規範」
↓
「B 核對排版設定」 /「紙張、邊界、字型、行距」
↓
「C 預覽修改清單」 /「使用者確認後才套用」
↓
「D 下載排版 Word」 /「附修改說明；原稿不覆蓋」

At bottom, full-width green ethics banner:
「共同原則：文獻不自動改寫；統計數值不更改；查無紀錄不等於虛假。」
Small footer:「基本檢查不需 AI API Key；AI 使用與模型測試可能產生費用。」
Author credit:「國立清華大學 數理教育研究所 吳智鴻教授」

Keep boxes readable, no tiny dense text. All arrows must follow the routes specified; particularly the NO branch bypasses AI and reaches results, and the YES branch returns to results. The Word lane is separate and optional: school requirements are not a prerequisite for reference checking. Do not send report suggestions into Word output. Avoid claiming automated corrections of scientific content or automatic access to manual databases.
```

