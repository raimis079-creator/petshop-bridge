import { execSync } from 'child_process';
import { chromium } from 'playwright';
import fs from 'fs';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WU=process.env.WP_USER, WP=process.env.WP_APP_PASS, SITE='https://dev.avesa.lt';
function putB64(n,b){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+n;let s='';
 for(let i=0;i<6;i++){try{const j=JSON.parse(execSync('curl -sk -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:80e6}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b,...(s?{sha:s}:{})}));
  const c=execSync('curl -sk -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:80e6}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 3');}return 'fail';}
function sh(c){try{const o=execSync(c+' 2>&1; echo "__RC:$?"',{maxBuffer:50e6,shell:'/bin/bash'}).toString();
 const m=o.match(/__RC:(\d+)\s*$/);return{rc:m?+m[1]:-1,out:o.replace(/__RC:\d+\s*$/,'')};}catch(e){return{rc:-99,out:String(e).slice(0,300)};}}
const AUTH='-u "'+WU+':'+WP+'"', API=SITE+'/wp-json/code-snippets/v1/snippets';
const O={}; let sid=null;
// ★ Senu TEMP snippet'u valymas — kitaip senas atsako i ta pati rakta.
try{
  const ls=sh('curl -sSk '+AUTH+' "'+API+'?per_page=100"');
  const arr=JSON.parse(ls.out); const off=[];
  for(const s0 of arr){ if(s0.name && s0.name.indexOf('TEMP')===0 && s0.active){
    fs.writeFileSync('/tmp/off.json',JSON.stringify({active:false}));
    sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/off.json "'+API+'/'+s0.id+'"');
    off.push(s0.id+':'+s0.name); } }
  O.deaktyvuota_TEMP=off;
}catch(e){ O.valymo_klaida=String(e).slice(0,200); }
const php=Buffer.from('PD9waHAKLyoqCiAqIFVJIExvY2FsaXphdGlvbiBSdW50aW1lIEF1ZGl0IOKAlCBjaGVja291dCBpciBmb3JtdSBidXNlbm9zCiAqLwppZiAoICEgZnVuY3Rpb25fZXhpc3RzKCdwczMzMl90YWlraW5pYWknKSApIHsKICAgIGZ1bmN0aW9uIHBzMzMyX3RhaWtpbmlhaSgpIHsKICAgICAgICByZXR1cm4gYXJyYXkoJ1N1Ym1pdCcsJ01lbnUnLCdOZXh0JywnUHJldmlvdXMnLCdDaGVja291dCcsJ0NoZWNrb3V0IHN0ZXBzJywnVXBkYXRlIGNhcnQnLAogICAgICAgICAgICAnQXBwbHkgY291cG9uJywnQ291cG9uIGNvZGUnLCdQcm9jZWVkIHRvIGNoZWNrb3V0JywnUmV0dXJuIHRvIHNob3AnLCdDb250aW51ZSBzaG9wcGluZycsCiAgICAgICAgICAgICdZb3VyIGNhcnQgaXMgY3VycmVudGx5IGVtcHR5JywnUmVtb3ZlIHRoaXMgaXRlbScsJ1Byb2R1Y3QnLCdQcmljZScsJ1F1YW50aXR5JywnU3VidG90YWwnLAogICAgICAgICAgICAnVG90YWwnLCdTaGlwcGluZycsJ0JpbGxpbmcgZGV0YWlscycsJ0FkZGl0aW9uYWwgaW5mb3JtYXRpb24nLCdQbGFjZSBvcmRlcicsJ09yZGVyIG5vdGVzJywKICAgICAgICAgICAgJ0ZpcnN0IG5hbWUnLCdMYXN0IG5hbWUnLCdQaG9uZScsJ0VtYWlsIGFkZHJlc3MnLCdUb3duIC8gQ2l0eScsJ1Bvc3Rjb2RlJywnUmVxdWlyZWQnLAogICAgICAgICAgICAnVGhpcyBmaWVsZCBpcyByZXF1aXJlZC4nLCdQbGVhc2UgZW50ZXIgYSB2YWxpZCBlbWFpbCBhZGRyZXNzLicsJ3JlcXVpcmVkIGZpZWxkJywKICAgICAgICAgICAgJ1Nob3cgbW9yZScsJ0FkZCB0byBjYXJ0JywnQ2xlYXIgZmlsdGVycycsJ0ZyZWUgc2hpcHBpbmcnLCdDYXJ0IHRvdGFscycsJ0hhdmUgYSBjb3Vwb24nLAogICAgICAgICAgICAnU29ycnknLCdlcnJvcicsJ0xvYWRpbmcnLCdQbGVhc2UgZmlsbCBvdXQgdGhpcyBmaWVsZCcpOwogICAgfQogICAgZnVuY3Rpb24gcHMzMzJfenltKCR0LCRkLCRjLCR2LCRzKXsKICAgICAgICBpZiAoIWluX2FycmF5KCR0LCBwczMzMl90YWlraW5pYWkoKSwgdHJ1ZSkgJiYgc3RycG9zKCR0LCdBZGQgdG8gY2FydCcpPT09ZmFsc2UpIHJldHVybjsKICAgICAgICAkR0xPQkFMU1sncHMzMzInXVtdID0gYXJyYXkoJ3QnPT4kdCwnZCc9PiRkLCdjJz0+JGMsJ3YnPT4kdiwncyc9PiRzKTsKICAgIH0KfQphZGRfZmlsdGVyKCdnZXR0ZXh0JywgZnVuY3Rpb24oJHYsJHQsJGQpeyBwczMzMl96eW0oJHQsJGQsbnVsbCwkdiwnZ2V0dGV4dCcpOyByZXR1cm4gJHY7IH0sIDk5OSwgMyk7CmFkZF9maWx0ZXIoJ2dldHRleHRfd2l0aF9jb250ZXh0JywgZnVuY3Rpb24oJHYsJHQsJGMsJGQpeyBwczMzMl96eW0oJHQsJGQsJGMsJHYsJ2N0eCcpOyByZXR1cm4gJHY7IH0sIDk5OSwgNCk7CmFkZF9maWx0ZXIoJ25nZXR0ZXh0JywgZnVuY3Rpb24oJHYsJHMsJHAsJG4sJGQpeyBwczMzMl96eW0oJHMsJGQsbnVsbCwkdiwnbmdldHRleHQnKTsgcmV0dXJuICR2OyB9LCA5OTksIDUpOwphZGRfYWN0aW9uKCdzaHV0ZG93bicsIGZ1bmN0aW9uKCl7CiAgICBpZiAoZW1wdHkoJEdMT0JBTFNbJ3BzMzMyJ10pKSByZXR1cm47CiAgICAkc2VuYSA9IGdldF9vcHRpb24oJ3BzMzMyX2xvZycsIGFycmF5KCkpOyBpZiAoIWlzX2FycmF5KCRzZW5hKSkgJHNlbmE9YXJyYXkoKTsKICAgIGZvcmVhY2ggKCRHTE9CQUxTWydwczMzMiddIGFzICRlKSB7CiAgICAgICAgJGs9JGVbJ3QnXS4nfHwnLiRlWydkJ10uJ3x8Jy4oc3RyaW5nKSRlWydjJ107CiAgICAgICAgaWYgKCFpc3NldCgkc2VuYVska10pKSB7ICRzZW5hWyRrXT0kZTsgJHNlbmFbJGtdWydraWVrJ109MDsgfQogICAgICAgICRzZW5hWyRrXVsna2llayddKys7CiAgICB9CiAgICB1cGRhdGVfb3B0aW9uKCdwczMzMl9sb2cnLCAkc2VuYSwgZmFsc2UpOwp9LCA5OTkpOwoKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfZmwyJ10pICkgcmV0dXJuOwogICAgJHYgPSAkX0dFVFsncHNfZmwyJ107CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsKICAgIGlmICgkdiA9PT0gJ3Jlc2V0JykgeyBkZWxldGVfb3B0aW9uKCdwczMzMl9sb2cnKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgnb2snPT4xKSk7IGV4aXQ7IH0KICAgIGlmICgkdiA9PT0gJ2luZm8nKSB7CiAgICAgICAgLy8gcHJla2UgdGVzdHVpOiBwdWJsaXNoLCBpbiBzdG9jaywgcHVyY2hhc2FibGUsIGJlIHZhcmlhY2lqxbMKICAgICAgICAkaWRzID0gJHdwZGItPmdldF9jb2woIlNFTEVDVCBJRCBGUk9NICR3cGRiLT5wb3N0cyBXSEVSRSBwb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwb3N0X3N0YXR1cz0ncHVibGlzaCcgT1JERVIgQlkgSUQgREVTQyBMSU1JVCA2MCIpOwogICAgICAgICRyID0gYXJyYXkoKTsKICAgICAgICBmb3JlYWNoICgkaWRzIGFzICRpZCkgewogICAgICAgICAgICAkcCA9IHdjX2dldF9wcm9kdWN0KCRpZCk7CiAgICAgICAgICAgIGlmICgkcCAmJiAkcC0+aXNfcHVyY2hhc2FibGUoKSAmJiAkcC0+aXNfaW5fc3RvY2soKSAmJiAhJHAtPmlzX3R5cGUoJ3ZhcmlhYmxlJykgJiYgJHAtPmdldF9wcmljZSgpID4gMCkgewogICAgICAgICAgICAgICAgJHJbJ3ByZWtlJ10gPSBhcnJheSgnaWQnPT4kaWQsJ3ZhcmRhcyc9PiRwLT5nZXRfbmFtZSgpLCdrYWluYSc9PiRwLT5nZXRfcHJpY2UoKSk7CiAgICAgICAgICAgICAgICBicmVhazsKICAgICAgICAgICAgfQogICAgICAgIH0KICAgICAgICAkclsnY2FydCddID0gd2NfZ2V0X2NhcnRfdXJsKCk7CiAgICAgICAgJHJbJ2NoZWNrb3V0J10gPSB3Y19nZXRfY2hlY2tvdXRfdXJsKCk7CiAgICAgICAgZWNobyB3cF9qc29uX2VuY29kZSgkciwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKICAgIH0KICAgIGlmICgkdiA9PT0gJ3JlYWQnKSB7CiAgICAgICAgJGxvZyA9IGdldF9vcHRpb24oJ3BzMzMyX2xvZycsIGFycmF5KCkpOwogICAgICAgICRyID0gYXJyYXkoJ2lyYXN1Jz0+Y291bnQoJGxvZykpOwogICAgICAgIGZvcmVhY2ggKCRsb2cgYXMgJGUpIHsKICAgICAgICAgICAgaWYgKCRlWyd2J10gPT09ICRlWyd0J10pIHsgICAvLyBUSUsgTkVJxaBWRVJTVEkKICAgICAgICAgICAgICAgICRyWyduZWlzdmVyc3RpJ11bXSA9IGFycmF5KCd0ZWtzdGFzJz0+JGVbJ3QnXSwnZG9tYWluJz0+JGVbJ2QnXSwKICAgICAgICAgICAgICAgICAgICAnY29udGV4dCc9PiRlWydjJ10sJ3NhbHRpbmlzJz0+JGVbJ3MnXSwna2llayc9PiRlWydraWVrJ10pOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICRyWydpc3ZlcnN0dSddID0gY291bnQoJGxvZykgLSBjb3VudCgkclsnbmVpc3ZlcnN0aSddID8/IGFycmF5KCkpOwogICAgICAgIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4xKSk7IGV4aXQ7Cn0pOwo=','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'UI Localization Runtime Audit',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('flowaudit.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_fl2=read"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
const ii=sh('curl -sSk -m 30 "'+SITE+'/?ps_fl2=info"');
try{ O.info=JSON.parse(ii.out); }catch(e){ O.info_raw=ii.out.slice(0,400); }
sh('curl -sSk -m 30 -o /dev/null "'+SITE+'/?ps_fl2=reset"');
sh('sleep 2');

const ANG = ['Submit','Menu','Next','Previous','Checkout steps','Update cart','Apply coupon',
  'Coupon code','Proceed to checkout','Return to shop','Continue shopping','Remove this item',
  'Quantity','Subtotal','Billing details','Place order','Order notes','First name','Last name',
  'Town / City','Postcode','This field is required','Please enter a valid email','required field',
  'Show more','Add to cart:','Cart totals','Have a coupon','Free shipping','Loading',
  'Please fill out this field','Your cart is currently empty'];
function sken(h){ const o={}; for(const a of ANG){ const n=(h.split(a).length-1); if(n>0) o[a]=n; } return o; }

try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1100}, ignoreHTTPSErrors:true, locale:'lt-LT'});
  const page = await ctx.newPage();
  const errs=[]; page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,140)); });

  // 1) PREKE I KREPSELI
  const pid = O.info && O.info.preke ? O.info.preke.id : null;
  O.preke = O.info && O.info.preke ? O.info.preke : 'NERASTA';
  if (pid) {
    await page.goto(SITE+'/?add-to-cart='+pid, {waitUntil:'domcontentloaded', timeout:60000});
    await page.waitForTimeout(2500);
  }
  // 2) KREPSELIS
  await page.goto(O.info.cart, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2500);
  const hCart = await page.content();
  O.krepselis = { url: page.url(), tuscias: hCart.indexOf('krepšelis tuščias')>=0 || hCart.indexOf('currently empty')>=0,
                  anglu: sken(hCart) };
  fs.writeFileSync('/tmp/C1.png', await page.screenshot({fullPage:true}));

  // 3) CHECKOUT
  await page.goto(O.info.checkout, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(3500);
  const hCo = await page.content();
  O.checkout = { url: page.url(), anglu: sken(hCo),
                 laukai: await page.locator('input, select, textarea').count() };
  fs.writeFileSync('/tmp/C2.png', await page.screenshot({fullPage:true}));

  // 4) KONTAKTU FORMA — tuscias privalomas laukas
  await page.goto(SITE+'/kontaktai/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2500);
  const btn = page.locator('button[type=submit], input[type=submit]').first();
  O.mygtuko_tekstas = (await btn.textContent().catch(()=>'')) || (await btn.getAttribute('value').catch(()=>''));
  await btn.click({timeout:15000}).catch(e=>{ O.klik1_err=String(e).slice(0,150); });
  await page.waitForTimeout(2500);
  const hE1 = await page.content();
  O.tuscia_forma = { anglu: sken(hE1),
    klaidos: await page.locator('.wpforms-error, em.wpforms-error, label.wpforms-error').allTextContents() };
  fs.writeFileSync('/tmp/C3.png', await page.screenshot({fullPage:true}));

  // 5) BLOGAS EL. PASTAS
  const em = page.locator('input[type=email]').first();
  await em.fill('blogas-pastas').catch(e=>{ O.fill_err=String(e).slice(0,120); });
  await page.locator('input[type=text]').first().fill('E2E Testas').catch(()=>{});
  await page.locator('textarea').first().fill('TESTAS — lokalizacijos auditas, prašome ignoruoti.').catch(()=>{});
  await btn.click({timeout:15000}).catch(()=>{});
  await page.waitForTimeout(2500);
  const hE2 = await page.content();
  O.blogas_pastas = { anglu: sken(hE2),
    klaidos: await page.locator('.wpforms-error, em.wpforms-error, label.wpforms-error').allTextContents() };
  fs.writeFileSync('/tmp/C4.png', await page.screenshot({fullPage:true}));

  O.js_klaidos = errs.slice(0,8);
  await browser.close();
  for (const n of ['C1','C2','C3','C4']) {
    try{ putB64('flow_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){}
  }
}catch(err){ O.BROWSER_ERR = String(err && err.stack ? err.stack : err).slice(0,700); }

sh('sleep 2');
O.rez=uzk(1);
sh('sleep 4');
function code(u){ return sh('curl -sSkI -m 30 -o /dev/null -w "%{http_code}|%{redirect_url}" "'+u+'"').out.trim(); }
O.t_naujas       = code(SITE+'/paskyra/');
O.t_atsijungti   = code(SITE+'/paskyra/atsijungti/');
O.t_senas_logout = code(SITE+'/my-account/customer-logout/');
O.t_adresai      = code(SITE+'/paskyra/adresai/');
O.t_slaptazodis  = code(SITE+'/paskyra/pamirstas-slaptazodis/');
O.t_augintinis   = code(SITE+'/paskyra/augintinis/');
O.t_uzsakymai    = code(SITE+'/paskyra/uzsakymai/');
O.t_senas        = code(SITE+'/my-account/');
O.t_senas_uzsak  = code(SITE+'/my-account/orders/');
O.t_senas_augint = code(SITE+'/my-account/augintinis/');
O.t_landing      = code(SITE+'/augintinio-profilis/');
O.t_home         = code(SITE+'/');
O.t_shop         = code(SITE+'/parduotuve/');

fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('flowaudit.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
