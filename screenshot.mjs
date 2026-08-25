process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const WP=process.env.WP_URL||'https://dev.avesa.lt';
const out={v:'H280B'};
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
try{
  const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:1000},ignoreHTTPSErrors:true}); const pg=await ctx.newPage();
  await pg.goto(WP+'/product/rinkinys-gurmanams-skanestai-sunims/',{waitUntil:'networkidle',timeout:60000}); await new Promise(r=>setTimeout(r,1500));
  out.d=await pg.$eval('form.cart tbody tr',tr=>{const L=[];const walk=(n,dep)=>{if(n.nodeType!==1)return;const c=getComputedStyle(n);const r=n.getBoundingClientRect();L.push(' '.repeat(dep)+n.tagName.toLowerCase()+'.'+String(n.className).slice(0,40)+' h='+Math.round(r.height)+' d='+c.display+' p='+c.paddingTop+'/'+c.paddingBottom+' m='+c.marginTop+'/'+c.marginBottom+' lh='+c.lineHeight+' mh='+c.minHeight);if(dep<4)[...n.children].forEach(x=>walk(x,dep+1));};walk(tr,0);const a=getComputedStyle(tr,'::after');L.push('::after h='+a.height+' p='+a.paddingTop+' d='+a.display);return L;});
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('screenshots/h280diag.json', Buffer.from(JSON.stringify(out,null,1)), 'H280B');
