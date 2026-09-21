export const AUTHOR="國立清華大學 數理教育研究所 吳智鴻教授";
export const DISCLAIMER="本網站僅供研究與教學使用。網站提供的格式整理、AI 分析、文獻查證、統計檢查及報告，均為輔助資訊，不保證其正確性、完整性、即時性或符合各校最新規範。使用者應自行核對原始文獻、研究資料、統計結果、引用內容及學校正式規定，並對最終提交或使用的內容負責。AI 或外部資料庫可能產生錯誤、遺漏或無法查證的結果；查無文獻不等於虛假，查得書目也不代表引用主張正確。本網站及其報告不代表學校官方審查、認證或學術不端判定。使用者應保留原始檔案，確認有權上傳或傳送相關資料，並自行承擔使用本網站及其輸出結果的風險；啟用 AI 所產生的 API 費用由使用者自行負擔。";
const dialog=document.querySelector('#notice-dialog');
document.querySelector('#open-notice')?.addEventListener('click',()=>dialog.showModal());
document.querySelector('#close-notice')?.addEventListener('click',()=>dialog.close());
