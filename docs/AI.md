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

各資料庫查詢不攜帶 AI 金鑰。規範保存在本機瀏覽器，論文不持久保存。供應商資料處理及 API 費用依各家條款。

## 驗證

- ai-smoke：模擬模型回傳舊 edits，確認無文字套用入口、無 updateReferences 匯出、schema 無 edits；HTML 不含替換段落，包含紅色證據標記、研究倫理說明與來源。
- 產生詳細 PDF 並逐頁檢視 9 頁測試報告，確認中文字、分級色彩及頁尾完整。
- ai-providers：Gemini／Grok 的標頭隔離、供應商切換、回應／用量解析、截斷與 403，仍使用同一只讀檢核流程。
- 原有 Word 排版回歸：原文、表格、公式、圖片與前置頁內容保留；預覽確認及下載正常。
- 未使用真實付費金鑰驗證 AI 判讀品質，不宣稱模型一定遵守所有提示或沒有錯誤；實際防止修改依靠移除文字寫入路徑。

本機重現：安裝 Playwright 及 python-docx，執行 `python tests/create_fixture.py`，啟動 `node tests/server.cjs`，再執行 `node tests/ai-smoke.cjs` 及 `node tests/ai-providers.cjs`。測試輸出位於忽略提交的 tests/output。Windows 可設定 BROWSER_CHANNEL=msedge。

發布：GitHub Pages main/root。回退請使用 git revert；注意回退至舊版可能重新開啟已禁止的書目改寫功能，不能把它當作可接受的正式服務版本。

## 多來源查證更新

新增 sources.js，逐來源保存 outcome、查詢方式／URL／時間與候選清單。OpenAlex 金鑰只可傳至 api.openalex.org 的 Authorization 標頭，不能寫入來源 URL 或 AI payload。PubMed 每次請求至少間隔 400ms，使用 esearch＋esummary，無需 NCBI 金鑰；任一來源失敗不阻斷其他來源。

Crossref／OpenAlex／PubMed 為自動查詢。華藝、國圖博碩士論文網、WoS、Scopus、Google Scholar 僅提供已核對的官方首頁，不假造深層搜尋參數或宣稱已登入查詢。人工登錄需官方網域網址、狀態與依據，標示使用者自行登錄／系統未獨立驗證。禁止含帳密或金鑰的網址、非 HTTP(S) 及其他網域。所有待確認狀態保留在報告中。

2026-09-21 以真實 DOI 10.1056/NEJMoa2034577 實測：三個公開 API 皆回傳相符的題名及 DOI。模擬測試覆蓋 OpenAlex 429、其他來源繼續、金鑰隔離、人工結果與安全網址，並驗證文獻／統計仍沒有文字修改入口。人工資料庫未自動抓取或繞過登入。

## RefCheck 匯出／匯回更新

新增獨立 refcheck.js：復用既有只讀段落擷取，不需 AI；透過使用者點擊複製或下載純文字，外站用 target=_blank + noopener noreferrer，沒有夾帶文獻到 URL，也沒有 POST／跨站表單提交。未查得正式 API，沒有宣稱自動送出或輪詢外站結果。

TXT／CSV 匯入視為不可信使用者附件，檔案尺寸／文字長度設限；HTML 逸出，不執行內容，不推斷來源真實性或成功狀態。匯入時記錄目前論文名稱與時間；切換文件或規範會清除。非同步讀取若文件狀態已改變則捨棄，避免錯配論文。內容不送 AI、不寫回 Word。

tests/refcheck.cjs 已驗證：只匯出書目、不含正文、匯入安全逸出、HTML／PDF 可下載、零外部請求、換文件清除紀錄。三方結果只以「使用者匯入、未獨立驗證」方式留存。


## 基本功能與逐篇報告改版

新增 basic-ui.js、reference-assessment.js。資料庫查詢與確定性統計檢查獨立於 AI；僅統計時不需外部傳送同意、不發網路請求。AI 只沿用基本報告的快照，保持原始檢查來源標示。

OK 必須有候選的完整題名、第一作者姓名片段、年份及（原文有提供時）DOI 相符，僅作基本書目一致性判定。DOI 指向不符題名／年份或撤稿標記時列有疑點；候選未完整吻合為待核對；所有來源查無才列查無紀錄，失敗／取消保留未完成。人工登錄不等同自動確認。不能驗證全文支持或作者群完整性。

報告改為逐篇結論索引、文獻依據、其他問題、必要摘要與範圍責任，移除重複的空白人工來源與重複問題索引。PDF 保留所有原始書目與實際來源狀態。tests/basic.cjs 覆蓋不使用 AI、正確／DOI 題名衝突／年份衝突／作者不符／未找到／查詢失敗／人工確認、篩選、統計本機運算、HTML／PDF 及原稿不變；既有 AI、RefCheck 和 Word 回歸保持。

