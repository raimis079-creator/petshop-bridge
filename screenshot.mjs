process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge'; const WP=process.env.WP_URL||'https://dev.avesa.lt';
const out={v:'H292B'}; const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'}; let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){} const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
try{
  const {chromium}=await import('playwright'); const br=await chromium.launch();
  const ctx=await br.newContext({viewport:{width:1440,height:1100},ignoreHTTPSErrors:true,bypassCSP:true}); const pg=await ctx.newPage();
  await pg.goto(WP+'/product/rinkinys-gurmanams-skanestai-sunims/?nocache='+Date.now(),{waitUntil:'networkidle',timeout:60000}); await miegok(1500);
  out.body=await pg.$eval('body',n=>n.className);
  out.stilius=await pg.$$eval('style',ns=>ns.filter(n=>n.textContent.includes('ps-fiksuotas-rinkinys')).length);
  out.thead=await pg.$$eval('form.cart thead',ns=>ns.map(n=>getComputedStyle(n).display));
  out.th_txt=await pg.$$eval('form.cart th',ns=>ns.map(n=>n.textContent.trim()+'|'+getComputedStyle(n).display));
  out.nauda=await pg.$$eval('.ps-rink-nauda',ns=>ns.map(n=>getComputedStyle(n).display));
  out.rowh=await pg.$$eval('form.cart tbody tr',ns=>ns.map(n=>Math.round(n.getBoundingClientRect().height)));
  out.put=await put('screenshots/h292_gurm.png',await pg.screenshot({fullPage:false}),'H292B');
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('screenshots/h292diag.json', Buffer.from(JSON.stringify(out,null,1)), 'H292B');
