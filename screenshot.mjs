process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const out={versija:'RUN7-R193'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
try{
  /* snippet 2024 kodas */
  const r=await fetch(WP+'/wp-json/code-snippets/v1/snippets/2024',{headers:{Authorization:AUTH}});
  const j=await r.json().catch(()=>null);
  out.snippet_2024 = j ? {name:j.name, active:j.active, code:String(j.code||'').slice(0,2500)} : {klaida:r.status};

  const { chromium } = await import('playwright');
  const br = await chromium.launch({args:['--host-resolver-rules=MAP petshop.lt 79.98.29.24, MAP www.petshop.lt 79.98.29.24']});
  const ctx = await br.newContext({ignoreHTTPSErrors:true, viewport:{width:1366,height:900}});
  const pg = await ctx.newPage();
  const nepavyke=[]; const dev_uzkl=[];
  pg.on('requestfailed',rq=>{ if(nepavyke.length<12) nepavyke.push(rq.url().slice(0,150)+' :: '+(rq.failure()?rq.failure().errorText:'')); });
  pg.on('request',rq=>{ if(rq.url().includes('dev.avesa.lt')&&dev_uzkl.length<10) dev_uzkl.push(rq.url().slice(0,160)); });

  await pg.goto('https://petshop.lt/',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(7000);
  out.titulinis={title:await pg.title()};
  await put('screenshots/r193_titulinis.png', await pg.screenshot({fullPage:false}), 'r193 titulinis');
  await pg.evaluate(()=>window.scrollTo(0,1200)); await pg.waitForTimeout(2500);
  await put('screenshots/r193_titulinis2.png', await pg.screenshot({fullPage:false}), 'r193 titulinis apacia');

  await pg.goto('https://petshop.lt/parduotuve/',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(6000);
  out.parduotuve={title:await pg.title(), korteliu: await pg.locator('.product-small, li.product').count()};
  await put('screenshots/r193_parduotuve.png', await pg.screenshot({fullPage:false}), 'r193 parduotuve');

  await pg.goto('https://petshop.lt/product/duvoplius-zaislas-suniui-pliusinis-melynasis-banginis-27x8x7cm/',{waitUntil:'domcontentloaded',timeout:45000});
  await pg.waitForTimeout(5000);
  out.preke={title:await pg.title()};
  await put('screenshots/r193_preke.png', await pg.screenshot({fullPage:false}), 'r193 preke');

  out.nepavykusios=nepavyke; out.uzklausos_i_dev=dev_uzkl;
  await br.close();
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/r193.json', Buffer.from(JSON.stringify(out,null,1)), 'r193 galutine vizuali');
