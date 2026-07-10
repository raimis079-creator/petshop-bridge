import { chromium } from 'playwright';
import { execSync } from "child_process";
import fs from "fs";
function putFile(n,s){
  const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
  for(let a=0;a<4;a++){ try{
    const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+n;
    let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){}
    const b={message:'ci',branch:'main',content:Buffer.from(s,'utf8').toString('base64')}; if(sha) b.sha=sha;
    fs.writeFileSync('/tmp/pf.json',JSON.stringify(b));
    const r=execSync('curl -s -w "\nHTTP:%{http_code}" -X PUT -H "Authorization: Bearer '+tok+'" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'});
    if(/HTTP:20[01]/.test(r)) return true;
  }catch(e){} execSync('sleep 2'); }
  return false;
}
let out=''; const L=(s)=>{out+=s+'\n';};
const U=process.env.WP_USER||''; const P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH=U+':'+P;

L('############ PAYSERA REDIRECT PARAMETRU PATIKRA ############');
L('SVARBU: mokejimas NEVYKDOMAS. Perimame redirect ir ji blokuojame.'); L('');

const browser=await chromium.launch({args:['--no-sandbox','--ignore-certificate-errors']});
const ctx=await browser.newContext({ignoreHTTPSErrors:true, viewport:{width:1440,height:1000}, locale:'lt-LT'});
const page=await ctx.newPage();

let payseraUrl=null, payseraPost=null;
// BLOKUOJAM bet koki isejima i paysera
await ctx.route('**://*.paysera.com/**', async route=>{
  const req=route.request();
  payseraUrl = req.url();
  if(req.method()==='POST'){ payseraPost = req.postData(); }
  L('  🛑 UZBLOKUOTA uzklausa i Paysera: '+req.method()+' '+req.url().slice(0,90));
  await route.abort();
});

let orderId=null;
try{
  await page.goto('https://dev.avesa.lt/?p=15484',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(5000);
  try{ await page.click('.cmplz-accept',{timeout:8000}); }catch(e){}
  await page.click('button.single_add_to_cart_button',{timeout:12000});
  await page.waitForTimeout(6000);
  await page.goto('https://dev.avesa.lt/checkout/',{waitUntil:'domcontentloaded',timeout:60000});
  await page.waitForTimeout(7000);

  const f=async(s,v)=>{ try{ await page.fill(s,v,{timeout:6000}); }catch(e){} };
  await f('#billing_first_name','Paysera'); await f('#billing_last_name','Testas');
  await f('#billing_address_1','Testo g. 1'); await f('#billing_city','Vilnius');
  await f('#billing_postcode','01001'); await f('#billing_phone','+37060000000');
  await f('#billing_email','paysera.test.'+Date.now()+'@petshop.lt');
  try{ await page.selectOption('#billing_country','LT',{timeout:5000}); }catch(e){}
  await page.waitForTimeout(4000);
  await page.check('#payment_method_paysera',{timeout:8000});
  await page.waitForTimeout(3000);
  // pasirenkam banka (hanza = Swedbank)
  try{ await page.check('input[name="payment[pay_type]"][value="hanza"]',{timeout:6000}); L('  pasirinktas bankas: hanza (Swedbank)'); }
  catch(e){ L('  bankas nepasirinktas: '+e.message.slice(0,50)); }
  await page.waitForTimeout(2000);

  L('');
  L('=== Pateikiam uzsakyma (redirect bus uzblokuotas) ===');
  await page.click('#place_order',{timeout:12000});
  await page.waitForTimeout(14000);
  L('  URL po submit: '+page.url().slice(0,110));

  const m = page.url().match(/order-pay\/(\d+)/) || page.url().match(/order-received\/(\d+)/);
  if(m) orderId = m[1];

}catch(e){ L('  klaida: '+e.message.slice(0,120)); }

L('');
L('=== Perimta Paysera uzklausa ===');
if(!payseraUrl){ L('  ❌ nepavyko perimti (gal redirect vyko per form POST)'); }
else{
  L('  URL: '+payseraUrl.slice(0,140));
  // dekoduojam data parametra
  let dataParam=null;
  try{
    const u = new URL(payseraUrl);
    dataParam = u.searchParams.get('data');
  }catch(e){}
  if(!dataParam && payseraPost){
    const pm = payseraPost.match(/data=([^&]+)/);
    if(pm) dataParam = decodeURIComponent(pm[1]);
  }
  if(dataParam){
    L('');
    L('  data parametras (base64, '+dataParam.length+' simb.)');
    try{
      const b64 = dataParam.replace(/-/g,'+').replace(/_/g,'/');
      const decoded = Buffer.from(b64,'base64').toString('utf8');
      L('  Dekoduota:');
      const params = new URLSearchParams(decoded);
      const important = ['projectid','orderid','amount','currency','test','accepturl','cancelurl','callbackurl','payment','country','p_email','lang','version'];
      for(const k of important){
        const v = params.get(k);
        if(v!==null) L('    '+k.padEnd(14)+' = '+v);
      }
      L('');
      L('  KRITINES PATIKROS:');
      L('    '+(params.get('projectid')==='29276'?'✅':'❌')+' projectid = 29276');
      L('    '+(params.get('test')==='1'?'✅ TESTINIS REZIMAS':'❌ TEST=' + params.get('test') + ' — REALUS MOKEJIMAS!'));
      const cb = params.get('callbackurl')||'';
      L('    callbackurl: '+cb);
      L('    '+(/dev\.avesa\.lt/.test(cb)?'⚠️ rodo i dev.avesa.lt — po migracijos generuosis is home_url()':'?'));
      L('    accepturl:  '+(params.get('accepturl')||'').slice(0,80));
      L('    cancelurl:  '+(params.get('cancelurl')||'').slice(0,80));
      L('    payment:    '+(params.get('payment')||'(nenurodyta — vartotojas rinksis Paysera puslapyje)'));
    }catch(e){ L('  dekodavimo klaida: '+e.message); }
  } else L('  data parametras nerastas');
}

await browser.close();

L('');
L('=== Sukurto uzsakymo valymas ===');
try{
  const r=execSync('curl -sk -u "'+AUTH+'" "https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=3&status=any&orderby=id&order=desc"',{encoding:'utf8'});
  const arr=JSON.parse(r);
  L('  rasti uzsakymai: '+arr.length);
  for(const o of arr){
    L('    #'+o.number+'  '+o.status+'  '+o.total+'  '+o.payment_method+'  '+o.billing.email);
    if(/paysera\.test/.test(o.billing.email||'')){
      const d=execSync('curl -sk -o /dev/null -w "%{http_code}" -u "'+AUTH+'" -X DELETE "https://dev.avesa.lt/wp-json/wc/v3/orders/'+o.id+'?force=true"',{encoding:'utf8'}).trim();
      L('      -> istrinta, HTTP '+d);
    }
  }
  const after=execSync('curl -sk -I -u "'+AUTH+'" "https://dev.avesa.lt/wp-json/wc/v3/orders?per_page=1&status=any" 2>/dev/null | tr -d "\r"',{encoding:'utf8'});
  const tot=(after.match(/x-wp-total:\s*(\d+)/i)||[])[1];
  L('  uzsakymu liko: '+(tot||'?'));
}catch(e){ L('  valymo klaida: '+e.message.slice(0,80)); }
putFile('paysera_redirect.txt', out); console.log(out);