## Gemini 連線診斷
保留官方模型 ID gemini-2.5-flash，新增 models.get 唯讀檢查，不傳送論文、不測試付費生成。成功僅表示可讀取模型且支援 generateContent，不能保證生成額度、結構化輸出或內容審查通過。HTTP 錯誤依安全分類提示，不回顯可能含金鑰／原稿的服務訊息。分析失敗原因保留於報告狀態，切換供應商仍可辨識先前錯誤。tests/gemini-check.cjs 及既有 provider/smoke 測試通過；沒有實際使用者金鑰，不宣稱已復現其帳戶問題。
官方依據：https://ai.google.dev/api/models 、 https://ai.google.dev/gemini-api/docs/deprecations 、 https://ai.google.dev/gemini-api/docs/troubleshooting 。

## Gemini 完整模型清單
新增 models.list 即時載入，跟隨 nextPageToken 取得全部分頁，依模型 ID 去重排序。下拉式選单顯示所有模型，不支援 generateContent 者禁用；生成方法支援不等於文字、JSON、額度或實際存取已驗證。失敗不保留部分清單，金鑰／供應商切換或關閉會清除；不傳送論文、不將金鑰放網址。tests/gemini-models.cjs 驗證分頁、選取、非生成模型禁用、第二頁失敗與金鑰切換。官方依據：https://ai.google.dev/api/models#method:-models.list 。

## 基本引用格式檢查
新增 reference-format.js。APA 7／IEEE 的期刊論文基本格式檢查隨書目查證一起執行，與書目 OK 分開顯示；可篩選格式缺漏／待確認，逐項翻頁檢視，HTML／PDF 同步列出紅色粗體問題、格式範本與來源欄位建議。Crossref 保留文獻類型、結構化姓名、文章編號；僅在題名相符、DOI 不衝突且來源明確為 journal-article 時給出期刊欄位建議。其他類型或未匹配文獻僅提供待確認與範本，不補造資料。
檢查包含 APA 年份日期結構、作者列法、DOI 連結，IEEE 引用編號，以及來源提供的期刊、卷期、頁碼、文章編號。純文字不能確認 Word 斜體／縮排，亦非完整樣式驗證；不將建議寫入論文。欄位示例保留來源題名，不自動猜測英文專有名詞大小寫。tests/reference-format.cjs 和 basic.cjs 驗證日期、PP、卷頁缺漏、文章編號、類型限制、報告紅字及原文不變。
參考規範：https://apastyle.apa.org/style-grammar-guidelines/references/examples/journal-article-references ； https://journals.ieeeauthorcenter.ieee.org/wp-content/uploads/sites/7/IEEE_Reference_Guide.pdf 。


## 工作台與報告改版驗證

新增 model-memory.js（SHA-256 雜湊區分供應商與金鑰；不記錄原始錯誤或金鑰）、report-view.js（獨立 sandbox iframe 預覽）。API 只有實際結構化輸出通過才標 verified，models.get 僅標 listed；模型確定失敗標 unavailable，暫時性錯誤保留紀錄。支援清除與重新檢核，禁止自動輪流付費測試所有模型。

報告按內容分區，文獻與問題單項選擇，左右原文／建議對照；輸出 HTML 所有資料仍逸出，互動程式為固定程式，PDF 收集全部 report-block，不受網頁分區／單筆隱藏狀態影響。保留 readonly 原稿邊界；數值建議僅是人工查核動作。

model-memory.cjs 驗證重新載入持續記憶、金鑰分離、404 排除、429 保留、無明文金鑰；basic.cjs 驗證首頁入口、sandbox 分區與逐筆導覽、比較顯示及 PDF；既有 AI／供應商／RefCheck／Word 保留回歸測試。


## Original／Revised 完整書目對照

逐篇結果改為每頁一篇，直接顯示完整 Original 與 Revised；格式詳情、分區網頁、HTML 與 PDF 使用相同的 reference-comparison.js。以有界 token LCS 比較，原文刪除／調整片段與建議新增／調整片段呈現紅色粗體底線，未知佔位欄位一律標紅；保留文字不整段染紅。不產生 Word 寫入，未知書目不假造 Revised。超長 PDF 書目分段延續而不裁切。reference-comparison.cjs 驗證全文保留、差異標記、佔位字、未變動、HTML 逸出與分段。


## 直接呈現修正結果

報告預設頁改為「修正結果」，列出每篇完整建議書目與紅字變動，不再以判定說明、截斷原文、OK 狀態卡作為首頁。具未確認佔位或來源不足的書目移至「需補資料」，不得冒充完整修訂。來源及 Original／Revised 留在詳細對照區；HTML／PDF 同步。APA 建議中的期刊與卷號依來源欄位加斜體。basic.cjs 驗證預設分區直接呈現完整書目、原文對照仍可用、下載及原稿不變。
