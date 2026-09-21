# 詳細分析報告與學術倫理邊界

更新日期：2026-09-21。本文件取代舊版包含「書目文字修訂」的功能說明。

## 允許與禁止

- 允許：檢查學校規範、引用錯誤、統計報告疑點，列出證據與人工查核步驟；預覽後套用紙張、邊界、字型、字級、行距、顏色及頁碼等排版設定。
- 禁止：改寫論文或參考文獻文字，補寫書目、替換作者／年份／DOI、變更統計數值或研究結論。沒有「接受全部文字修訂」或書目改寫下載入口。
- 技術邊界：AI JSON schema 移除 edits；回應處理只回傳 summary、findings、rules、usage，丟棄額外欄位。舊 updateReferences 函式與 UI 操作均已刪除。統計比較結果只留在報告，不傳給文件寫入流程。
- 所有排版規則須落在允許清單內並有規範原文依據，經使用者預覽確認才套用。原文件不覆蓋。

## 報表設計

深綠封面、分級統計卡、編號問題索引、逐項詳細證據、格式依據、原始書目與候選資料來源、作者覆核清單及透明使用紀錄。紅色與粗體標示需人工修正／核對處，金色粗體標示未確認事項，不只靠顏色辨識。

每項列出段落位置、原文證據、疑點說明、人工查核步驟及判讀來源。段落編號不等同 Word 頁碼。報告列出執行狀態、成功批次、失敗原因及限制，不將「未發現」寫為「完全正確」，不給予沒有驗證依據的品質分數。

HTML 所有內容逸出，URL 限 HTTP(S)。PDF 從 HTML 以 A4 分頁產生，附頁碼，內容過長時拒絕裁切並提示使用 HTML 列印。PDF 為圖像頁面，搜尋與複製文字請用 HTML。

## 研究誠信依據

參考 [COPE Authorship and AI tools](https://doi.org/10.24318/cCVRZBms) 的作者責任與 AI 使用透明揭露，以及 [UNESCO 教育研究生成式 AI 指引](https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research) 的人類主導原則。這是設計依據，不是所有機構的倫理合規認證。使用者需依學校、期刊、IRB 和資料授權要求自行核對及揭露。

未查得文獻不是造假的證明；找到 Crossref 紀錄也不代表引用忠實。沒有來源全文或原始研究資料時，必須保留不確定性。AI 不擔任作者，不代替研究者做最終判斷。

## API 與資料

OpenAI Responses、Gemini generateContent、xAI Grok Chat Completions 使用同一檢核 schema。金鑰只在本次瀏覽器記憶體使用，切換供應商會清空並重設同意，不放在網址、localStorage、sessionStorage 或報告。每一家只使用固定官方端點，失敗不自動改送另一家。使用者須信任網站與瀏覽器環境，確保有權傳送資料；平台共用金鑰若日後需要必須另建後端保管。

Crossref 查詢不攜帶 AI 金鑰。規範保存在本機瀏覽器，論文不持久保存。供應商資料處理及 API 費用依各家條款。

## 驗證

- ai-smoke：模擬模型回傳舊 edits，確認無文字套用入口、無 updateReferences 匯出、schema 無 edits；HTML 不含替換段落，包含紅色證據標記、研究倫理說明與來源。
- 產生詳細 PDF 並逐頁檢視 9 頁測試報告，確認中文字、分級色彩及頁尾完整。
- ai-providers：Gemini／Grok 的標頭隔離、供應商切換、回應／用量解析、截斷與 403，仍使用同一只讀檢核流程。
- 原有 Word 排版回歸：原文、表格、公式、圖片與前置頁內容保留；預覽確認及下載正常。
- 未使用真實付費金鑰驗證 AI 判讀品質，不宣稱模型一定遵守所有提示或沒有錯誤；實際防止修改依靠移除文字寫入路徑。

本機重現：安裝 Playwright 及 python-docx，執行 `python tests/create_fixture.py`，啟動 `node tests/server.cjs`，再執行 `node tests/ai-smoke.cjs` 及 `node tests/ai-providers.cjs`。測試輸出位於忽略提交的 tests/output。Windows 可設定 BROWSER_CHANNEL=msedge。

發布：GitHub Pages main/root。回退請使用 git revert；注意回退至舊版可能重新開啟已禁止的書目改寫功能，不能把它當作可接受的正式服務版本。
