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
const php=Buffer.from('PD9waHAKLyoqCiAqIFMzMjkgQXV0aCBDb29raWUKICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgICBpZiAoICEgaXNzZXQoJF9HRVRbJ3BzX2F1NyddKSB8fCAkX0dFVFsncHNfYXU3J10gIT09ICdBdTd0MycgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgICRyID0gYXJyYXkoJ1ZFUlNJSkEnPT4nYXV0aC12MicpOwogICAgJHUgPSBnZXRfdXNlcl9ieSgnbG9naW4nLCdwc19zMzI5X3Rlc3QnKTsKICAgIGlmICghJHUpIHsKICAgICAgICAkaWQgPSB3cF9pbnNlcnRfdXNlcihhcnJheSgndXNlcl9sb2dpbic9Pidwc19zMzI5X3Rlc3QnLCd1c2VyX2VtYWlsJz0+J3BzX3MzMjlAZGV2LmF2ZXNhLmx0JywKICAgICAgICAgICAgJ3VzZXJfcGFzcyc9PndwX2dlbmVyYXRlX3Bhc3N3b3JkKDI0KSwncm9sZSc9PidjdXN0b21lcicsJ2ZpcnN0X25hbWUnPT4nVGVzdGFzJykpOwogICAgICAgICR1ID0gaXNfd3BfZXJyb3IoJGlkKSA/IG51bGwgOiBnZXRfdXNlcl9ieSgnaWQnLCRpZCk7CiAgICB9CiAgICBpZiAoISR1KSB7IGVjaG8gd3BfanNvbl9lbmNvZGUoYXJyYXkoJ2Vycic9PiduZXBhdnlrbycpKTsgZXhpdDsgfQogICAgJGV4cCA9IHRpbWUoKSs2MDA7CiAgICAkclsndXNlcl9pZCddID0gKGludCkkdS0+SUQ7CiAgICAkclsnY29va2llX25hbWUnXSAgPSBMT0dHRURfSU5fQ09PS0lFOwogICAgJHJbJ2Nvb2tpZV92YWx1ZSddID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHUtPklELCAkZXhwLCAnbG9nZ2VkX2luJyk7CiAgICAkclsnYXV0aF9uYW1lJ10gICAgPSBpc19zc2woKSA/IFNFQ1VSRV9BVVRIX0NPT0tJRSA6IEFVVEhfQ09PS0lFOwogICAgJHJbJ2F1dGhfdmFsdWUnXSAgID0gd3BfZ2VuZXJhdGVfYXV0aF9jb29raWUoJHUtPklELCAkZXhwLCBpc19zc2woKT8nc2VjdXJlX2F1dGgnOidhdXRoJyk7CiAgICAkclsnZG9tYWluJ10gICAgICAgPSBwYXJzZV91cmwoaG9tZV91cmwoKSwgUEhQX1VSTF9IT1NUKTsKICAgICRyWyd1cmxfcGFza3lyYSddICA9IHdjX2dldF9wYWdlX3Blcm1hbGluaygnbXlhY2NvdW50Jyk7CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'S329 Auth Cookie',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('accountcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
function uzk(n){
  const x=sh('curl -sSk -m 60 "'+SITE+'/?ps_au7=Au7t3"');
  try{ return JSON.parse(x.out); }catch(e){ O['raw'+n]=x.out.slice(0,700); return null; }
}
O.rez=uzk(1);
const A=O.rez;
if(A && A.cookie_value){
 try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1000}, ignoreHTTPSErrors:true});
  await ctx.addCookies([
    {name:A.cookie_name, value:A.cookie_value, domain:A.domain, path:'/', httpOnly:true, secure:true},
    {name:A.auth_name,   value:A.auth_value,   domain:A.domain, path:'/', httpOnly:true, secure:true},
  ]);
  const page = await ctx.newPage();
  const errs=[], bad=[];
  page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,140)); });
  page.on('response', r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url().slice(0,110)); });
  await page.goto(SITE+'/paskyra/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2500);
  O.p_url = page.url();
  O.p_body404 = (await page.locator('body').evaluate(b=>b.className)).indexOf('error404')>=0;
  O.meniu = await page.locator('.woocommerce-MyAccount-navigation a').allTextContents();
  O.meniu_href = await page.locator('.woocommerce-MyAccount-navigation a').evaluateAll(a=>a.map(x=>x.getAttribute('href')));
  fs.writeFileSync('/tmp/A1.png', await page.screenshot({fullPage:true}));
  // uzsakymu endpointas
  await page.goto(SITE+'/paskyra/uzsakymai/', {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2000);
  O.u_url = page.url();
  O.u_404 = (await page.locator('body').evaluate(b=>b.className)).indexOf('error404')>=0;
  // ATSIJUNGIMAS — nonce patikra
  const lo = O.meniu_href.filter(h=>h && h.indexOf('atsijungti')>=0);
  O.logout_href = lo;
  O.logout_turi_nonce = lo.length ? (lo[0].indexOf('_wpnonce')>=0) : null;
  O.js_klaidos = errs.slice(0,6); O.http_klaidos = bad.slice(0,6);
  await browser.close();
  try{ putB64('acc_lt.png', fs.readFileSync('/tmp/A1.png').toString('base64')); }catch(e){}
 }catch(err){ O.BROWSER_ERR = String(err).slice(0,400); }
}
fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('accountcheck.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
