# AI 進階分析：實作與驗證

## 需求與實作對照

| 使用需求 | 實作 | 驗證 |
| --- | --- | --- |
| 可選 AI、自行輸入金鑰 | AI 預設關閉，金鑰只用於固定 OpenAI 端點；傳送前同意 | 關閉、缺少同意時零 API 請求；執行後輸入框清空；儲存空間與報告沒有金鑰 |
| 分析學校規範 | Responses 結構化輸出；每個設定須附可在原文找到的證據；數值設限 | 模擬規範回應中無原文依據的設定被排除 |
| 常見引用格式檢查及修訂 | 可複選標準，單一修訂目標；逐筆核准；只替換完全匹配的書目段落 | 原文不匹配禁止修改；下載檔正文及未勾選文獻保留，指定斜體保留；APA 可選懸掛縮排和雙行間距 |
| DOI／引用查證 | Crossref 精確 DOI 或書目搜尋；AI 接收候選書目及可用摘要，提供有限證據判讀 | 模擬成功／查無紀錄；實際瀏覽器成功查得 10.1038/nphys1170，題名 Measured measurement |
| 統計檢查 | p 值範圍、負標準差、反向 CI；jStat 重算文字中可辨識的 t/F/卡方上尾或雙尾機率；AI 檢視敘述 | 已驗證異常值、t／卡方重算及中文標準差辨識 |
| HTML 排版及下載 PDF | 全部文字 HTML 逸出；A4 分頁、頁碼；html2canvas + pdf-lib | 測試報告 4 頁，中文可見且完整；HTML 注入字串呈現為文字 |
| 簡潔 UI | 設定、檢核、規範建議、書目修訂分頁；檢核逐項呈現 | 桌面 1366×768 與手機 390×844 檢查；無水平溢出 |

## 架構及限制

靜態 GitHub Pages；一般格式修改仍在本機執行。使用者自行選用的 BYOK 流程直接從瀏覽器呼叫 OpenAI Responses API（`store:false`）和 Crossref，不設共用開發者金鑰。前端無法對有權執行的網站程式、擴充功能或同機使用者隱藏記憶體中的金鑰；不得改成把共用服務金鑰打包進網站。若未來改用平台統一付費，應另建後端保管金鑰、認證和額度限制。

文件與外部書目均視為不可信資料。模型指令禁止執行文件內要求；不允許 AI 操作外部工具或直接修改文件。修訂的段落 ID、原文與允許範圍均再次核對。包含欄位、公式、追蹤修訂等特殊內容的書目不自動改寫。

API 輸出不完整、401、429、網路失敗及取消均不宣稱全部完成；已產生的部分結果可供下載。每批文字上限 14,000 字元，書目批次 9,000 字元；總上限與資料傳送說明列於 UI／README。大型報告可能受瀏覽器記憶體限制；單項無法安全分頁時提示改用 HTML 列印，避免裁切後交付。

統計重算基於已報告且可能已四捨五入的統計量，t 假設雙尾、F/卡方上尾，不代表重新分析原始資料。Crossref 候選結果須核對題名作者；沒有來源全文時不能斷言引文支持研究主張，也不判定學術不端。APA 引用更新包含文字與 AI 建議的斜體，選用的段落排版可與校規衝突，使用者可取消。

PDF 由 HTML 頁面轉成圖像，文字不可選取；完整可搜尋文字保留於 HTML。報告列出建議及完成範圍，不把未勾選建議描述為已修改。

## 驗證紀錄（2026-09-21）

- Edge 自動化：完整匯入、AI 開關與同意、3 個模擬 API 批次、查證來源、報告與 Word 下載；零頁面程式錯誤。
- 失敗路徑：401、429、未完成輸出、無法解析輸出均顯示明確訊息，不回顯服務錯誤內的敏感內容。
- Word 解析：只選取的書目段落變更，正文與其他書目不變，斜體保留。
- 基本功能回歸：清大 PDF 11 項設定、先預覽後套用、原文／圖片／公式／表格／前置頁保留、規範記憶、重複上傳去重、無效檔案及失效預覽阻擋，均通過。
- 真實 Crossref 公開 API 連線通過。OpenAI 沒有使用實際付費金鑰測試，結構化輸入輸出與 UI 流程以模擬 API 驗證；實際模型品質、額度與帳戶權限需使用者自己的金鑰確認。

## 重現測試

在儲存庫根目錄安裝 Node.js、Python、Playwright 與 python-docx：

```text
npm install --no-save playwright
npx playwright install chromium
python -m pip install python-docx
python tests/create_fixture.py
node tests/server.cjs
```

保持預覽伺服器執行，在另一個終端執行：

```text
node tests/ai-smoke.cjs
node tests/ai-errors.cjs
```

前者使用模擬 API，絕不使用付費金鑰。後者另查詢一次公開 Crossref DOI；無法連線時會輸出未完成查證狀態。測試輸出位於忽略提交的 `tests/output/`。Windows 可設定 `BROWSER_CHANNEL=msedge` 使用已安裝的 Edge。

## 發布與維護

推送 main 後由 GitHub Pages 發布根目錄；沒有資料庫遷移。回退本次功能可使用 Git revert 對應提交再推送，不刪除既有規範儲存資料。API 模型、輸出契約與第三方套件升級時重跑上列檢查。報錯應提供畫面訊息與是否為部分結果，不提供 API Key 或未授權論文內容。

官方參考：[OpenAI 結構化輸出](https://developers.openai.com/api/docs/guides/structured-outputs)、[Crossref REST API](https://www.crossref.org/documentation/retrieve-metadata/rest-api/)。

## 多供應商更新（2026-09-21）

新增 Google Gemini generateContent 與 xAI Grok Chat Completions，沿用相同 schema、文件處理與修改前核對。原有 OpenAI 單一供應商描述現已擴充為使用者所選服務。切換供應商時清除金鑰並重設傳送同意，報告保留執行當時的供應商，不隨後續選單變更而改寫。三家均只允許固定官方端點，不自動重試到另一家；沒有共用後端金鑰。

Gemini 與 Grok 模擬整合測試通過：供應商切換、各自驗證標頭與 schema、成功輸出、token 用量、報告名稱、截斷拒絕及 403 安全錯誤。OpenAI 原有完整測試亦通過。未提供實際金鑰，未進行付費模型輸出驗證。執行 `node tests/ai-providers.cjs` 可重現新測試。
