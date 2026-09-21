import {assessReference} from './reference-assessment.js?v=20260921-direct8';
const norm=s=>String(s||'').normalize('NFKC').toLowerCase().replace(/[^\p{L}\p{N}]/gu,'');
export function checkReferenceFormat(row,style='APA 7'){
 const a=assessReference(row),c=a.candidate,t=row.text||'',issues=[],parts=[];
 const add=(text,evidence='')=>issues.push({text,evidence});
 const trusted=c&&a.fields.title&&a.fields.doi!==false&&(a.fields.doi===true||a.fields.author);
 const journal=trusted&&c.type==='journal-article';
 const template=style==='IEEE'?'[編號] 名字縮寫 姓氏, “文章題名,” 期刊名, vol. 卷, no. 期, pp. 起–迄頁／Art. no. 文章編號, 年份, doi: DOI.':'姓氏, 名字縮寫. (年份). 文章題名（句首大寫）. 期刊名, 卷(期), 起–迄頁／Article 文章編號. https://doi.org/DOI';
 if(!journal)return {style,status:'待人工確認文獻類型',issues:[{text:'尚無題名相符且明確標示為期刊論文的資料；不能套用期刊格式判定正確。',evidence:''}],parts:[],template,note:'以下是期刊論文格式範本；書籍、學位論文、會議、網頁等須另按文獻類型檢查。未驗證斜體、懸掛縮排或全文引用。'};
 const present=value=>norm(value)&&norm(t).includes(norm(value));
 // Examine publication fields only after the journal name; avoid matching the year or DOI digits.
 const pos=t.toLowerCase().indexOf(String(c.journal||'').toLowerCase());
 const tail=(pos>=0?t.slice(pos+String(c.journal).length):'').split(/https?:|\bdoi\s*:/i)[0];
 const numberPresent=value=>{const n=String(value||'').replace(/[–—]/g,'-');return n&&new RegExp('(?:^|[^\\p{L}\\p{N}])'+n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&').replace(/-/g,'[-–—]')+'(?=$|[^\\p{L}\\p{N}])','u').test(tail);};
 if(style==='APA 7'&&/\(\s*\d{4}\s*[,/，]\s*\d/.test(t))add('APA 7 期刊論文日期通常只列年份；請刪除不適用的月／日。',t.match(/\(\s*\d{4}[^)]*\)/)?.[0]||'');
 if(style==='APA 7'&&!/\(\s*\d{4}[a-z]?\s*\)\s*[.。]/i.test(t))add('年份應以 (年份). 呈現；目前未辨識到此結構。');
 if(style==='IEEE'&&!/^\s*\[\d+\]/.test(t))add('IEEE 書目應以 [編號] 開頭；編號需與文內引用對應，不按本次清單位置自動指定。');
 if(/\bPP\s*,/i.test(t))add('「PP」可能是預刊暫用卷次，請核對正式卷期，勿當成已確認卷號。','PP');
 const fields=[['年份',c.year, a.fields.year],['期刊',c.journal,present(c.journal)],['卷',c.volume,numberPresent(c.volume)],['期',c.issue,numberPresent(c.issue)],['頁碼',c.pages,numberPresent(c.pages)],['文章編號',c.articleNumber,numberPresent(c.articleNumber)]];
 for(const [label,value,found]of fields){if(value&&!found)add(`${label}未與資料庫相符或有缺漏；資料庫列為「${value}」，請回原始出版紀錄確認。`,String(value));}
 if(c.doi&&(!/https:\/\/doi\.org\//i.test(t))&&style==='APA 7')add('APA 7 的 DOI 請呈現為 https://doi.org/… 連結。',c.doi);
 if(c.articleNumber&&style==='APA 7'&&!new RegExp('\\bArticle\\s+'+String(c.articleNumber).replace(/[.*+?^${}()|[\]\\]/g,'\\$&'),'i').test(t))add('此紀錄提供文章編號；APA 7 請用 Article '+c.articleNumber+'，不可視為一般頁碼。',String(c.articleNumber));
 if(c.pages&&/^(\d+)[-–—]\1$/.test(c.pages))add('資料庫頁碼起迄相同，可能是暫存資料；請核對正式出版版本。',c.pages);
 const part=(label,value,bad=false,italic=false)=>parts.push({label,text:String(value),bad,italic});
 let authors='【作者姓氏與名字縮寫待核對】';
 const names=c.authorDetails||[];
 if(names.length&&names.every(n=>n.family&&n.given)){const list=names.map(n=>{const initials=n.given.split(/[\s-]+/).filter(Boolean).map(x=>Array.from(x)[0]+'.').join(' ');return style==='IEEE'?initials+' '+n.family:n.family+', '+initials;});authors=style==='IEEE'?list.join(', '):list.length>20?list.slice(0,19).join(', ')+', … '+list.at(-1):list.length===1?list[0]:list.slice(0,-1).join(', ')+', & '+list.at(-1);}
 const authorPrefix=t.replace(/^\s*\[\d+\]\s*/, '').split(/\(\s*(?:19|20)\d{2}/)[0];const authorsMismatch=style==='APA 7'&&!authors.startsWith('【')&&norm(authorPrefix)!==norm(authors);if(authorsMismatch)add('作者列法與來源提供的姓氏、名字縮寫或順序不一致，請逐一核對全部作者；勿直接覆寫。',authors);part('作者',authors,authors.startsWith('【')||authorsMismatch);if(authors.startsWith('【'))add('來源未提供可安全區分姓氏與名字的全部作者欄位；不猜測或補寫姓名。');
 if(!c.journal||!c.volume)add('來源的期刊名或正式卷號未齊全；請查核預刊／正式出版狀態，不補造缺漏資料。');part('年份',c.year?(style==='IEEE'?String(c.year):'('+c.year+').'):'【年份待核對】',!a.fields.year);
 part('題名',c.title+'.');part('期刊與卷',`${c.journal||'【期刊待核對】'}${c.volume?', '+c.volume:''}`,!c.journal||!c.volume||!present(c.journal)||!numberPresent(c.volume),true);
 if(c.issue)part('期','('+c.issue+')',!numberPresent(c.issue));
 if(c.articleNumber)part('文章編號',(style==='IEEE'?'Art. no. ':'Article ')+c.articleNumber,!numberPresent(c.articleNumber));else if(c.pages)part('頁碼',c.pages,!numberPresent(c.pages));else{part('頁碼／文章編號','【未提供；查核預刊狀態或正式紀錄】',true);add('資料庫未提供頁碼或文章編號；可能為預刊，須查核，不能補造。');}
 if(c.doi)part('DOI','https://doi.org/'+c.doi,!/https:\/\/doi\.org\//i.test(t)&&style==='APA 7');
 return {style,status:issues.length?'格式有缺漏／疑點':'已檢查的格式規則未發現問題',issues,parts,template,note:'這是依資料庫整理的欄位建議，並非已認證的完整引用字串。請核對所有作者與標點、英文題名句首大寫／專有名詞、正式出版年份、期刊與卷號斜體及懸掛縮排；純文字檢查不能確認 Word 的斜體與縮排。期號與頁碼僅在出版紀錄提供時使用。'};
}
export function formatHTML(result,escape){const e=escape;return `<div class="format-review"><strong class="${result.issues.length?'format-error':''}">${e(result.style+'｜'+result.status)}</strong><ul>${result.issues.map(x=>`<li class="format-error">${e(x.text)}${x.evidence?'〔'+e(x.evidence)+'〕':''}</li>`).join('')}</ul><p><b>正確格式範本：</b>${e(result.template)}</p>${result.parts.length?'<p><b>本篇欄位建議（須人工核對）：</b></p>'+result.parts.map(p=>`<span class="format-field ${p.bad?'format-error':''}">${e(p.label)}：${p.italic?'<em>':''}${e(p.text)}${p.italic?'</em>':''}</span>`).join(' · '):''}<p class="help">${e(result.note)}</p></div>`;}

export function referenceSuggestion(row,result){
 if(!result.parts.length)return '尚無足夠來源資料，不能提供此篇的完整建議。請依文獻類型核對；不補造作者、題名或出版資訊。\n期刊格式範本：'+result.template;
 const fields=Object.fromEntries(result.parts.map(p=>[p.label,p.text]));
 if(result.style==='IEEE'){const c=assessReference(row).candidate;return `[編號待對照文內引用] ${fields['作者']}, “${String(c.title||'【題名待核對】').replace(/\.$/,'')},” ${c.journal||'【期刊待核對】'}, vol. ${c.volume||'【卷待核對】'}${c.issue?', no. '+c.issue:''}, ${c.articleNumber?'Art. no. '+c.articleNumber:c.pages?'pp. '+c.pages:'【頁碼／文章編號待核對】'}, ${c.year||'【年份待核對】'}${c.doi?', doi: '+c.doi:''}.`;}
 return `${fields['作者']} ${fields['年份']} ${fields['題名']} ${fields['期刊與卷']}${fields['期']||''}, ${fields['文章編號']||fields['頁碼']||fields['頁碼／文章編號']}. ${fields['DOI']||''}`;
}
