import {doiFrom} from './ai-core.js?v=20260921-direct8';
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const doi=s=>String(s||'').replace(/^https?:\/\/(?:dx\.)?doi.org\//i,'').toLowerCase();
export function assessReference(row){
 const checks=row.checks||[],manual=checks.filter(c=>c.manual),api=checks.filter(c=>c.mode==='api'),original=norm(row.text),wanted=doi(doiFrom(row.text));
 const evidence=api.flatMap(check=>(check.candidates||[]).map(c=>{const title=norm(c.title),first=String(c.authors?.[0]||''),surname=first.includes(',')?first.split(',')[0]:first.split(/\s+/).filter(x=>x.length>2).at(-1)||first;const fields={doi:!wanted?null:doi(c.doi)===wanted,title:title.length>=8&&original.includes(title),author:norm(surname).length>=2&&norm(row.text.split(/[,;&]|(?:19|20)\d{2}/)[0]).includes(norm(surname)),year:/^(?:19|20)\d{2}$/.test(String(c.year))&&new RegExp('(?<!\\d)'+String(c.year).replace(/\D/g,'')+'(?!\\d)').test(row.text)};return{check,c,fields};}));
 const matched=evidence.find(x=>x.fields.title&&x.fields.author&&x.fields.year&&x.fields.doi!==false);
 const exact=evidence.filter(x=>wanted&&x.fields.doi),conflict=exact.find(x=>!x.fields.title||!x.fields.year),manualConflict=manual.find(c=>c.manual.status==='mismatch');
 const result=(code,label,reasons,item=matched||exact[0]||evidence[0])=>({code,label,reasons,fields:item?.fields||{},candidate:item?.c||null,source:item?.check.database||'',url:item?.c.url||item?.check.source||'',checkedAt:row.checkedAt||'',incomplete:api.filter(c=>c.outcome==='error').map(c=>c.database)});
 if(manualConflict)return result('problem','有疑點',['人工登錄書目不符：'+manualConflict.manual.note]);
 if(conflict)return result('problem','有疑點',[!conflict.fields.title?'DOI 紀錄的完整題名未與原文相符，請核對題名。':'DOI 紀錄年份與原文不符或未提供，請核對年份。'],conflict);
 if(matched?.c.retracted)return result('problem','有疑點',['書目基本欄位相符，但資料庫有撤稿標記；請核對出版者公告。']);
 if(matched)return result('ok','OK（基本書目）',['題名、第一作者、年份'+(wanted?'及 DOI':'')+'相符；其他作者、卷期頁碼、引用格式與全文主張仍須人工確認。']);
 const human=manual.find(c=>c.manual.status==='matched');
 if(human)return {...result('manual','人工確認相符',['使用者登錄：'+human.manual.note+'；系統未獨立驗證。']),source:human.database,url:human.manual.url};
 if(evidence.length)return result('review','待核對',['找到候選紀錄，但題名、第一作者、年份與 DOI 未全部確認相符；不可視為 OK。']);
 if(api.some(c=>c.outcome==='error')||api.some(c=>c.outcome==='pending'))return result('incomplete','查詢未完成',['部分來源連線、額度或資料解析失敗，請重試或人工查證。']);
 if(api.length&&api.every(c=>c.outcome==='not_found'))return result('missing','查無紀錄',['所選資料庫未找到紀錄；收錄有限，不能判定為虛假文獻。']);
 return result('review','尚未查證',['尚無可用的自動查詢或人工核對結果。']);
}
