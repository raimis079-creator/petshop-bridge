import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}

const LOG=[]; const ERR=[];
const step=(n,ok,d)=>LOG.push({n,ok,d:String(d===undefined?'':d).replace(/\s+/g,' ').slice(0,200)});
const wait=(ms)=>new Promise(r=>setTimeout(r,ms));

(async()=>{
 let br;
 try{
  br=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
  const ctx=await br.newContext({viewport:{width:1280,height:900},ignoreHTTPSErrors:true});
  const p=await ctx.newPage();
  p.on('pageerror',e=>ERR.push('pageerror: '+String(e).slice(0,150)));
  p.on('console',m=>{ if(m.type()==='error') ERR.push('console: '+m.text().slice(0,150)); });
  p.on('response',r=>{ if(r.status()>=400 && /\.(js|css)(\?|$)/.test(r.url())) ERR.push('HTTP '+r.status()+' '+r.url().split('/').pop().slice(0,60)); });

  const PROD='https://dev.avesa.lt/product/exclusion-hypoallergenic-sausas-sunu-maistas-su-arkliena-ir-bulvemis-m-l-12-kg/';
  await p.goto(PROD,{waitUntil:'domcontentloaded',timeout:60000});
  await wait(2500);

  step('1 Skaičiuoklė matoma', await p.locator('#ps-calc').count()>0);
  step('  antraštė', true, await p.locator('.ps-calc-h1').first().textContent().catch(()=>'—'));

  await p.fill('#ps-calc-w','13');
  await p.click('.ps-calc-go');
  await wait(3500);
  const res=await p.locator('.ps-calc-res').first().innerText().catch(()=>null);
  step('2 Rezultatas', !!res, res);
  step('  šaltinis', true, await p.locator('.ps-calc-res .src').first().textContent().catch(()=>'—'));
  step('3 Antrinis blokas', await p.locator('.ps-calc-save-t').count()>0,
       (await p.locator('.ps-calc-save-t').first().textContent().catch(()=>'—'))+' | '+(await p.locator('.ps-calc-save-btn').first().textContent().catch(()=>'—')));
  const psrc=await p.locator('form.cart input[name="ps_source"]').first().getAttribute('value').catch(()=>null);
  step('4 ps_source formoje', psrc==='calc_product', psrc);

  await p.screenshot({path:'/tmp/e2e_1.png'});

  await p.click('.ps-calc-save-btn');
  await wait(4000);
  step('5 Nukreipta', true, p.url().slice(0,95));
  const ho=await p.evaluate(()=>{ try{return localStorage.getItem('petshop_calc_handoff');}catch(e){return 'ERR';} });
  let hj=null; try{ hj=JSON.parse(ho); }catch(e){}
  step('  handoff', !!hj, hj?('pid='+hj.product_id+' kg='+hj.weight_kg+' sku='+hj.product_sku+' return='+String(hj.return_url).slice(0,32)):String(ho).slice(0,60));
  await p.screenshot({path:'/tmp/e2e_2.png'});

  // KATEGORIJA
  await p.goto('https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await wait(2500);
  const hasAsk=await p.locator('form.ps-wask').count()>0;
  step('6 Kategorijos klausimas', hasAsk);
  if(hasAsk){
    await p.fill('.ps-wask-unit input','13');
    await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{}), p.click('.ps-wask-row button')]);
    await wait(3000);
    const bs=await p.locator('.ps-cb').allInnerTexts().catch(()=>[]);
    step('7 €/dieną kortelėse', bs.length>0, bs.length+' vnt.: '+bs.slice(0,2).join(' | '));
    step('  filtro antraštė', true, await p.locator('.ps-wfilter-t').first().textContent().catch(()=>'—'));
    await p.screenshot({path:'/tmp/e2e_3.png'});
  }
 }catch(e){ step('LŪŽO', false, String(e).slice(0,240)); }
 try{ if(br) await br.close(); }catch(e){}

 putB64('e2e.json', Buffer.from(JSON.stringify({LOG,ERR:[...new Set(ERR)].slice(0,20)})).toString('base64'));
 for(const f of ['e2e_1','e2e_2','e2e_3']){
   try{ putB64(f+'.png', fs.readFileSync('/tmp/'+f+'.png').toString('base64')); }catch(e){}
 }
 console.log('done');
})();
