import { chromium } from 'playwright';
import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s,bin){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const content = bin ? fs.readFileSync(s).toString('base64') : Buffer.from(s,'utf8').toString('base64');
    const b={message:'ci',branch:'main',content}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1200}, locale:'lt-LT'});
const page=await ctx.newPage();

async function scan(label){
  await page.waitForTimeout(4000);
  const r = await page.evaluate(()=>{
    const box=document.querySelector('.payment_method_paysera');
    if(!box) return null;
    const items=[...box.querySelectorAll('input[name="payment[pay_type]"]')].map(i=>{
      const lbl=i.closest('label')||box.querySelector('label[for="'+i.id+'"]');
      const img=lbl?lbl.querySelector('img'):null;
      let vis=true,e=i; while(e&&e!==document.body){ if(getComputedStyle(e).display==='none'){vis=false;break;} e=e.parentElement; }
      return { val:i.value, alt:img?img.alt:'', visible:vis };
    });
    // saliu antrastes
    const countries=[...box.querySelectorAll('.paysera-country, h3, h4, .country-title, optgroup')].map(x=>x.innerText?x.innerText.trim():'').filter(Boolean);
    const visCountries=[...box.querySelectorAll('*')].filter(e=>{
      const t=(e.childNodes.length===1&&e.childNodes[0].nodeType===3)?e.innerText.trim():'';
      return /^(LIETUVA|ALBANIJA|AUSTRIJA|LATVIJA|ESTIJA|LENKIJA)$/i.test(t) && getComputedStyle(e).display!=='none';
    }).map(e=>e.innerText.trim());
    return { total:items.length, visible:items.filter(i=>i.visible).length, items, countries:[...new Set(countries)].slice(0,30), visCountries:[...new Set(visCountries)] };
  });
  L('');
  L('  === '+label+' ===');
  if(!r){ L('    Paysera bloko nera'); return null; }
  L('    pay_type is viso: '+r.total+'   matomu: '+r.visible);
  const vis = r.items.filter(i=>i.visible);
  const lt = vis.filter(i=>/^lt_|^hanza|^swedbank|^seb|^luminor|^siauliu|^medbank|^citadele|^wallet$/i.test(i.val));
  const cards = r.items.filter(i=>/card|visa|master|maestro|hanzaee/i.test(i.val+i.alt));
  L('');
  L('    LT bankai (matomi): '+(lt.length?lt.map(i=>i.val).join(', '):'—'));
  L('');
  L('    KORTELES (visame sarase): '+(cards.length? cards.map(i=>i.val+' ("'+i.alt+'")').join(', ') : '❌ NERASTA'));
  if(cards.length){
    const cardsVis = cards.filter(c=>c.visible);
    L('    KORTELES matomos: '+(cardsVis.length? '✅ '+cardsVis.map(c=>c.val).join(', ') : '❌ yra sarase bet paslėptos'));
  }
  L('');
  L('    Matomos saliu antrastes: '+JSON.stringify(r.visCountries));
  L('    Pirmi 12 matomu: '+vis.slice(0,12).map(i=>i.val).join(', '));
  return r;
}

try{
  L('############ PAYSERA: SALIU FILTRAS + KORTELES ############');
  await page.goto('https://dev.avesa.lt/?p=15484',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  try{ await page.click('.cmplz-accept',{timeout:8000}); }catch(e){}
  await page.click('button.single_add_to_cart_button',{timeout:12000});
  await page.waitForTimeout(6000);
  await page.goto('https://dev.avesa.lt/checkout/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(8000);

  await scan('PRIES billing_country nustatyma');

  L('');
  L('  --- Nustatom billing_country = LT ---');
  await page.selectOption('#billing_country','LT',{timeout:8000}).catch(e=>L('    klaida: '+e.message.slice(0,50)));
  await page.fill('#billing_city','Vilnius').catch(()=>{});
  await page.fill('#billing_postcode','01001').catch(()=>{});
  // priverstinis WC update_checkout
  await page.evaluate(()=>{ if(window.jQuery) jQuery(document.body).trigger('update_checkout'); });
  await page.waitForTimeout(8000);
  await scan('PO billing_country = LT');

  await page.screenshot({path:'/tmp/ps_lt.png', fullPage:false});
}catch(e){ L('!!! '+e.message.slice(0,140)); }
await browser.close();
putFile('paysera_countries.txt', out);
try{ putFile('paysera_lt.png','/tmp/ps_lt.png',true); }catch(e){}
console.log(out);
