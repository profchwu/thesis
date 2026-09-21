const controllers=new Map();
export function refreshChecklist(id){
  let state=controllers.get(id);
  if(!state){
    const panel=document.getElementById(id),tabs=[...panel.querySelectorAll('[data-list]')];
    state={panel,tabs,active:tabs[0].dataset.list,page:0,size:2};controllers.set(id,state);
    tabs.forEach(button=>button.addEventListener('click',()=>{state.active=button.dataset.list;state.page=0;render(state);}));
    panel.querySelector('.previous').addEventListener('click',()=>{state.page--;render(state);});
    panel.querySelector('.next').addEventListener('click',()=>{state.page++;render(state);});
    tabs.forEach(button=>button.dataset.label=button.textContent);
  }
  state.active=state.tabs[0].dataset.list;state.page=0;
  const summary=state.panel.querySelector('[id$="summary"]');
  summary.title=summary.textContent;
  summary.textContent=id==='plan'?'請逐項查看以下檢核結果，確認後才產生 Word。':'修改已完成。可查看紀錄，或下載 Word 與完整說明。';
  render(state);
}
function render(state){
  const {panel,tabs}=state;
  const list=document.getElementById(state.active),items=[...list.children];
  tabs.forEach(button=>{const target=document.getElementById(button.dataset.list);target.hidden=button.dataset.list!==state.active;button.setAttribute('aria-pressed',String(!target.hidden));button.textContent=button.dataset.label+'（'+target.children.length+'）';});
  items.forEach((item,index)=>{item.hidden=false;item.dataset.number=String(index+1).padStart(2,'0');});
  const available=innerWidth>=1000?panel.querySelector('.check-content').clientHeight-16:280;
  const chunks=[[]];let used=0;
  items.forEach(item=>{const height=item.getBoundingClientRect().height+8;if(used+height>available&&chunks.at(-1).length){chunks.push([]);used=0;}chunks.at(-1).push(item);used+=height;});
  const pages=chunks.length;state.page=Math.max(0,Math.min(state.page,pages-1));
  items.forEach(item=>item.hidden=!chunks[state.page].includes(item));
  panel.querySelector('.page-info').textContent=`第 ${state.page+1} / ${pages} 頁 · 共 ${items.length} 項`;
  panel.querySelector('.previous').disabled=state.page===0;
  panel.querySelector('.next').disabled=state.page===pages-1;
}
window.addEventListener('resize',()=>controllers.forEach(state=>{if(!state.panel.hidden)render(state);}));
