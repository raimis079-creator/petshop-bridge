import { execSync } from 'child_process';
import fs from 'fs';
import puppeteer from 'puppeteer';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}

const LOG=[]; const ERR=[];
const step=(n,ok,d)=>{ LOG.push({n,ok,d:String(d===undefined?'':d).slice(0,220)}); };

(async()=>{
  const b=await puppeteer.launch({headless:'new',args:['--no-sandbox','--disable-setuid-sandbox','--ignore-certificate-errors']});
  const p=await b.newPage();
  await p.setViewport({width:1280,height:900});
  // gaudom JS klaidas ir 404
  p.on('pageerror',e=>ERR.push('pageerror: '+String(e).slice(0,160)));
  p.on('console',m=>{ if(m.type()==='error') ERR.push('console: '+m.text().slice(0,160)); });
  p.on('response',r=>{ if(r.status()>=400 && /\.(js|css)(\?|$)/.test(r.url())) ERR.push('HTTP '+r.status()+': '+r.url().split('/').pop().slice(0,70)); });

  const PROD='https://dev.avesa.lt/product/exclusion-hypoallergenic-sausas-sunu-maistas-su-arkliena-ir-bulvemis-m-l-12-kg/';
  try{
    // 1. PREKĖS PUSLAPIS
    await p.goto(PROD,{waitUntil:'domcontentloaded',timeout:60000});
    await new Promise(r=>setTimeout(r,2500));
    const calc=await p.$('#ps-calc');
    step('1. Skaičiuoklė matoma', !!calc);
    const h1=await p.$eval('.ps-calc-h1',e=>e.textContent).catch(()=>null);
    step('   antraštė', !!h1, h1);

    // 2. ĮVEDAM SVORĮ IR SKAIČIUOJAM
    await p.type('#ps-calc-w','13');
    await p.click('.ps-calc-go');
    await new Promise(r=>setTimeout(r,3500));
    const res=await p.$eval('.ps-calc-res',e=>e.innerText.replace(/\s+/g,' ')).catch(()=>null);
    step('2. Rezultatas gautas', !!res, res);
    const src=await p.$eval('.ps-calc-res .src',e=>e.textContent).catch(()=>null);
    step('   normos šaltinis', !!src, src);

    // 3. ANTRINIS BLOKAS
    const saveT=await p.$eval('.ps-calc-save-t',e=>e.textContent).catch(()=>null);
    const saveB=await p.$eval('.ps-calc-save-btn',e=>e.textContent).catch(()=>null);
    step('3. Antrinis blokas', !!saveT, saveT+' | CTA: '+saveB);

    // 4. ps_source įdėtas į formą?
    const psrc=await p.$eval('form.cart input[name="ps_source"]',e=>e.value).catch(()=>null);
    step('4. ps_source formoje', psrc==='calc_product', psrc);

    // 5. SPAUDŽIAM CTA → handoff
    const before=await p.evaluate(()=>{ try{return localStorage.getItem('petshop_calc_handoff');}catch(e){return 'ERR';} });
    step('5. handoff prieš', before===null||before===undefined, before);
    await p.click('.ps-calc-save-btn');
    await new Promise(r=>setTimeout(r,3500));
    const url1=p.url();
    step('6. Nukreipta', true, url1.slice(0,90));
    const ho=await p.evaluate(()=>{ try{return localStorage.getItem('petshop_calc_handoff');}catch(e){return 'ERR';} });
    let hoj=null; try{ hoj=JSON.parse(ho); }catch(e){}
    step('   handoff įrašytas', !!hoj, hoj?('pid='+hoj.product_id+' kg='+hoj.weight_kg+' return='+String(hoj.return_url).slice(0,40)):ho);

    await p.screenshot({path:'/tmp/e2e_1.png',fullPage:false});

    // 7. KATEGORIJOS SKAIČIUOKLĖ
    await p.goto('https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
    await new Promise(r=>setTimeout(r,2500));
    const ask=await p.$('form.ps-wask');
    step('7. Kategorijos klausimas', !!ask);
    if(ask){
      await p.type('.ps-wask-unit input','13');
      await Promise.all([p.waitForNavigation({waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{}), p.click('.ps-wask-row button')]);
      await new Promise(r=>setTimeout(r,3000));
      const badges=await p.$$eval('.ps-cb',els=>els.slice(0,3).map(e=>e.innerText.replace(/\s+/g,' ')));
      step('8. Kortelių €/dieną', badges.length>0, badges.join(' | '));
      const notice=await p.$eval('.ps-wfilter-t',e=>e.textContent).catch(()=>null);
      step('   filtro antraštė', !!notice, notice);
    }
    await p.screenshot({path:'/tmp/e2e_2.png',fullPage:false});
  }catch(e){ step('KLAIDA', false, String(e).slice(0,240)); }
  await b.close();

  const out={LOG,ERR:[...new Set(ERR)].slice(0,20)};
  putB64('e2e.json', Buffer.from(JSON.stringify(out)).toString('base64'));
  for(const f of ['e2e_1','e2e_2']){
    try{ putB64(f+'.png', fs.readFileSync('/tmp/'+f+'.png').toString('base64')); }catch(e){}
  }
  console.log('done');
})();
