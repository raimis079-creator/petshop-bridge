process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import { chromium } from 'playwright';
const TOK=process.env.GH_TOKEN, REPO=process.env.GH_REPO, WP=process.env.WP_URL||'https://dev.avesa.lt';
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const out={v:'S1583m'}; const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1366,height:900},ignoreHTTPSErrors:true}); const pg=await ctx.newPage();
await pg.goto(WP+'/?nocache='+Date.now(),{waitUntil:'domcontentloaded',timeout:60000}); await pg.waitForTimeout(3000);
const el=await pg.$('.ps-pop-tabs'); if(el){ await el.scrollIntoViewIfNeeded(); await pg.waitForTimeout(500);
  out.m=await pg.evaluate(()=>{ const c=document.querySelector('.ps-pop-tabs'); const cs=getComputedStyle(c); const cr=c.getBoundingClientRect(); const tabs=[...c.querySelectorAll('.ps-pop-tab')].map(t=>{const s=getComputedStyle(t); const r=t.getBoundingClientRect(); return {txt:t.innerText,margin:s.margin,pad:s.padding,lh:s.lineHeight,minH:s.minHeight,h:Math.round(r.height),w:Math.round(r.width),left:Math.round(r.left-cr.left),right:Math.round(cr.right-r.right),top:Math.round(r.top-cr.top),bottom:Math.round(cr.bottom-r.bottom),font:s.fontSize,boxShadow:s.boxShadow.slice(0,40),display:s.display};}); return {cont:{w:Math.round(cr.width),h:Math.round(cr.height),pad:cs.padding,gap:cs.gap,display:cs.display,align:cs.alignItems},tabs}; });
  const r=await el.boundingBox(); out.shot=await put('screenshots/'+out.v+'_tabs.png',await pg.screenshot({clip:{x:r.x-20,y:r.y-20,width:r.width+40,height:r.height+40}}),out.v+' tabs');
} else out.err='ps-pop-tabs nerastas';
await br.close(); await put('analize/'+out.v+'.json',Buffer.from(JSON.stringify(out,null,1)),out.v); console.log('ok');
