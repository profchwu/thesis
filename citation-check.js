// Audit only: this module never writes to Word or replaces manuscript text.
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
const yearRE=/(?:18|19|20)\d{2}[a-z]?/ig;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const CITATION_LIMIT='基本檢查僅比對可辨識的作者／年份或明示編號，不代表主張正確。支援常見中英文作者年份與 [編號]；註腳、圖片、跨段、機構縮寫及特殊引用需人工核對。';
function authorKey(text){return norm(text.replace(/^\s*\[\d+\]\s*/,'').split(/[,，、;&（(]|\band\b|\bet al\b|等/u)[0].trim());}
function refInfo(row){const text=row.text.replace(/^\s*\[\d+\]\s*/,'');const y=text.match(yearRE)?.[0]?.toLowerCase()||'';return{...row,key:authorKey(text),year:y,number:row.text.match(/^\s*\[(\d+)\]/)?.[1]||''};}
export function checkCitations(paragraphs,refs){
 const info=refs.map(refInfo),items=[];
 for(const p of paragraphs){
  const add=(marker,author,year,number,offset)=>{
   const same=info.filter(r=>number?r.number===number:r.key===authorKey(author));
   const exact=same.filter(r=>number||r.year===year.toLowerCase());
   const status=exact.length===1?'matched':exact.length>1?'ambiguous':same.length?'mismatch':'missing';
   // Sentence boundaries are conservative; retain the complete paragraph as context.
   const before=p.text.slice(0,offset),after=p.text.slice(offset+marker.length);
   const left=Math.max(before.lastIndexOf('。'),before.lastIndexOf('！'),before.lastIndexOf('？'),before.lastIndexOf('\n'))+1;
   const end=after.search(/[。！？\n]|\.(?:\s|$)/);
   const sentence=p.text.slice(left,end<0?p.text.length:offset+marker.length+end+1).trim();
   items.push({id:'C'+String(items.length+1).padStart(3,'0'),paragraph:p.index+1,marker,sentence,context:p.text,status,referenceParagraph:exact.length===1?exact[0].paragraph:null,reference:exact.length===1?exact[0].text:'',candidates:(exact.length?exact:same).map(r=>r.text),message:status==='matched'?'已找到唯一的作者／年份或編號對應；其他作者及引用主張仍須核對。':status==='mismatch'?'找到同作者，但年份（含 a／b）不一致；請核對原始出版資料。':status==='ambiguous'?'有多筆相同作者／年份或編號，無法唯一對應，請補查完整作者與 a／b。':'未找到可對應書目；可能缺漏、作者拼寫不同或格式未辨識，請人工核對。'});
  };
  const occupied=[];
  for(const m of p.text.matchAll(/[（(]([^()（）\n]{1,350})[）)]/g)){
   let found=false;
   for(const chunk of m[1].split(/[;；]/)){
    const hit=chunk.match(/^\s*([\p{L}][\p{L}\p{M}\s.,，、&’'\-]{0,110}?)\s*[,，]\s*((?:18|19|20)\d{2}[a-z]?(?:\s*[,，]\s*(?:18|19|20)\d{2}[a-z]?)*)\s*(?:[,，]\s*(?:p{1,2}\.|頁).*)?$/iu);
    if(hit)for(const year of hit[2].match(yearRE)||[]){add(m[0],hit[1],year,'',m.index);found=true;}
   }
   if(found)occupied.push([m.index,m.index+m[0].length]);
  }
  for(const m of p.text.matchAll(/([A-Z][\p{L}\p{M}’'\-]+(?:\s+(?:et al\.|(?:and|&)\s+[A-Z][\p{L}\p{M}’'\-]+))?|[\p{Script=Han}]{2,4}(?:等人?|與[\p{Script=Han}]{2,4})?)\s*[（(]((?:18|19|20)\d{2}[a-z]?)[）)]/gu))if(!occupied.some(([a,b])=>m.index>=a&&m.index<b))add(m[0],m[1].split('與')[0],m[2],'',m.index);
  for(const m of p.text.matchAll(/\[(\d+(?:\s*[,，–-]\s*\d+)*)\]/g)){
   const nums=[];for(const token of m[1].split(/[,，]/)){const range=token.trim().split(/[–-]/).map(Number);if(range.length===2&&range[1]>=range[0]&&range[1]-range[0]<=50)for(let n=range[0];n<=range[1];n++)nums.push(n);else if(range.length===1)nums.push(range[0]);}
   for(const n of nums)add(m[0],'','',String(n),m.index);
  }
 }
 return items;
}
export function evidenceForCitation(item,registry,manual,assess){
 if(!item.referenceParagraph)return[];
 const row=registry.find(r=>r.paragraph===item.referenceParagraph&&r.text===item.reference),out=[];
 if(row&&assess(row).code!=='problem')for(const check of row.checks||[])for(const candidate of check.candidates||[]){const a=assess({...row,checks:[{...check,candidates:[candidate]}]});if(out.length<2&&a.code==='ok'&&candidate.abstract&&!out.some(e=>e.text===candidate.abstract.slice(0,7000)))out.push({id:item.id+'-abstract-'+out.length,level:'摘要',text:candidate.abstract.slice(0,7000),url:a.url||'',source:a.source,provenance:'資料庫摘要；書目基本欄位相符，非全文'});}
 const supplied=manual?.[item.referenceParagraph];
 if(supplied?.text&&supplied.reference===item.reference)out.push({id:item.id+'-provided',level:supplied.level,text:supplied.text,url:supplied.url,source:'使用者提供',provenance:'使用者自行對應來源；系統未獨立驗證來源身分或完整性'});
 return out;
}
export const VERDICTS={supported:'支持（限已提供證據）',partial:'部分支持',related:'僅主題相關',contradicted:'與來源矛盾',insufficient:'證據不足／無法判定'};
export function pendingReview(item,evidence=[]){return{...item,evidence,verdict:'insufficient',quote:'',evidenceId:'',reason:evidence.length?'尚未完成 AI 判讀。':'沒有可用的來源摘要／段落，或無法唯一對應文獻；不能判定引用正確與否。',advice:'請核對書目對應，完成基本查證或補充來源段落後再分析。',reviewed:false};}
export function validateCitationReviews(items,returned){
 return items.map(item=>{const matches=(Array.isArray(returned)?returned:[]).filter(r=>r?.id===item.id);const r=matches.length===1?matches[0]:null;const source=item.evidence.find(e=>e.id===r?.evidenceId);
  if(!r||!Object.hasOwn(VERDICTS,r.verdict)||!['quote','reason','advice'].every(k=>typeof r[k]==='string'))return{...item,reason:'AI 未回傳此項有效結果；需重新分析。'};
  const quote=r.quote.trim();const valid=source&&quote.length>=8&&source.text.includes(quote);
  if(!valid)return{...item,verdict:'insufficient',reason:'AI 未提供可在來源逐字核對的證據，已降為無法判定。',advice:'請取得來源全文並人工核對；不採用未經證據支持的結論。',reviewed:false};
  return{...item,verdict:r.verdict,evidenceId:source.id,quote,reason:r.reason.slice(0,4000),advice:r.advice.slice(0,4000),reviewed:true};
 });
}
export function citationCard(item,advanced=false){const issue=advanced?item.verdict!=='supported':item.status!=='matched';return `<article class="basic-reference ${issue?'problem':'ok'}"><h3>${esc(item.id)} · 第 ${item.paragraph} 段 · ${esc(advanced?VERDICTS[item.verdict]:item.status==='matched'?'書目對應相符（非語意通過）':'需人工核對')}</h3><p><strong>Original｜論文原句</strong></p><p>${esc(item.sentence)}</p><p><strong>引用：</strong>${esc(item.marker)}</p><p><strong>對應文獻：</strong>${esc(item.reference||item.candidates?.join('\n')||'無法唯一對應')}</p>${advanced?`<p class="${issue?'format-error':''}"><strong>判讀：</strong>${esc(item.reason)}</p>${(item.evidence||[]).map(s=>`<p><strong>${esc(s.level)}｜${esc(s.source)}</strong> · ${esc(s.provenance)}</p><details><summary>查看提供給 AI 的來源段落</summary><p>${esc(s.text)}</p></details>${/^https:\/\//i.test(s.url)?`<p><a target="_blank" rel="noopener noreferrer" href="${esc(s.url)}">開啟來源 ↗</a></p>`:''}`).join('')}<p><strong>判讀依據原文：</strong>${esc(item.quote||'未取得可核對引文')}</p><p class="${issue?'format-error':''}"><strong>處理建議（不改寫原句）：</strong>${esc(item.advice)}</p><p class="help">僅依上列摘要／段落判讀；主題相關不等於支持主張，需作者確認全文脈絡。</p>`:`<p class="${issue?'format-error':''}">${esc(item.message)}</p>`}</article>`;}
