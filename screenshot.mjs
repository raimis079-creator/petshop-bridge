process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const out={versija:'RUN4-R190'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
try{
  const { chromium } = await import('playwright');
  const br = await chromium.launch({args:['--host-resolver-rules=MAP petshop.lt 79.98.29.24, MAP www.petshop.lt 79.98.29.24']});
  const ctx = await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1366,height:900}});
  const pg = await ctx.newPage();
  const konsole=[]; const nepavyke=[]; const dev_uzklausos=[];
  pg.on('console',m=>{ if(m.type()==='error'&&konsole.length<10) konsole.push(m.text().slice(0,200)); });
  pg.on('requestfailed',r=>{ if(nepavyke.length<10) nepavyke.push(r.url().slice(0,150)+' :: '+(r.failure()?r.failure().errorText:'')); });
  pg.on('request',r=>{ if(r.url().includes('dev.avesa.lt')&&dev_uzklausos.length<15) dev_uzklausos.push(r.url().slice(0,180)); });

  await pg.goto('https://petshop.lt/',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(6000);
  const html = await pg.content();
  out.titulinis = {title: await pg.title(), html_ilgis: html.length};
  const vietos=[]; let idx=0;
  while((idx = html.indexOf('dev.avesa.lt', idx)) !== -1 && vietos.length<12){ vietos.push(html.slice(Math.max(0,idx-90), idx+50).replace(/\s+/g,' ')); idx+=12; }
  out.dev_pedsakai_html = vietos;
  await put('screenshots/r190_titulinis.png', await pg.screenshot({fullPage:false}), 'r190 titulinis');

  await pg.goto('https://petshop.lt/parduotuve/',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(6000);
  out.parduotuve = {title: await pg.title(), prekiu_korteliu: await pg.locator('.product-small, li.product').count()};
  await put('screenshots/r190_parduotuve.png', await pg.screenshot({fullPage:false}), 'r190 parduotuve');

  /* viena reali preke per parduotuves pirma nuoroda */
  const pirma = await pg.locator('li.product a, .product-small a').first().getAttribute('href').catch(()=>null);
  out.pirmos_prekes_url = pirma;
  if(pirma){
    await pg.goto(pirma,{waitUntil:'domcontentloaded',timeout:45000});
    await pg.waitForTimeout(5000);
    out.preke = {title: await pg.title(), url: pg.url()};
    await put('screenshots/r190_preke.png', await pg.screenshot({fullPage:false}), 'r190 preke');
  }
  out.konsoles_klaidos = konsole;
  out.nepavykusios_uzklausos = nepavyke;
  out.uzklausos_i_dev = dev_uzklausos;
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r190.json', Buffer.from(JSON.stringify(out,null,1)), 'r190 vizuali patikra');
