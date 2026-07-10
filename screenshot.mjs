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
function fetchTxt(u){
  try{ return execSync('curl -sk -L --max-time 30 -A "Mozilla/5.0" "'+u+'"',{encoding:'utf8',maxBuffer:10000000}); }
  catch(e){ return 'ERR: '+(e.message||'').slice(0,80); }
}

L('############ PAYSERA MOKEJIMO BUDAI ############'); L('');

L('=== 1. Paysera vieša mokėjimo būdų API (project 29276) ===');
const urls = [
  'https://www.paysera.com/new/api/items?project=29276&currency=EUR&lang=LIT&amount=1000',
  'https://bank.paysera.com/new/api/items?project=29276&currency=EUR&lang=LIT&amount=1000',
  'https://www.paysera.com/new/api/items?project_id=29276&currency=EUR&lang=lt',
];
for(const u of urls){
  const r = fetchTxt(u);
  L('  '+u.slice(0,70)+'...');
  L('    atsakymas: '+r.length+' B  ->  '+r.slice(0,120).replace(/\s+/g,' '));
  if(r.length>200 && !r.startsWith('ERR')){
    const groups = [...new Set((r.match(/<group[^>]*key="([^"]+)"/g)||[]).map(x=>x.match(/key="([^"]+)"/)[1]))];
    const keys   = [...new Set((r.match(/<payment[^>]*key="([^"]+)"/g)||[]).map(x=>x.match(/key="([^"]+)"/)[1]))];
    if(groups.length) L('    grupes: '+groups.join(', '));
    if(keys.length){ L('    mokejimo budai ('+keys.length+'): '+keys.slice(0,25).join(', ')); }
    const cards = keys.filter(k=>/card|visa|master|hanza|maestro/i.test(k));
    L('    KORTELES: '+(cards.length? '✅ '+cards.join(', ') : '❌ nerasta'));
  }
  L('');
}

L('=== 2. Checkout: ar rodomas mokėjimo būdų sąrašas ===');
const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1000}, locale:'lt-LT'});
const page=await ctx.newPage();
try{
  await page.goto('https://dev.avesa.lt/?p=15484',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  try{ await page.click('.cmplz-accept',{timeout:8000}); }catch(e){}
  await page.waitForTimeout(2000);
  await page.click('button.single_add_to_cart_button',{timeout:12000});
  await page.waitForTimeout(6000);
  await page.goto('https://dev.avesa.lt/checkout/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(8000);

  const pay = await page.evaluate(()=>{
    const radios=[...document.querySelectorAll('input[name="payment_method"]')].map(i=>({val:i.value,checked:i.checked}));
    const psBox = document.querySelector('.payment_method_paysera, li.payment_method_paysera');
    let inner=null;
    if(psBox){
      const subs=[...psBox.querySelectorAll('input[type=radio], .paysera-payment-method, .paysera-item, img')].slice(0,40);
      inner = {
        html_len: psBox.innerHTML.length,
        sub_radios: [...psBox.querySelectorAll('input[type=radio]')].map(i=>({name:i.name,val:i.value})).slice(0,20),
        images: [...psBox.querySelectorAll('img')].map(i=>({alt:i.alt, src:(i.src||'').split('/').pop()})).slice(0,20),
        text: (psBox.innerText||'').slice(0,300)
      };
    }
    return { radios, paysera_block: inner };
  });
  L('  Mokejimo budu radio: '+JSON.stringify(pay.radios));
  L('');
  if(!pay.paysera_block){ L('  ❌ Paysera bloko nerasta DOM\'e'); }
  else{
    L('  Paysera blokas:');
    L('    HTML ilgis: '+pay.paysera_block.html_len);
    L('    vidiniai radio ('+pay.paysera_block.sub_radios.length+'): '+JSON.stringify(pay.paysera_block.sub_radios).slice(0,300));
    L('    paveiksleliai ('+pay.paysera_block.images.length+'):');
    pay.paysera_block.images.forEach(i=>L('      "'+i.alt+'"  '+i.src));
    L('    tekstas: '+JSON.stringify(pay.paysera_block.text.slice(0,200)));
    L('');
    const hasList = pay.paysera_block.sub_radios.length>0 || pay.paysera_block.images.length>1;
    L('  >>> Mokejimo budu sarasas checkout\'e: '+(hasList?'✅ RODOMAS':'❌ NERODOMAS (tik logo)'));
  }
  await page.screenshot({path:'/tmp/checkout_pay.png', fullPage:false});

  L('');
  L('=== 3. Paysera pasirinkimas + redirect testas ===');
  await page.check('#payment_method_paysera',{timeout:8000}).catch(e=>L('  radio klaida: '+e.message.slice(0,50)));
  await page.waitForTimeout(3000);
  const after = await page.evaluate(()=>{
    const b=document.querySelector('.payment_method_paysera');
    return b?{radios:[...b.querySelectorAll('input[type=radio]')].length, imgs:[...b.querySelectorAll('img')].length}:null;
  });
  L('  po pasirinkimo: '+JSON.stringify(after));
  await page.screenshot({path:'/tmp/checkout_pay2.png', fullPage:false});
}catch(e){ L('  ❌ '+e.message.slice(0,120)); }
await browser.close();
putFile('paysera_methods.txt', out);
try{ putFile('paysera_checkout.png','/tmp/checkout_pay.png',true); }catch(e){}
try{ putFile('paysera_checkout2.png','/tmp/checkout_pay2.png',true); }catch(e){}
console.log(out);
