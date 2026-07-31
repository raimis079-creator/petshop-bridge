import { execSync } from 'child_process';
import fs from 'fs';
import { chromium } from 'playwright';
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
const php=Buffer.from('PD9waHAKLyoqCiAqIFRFTVAgTTggQXV0aCB2MQogKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICAgIGlmICggISBpc3NldCgkX0dFVFsncHNfYXUnXSkgfHwgJF9HRVRbJ3BzX2F1J10gIT09ICdBdTZtOCcgKSByZXR1cm47CiAgICBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGdsb2JhbCAkd3BkYjsgJHIgPSBhcnJheSgpOwoKICAgIC8vIFRlc3RpbmlzIHZhcnRvdG9qYXMgQkUgYXVnaW50aW5pdSDigJQgdHVzY2lvcyBidXNlbm9zIHRlc3R1aQogICAgJGxvZ2luID0gJ3BzX204X2UyZSc7CiAgICAkdSA9IGdldF91c2VyX2J5KCdsb2dpbicsICRsb2dpbik7CiAgICBpZiAoISR1KSB7CiAgICAgICAgJHVpZCA9IHdwX2luc2VydF91c2VyKGFycmF5KAogICAgICAgICAgICAndXNlcl9sb2dpbicgPT4gJGxvZ2luLAogICAgICAgICAgICAndXNlcl9lbWFpbCcgPT4gJ3BzX204X2UyZUBkZXYuYXZlc2EubHQnLAogICAgICAgICAgICAndXNlcl9wYXNzJyAgPT4gd3BfZ2VuZXJhdGVfcGFzc3dvcmQoMjQpLAogICAgICAgICAgICAncm9sZScgICAgICAgPT4gJ2N1c3RvbWVyJywKICAgICAgICAgICAgJ2ZpcnN0X25hbWUnID0+ICdFMkUnLAogICAgICAgICkpOwogICAgICAgICR1ID0gaXNfd3BfZXJyb3IoJHVpZCkgPyBudWxsIDogZ2V0X3VzZXJfYnkoJ2lkJywgJHVpZCk7CiAgICAgICAgJHJbJ3N1a3VydGFzJ10gPSB0cnVlOwogICAgfQogICAgaWYgKCEkdSkgeyBlY2hvIHdwX2pzb25fZW5jb2RlKGFycmF5KCdlcnInPT4nbmVwYXZ5a28gdmFydG90b2pvJykpOyBleGl0OyB9CiAgICAkdWlkID0gKGludCkgJHUtPklEOwoKICAgIC8vIFV6dGlrcmluYW0sIGthZCBhdWdpbnRpbml1IE5FVFVSSSAodHVzY2lhIGJ1c2VuYSkKICAgICRyWydwZXRzX3ByaWVzJ10gPSAoaW50KSAkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgKICAgICAgICAiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9cHNfcGV0cyBXSEVSRSB1c2VyX2lkPSVkIEFORCBzdGF0dXM9J2FjdGl2ZSciLCAkdWlkKSk7CiAgICBpZiAoJHJbJ3BldHNfcHJpZXMnXSA+IDApIHsKICAgICAgICAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoCiAgICAgICAgICAgICJVUERBVEUgeyR3cGRiLT5wcmVmaXh9cHNfcGV0cyBTRVQgc3RhdHVzPSdkZWxldGVkJyBXSEVSRSB1c2VyX2lkPSVkIiwgJHVpZCkpOwogICAgfQogICAgJHJbJ3VzZXJfaWQnXSA9ICR1aWQ7CgogICAgLy8gVHJ1bXBhbGFpa2lzIGF1dGggY29va2llICgxMCBtaW4pIOKAlCBFMkUgbmFyxaF5a2xlaQogICAgJGV4cCA9IHRpbWUoKSArIDYwMDsKICAgICRyWydjb29raWVfbmFtZSddICA9IExPR0dFRF9JTl9DT09LSUU7CiAgICAkclsnY29va2llX3ZhbHVlJ10gPSB3cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCAkZXhwLCAnbG9nZ2VkX2luJyk7CiAgICAkclsnYXV0aF9uYW1lJ10gICAgPSAoaXNfc3NsKCkgPyBTRUNVUkVfQVVUSF9DT09LSUUgOiBBVVRIX0NPT0tJRSk7CiAgICAkclsnYXV0aF92YWx1ZSddICAgPSB3cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCAkZXhwLCBpc19zc2woKSA/ICdzZWN1cmVfYXV0aCcgOiAnYXV0aCcpOwogICAgJHJbJ2Nvb2tpZXBhdGgnXSAgID0gQ09PS0lFUEFUSDsKICAgICRyWydkb21haW4nXSAgICAgICA9IHBhcnNlX3VybChob21lX3VybCgpLCBQSFBfVVJMX0hPU1QpOwoKICAgIC8vIFVSTCdhaSB0ZXN0dWkg4oCUIGVuZHBvaW50IElTIEtMQVNFUyBLT05TVEFOVE9TLCBuZSBzcGVsaW9qYW50CiAgICAkZXAgPSAoIGNsYXNzX2V4aXN0cygnUGV0c2hvcF9QZXRfVUknKSAmJiBkZWZpbmVkKCdQZXRzaG9wX1BldF9VSTo6RU5EUE9JTlQnKSApCiAgICAgICAgPyBjb25zdGFudCgnUGV0c2hvcF9QZXRfVUk6OkVORFBPSU5UJykgOiBudWxsOwogICAgJHJbJ2VuZHBvaW50J10gPSAkZXA7CiAgICAkclsnd2NfZW5kcG9pbnRzJ10gPSB3Y19nZXRfYWNjb3VudF9tZW51X2l0ZW1zKCk7CiAgICAkclsnd2NfcXVlcnlfdmFycyddID0gV0MoKS0+cXVlcnkgPyBXQygpLT5xdWVyeS0+Z2V0X3F1ZXJ5X3ZhcnMoKSA6IGFycmF5KCk7CiAgICBpZiAoJGVwKSB7CiAgICAgICAgJHJbJ3VybF90YWInXSAgICA9IHdjX2dldF9hY2NvdW50X2VuZHBvaW50X3VybCgkZXApOwogICAgICAgICRyWyd1cmxfY3JlYXRlJ10gPSBhZGRfcXVlcnlfYXJnKCdhY3Rpb24nLCdjcmVhdGUnLCB3Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJGVwKSk7CiAgICB9CiAgICBlY2hvIHdwX2pzb25fZW5jb2RlKCRyLCBKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVN8SlNPTl9QUkVUVFlfUFJJTlQpOwogICAgZXhpdDsKfSk7Cg==','base64').toString('utf8');
fs.writeFileSync('/tmp/sn.json',JSON.stringify({name:'TEMP M8 Auth v2',code:php.replace(/^<\?php\s*/,''),scope:'global',active:true}));
for(let i=0;i<3 && !sid;i++){
  const r=sh('curl -sSk '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/sn.json "'+API+'"');
  let j=null; try{j=JSON.parse(r.out);}catch(e){}
  if(j&&j.id) sid=j.id; else {O.e=r.out.slice(0,250); sh('sleep 4');}
}
O.sid=sid;
if(!sid){ putB64('m8_e2e.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64')); console.log('no sid'); process.exit(0); }
sh('sleep 5');
const a=sh('curl -sSk -m 60 "'+SITE+'/?ps_au=Au6m8"');
let A=null; try{A=JSON.parse(a.out);}catch(e){O.auth_raw=a.out.slice(0,800);}
O.auth = A ? {user_id:A.user_id, pets_pries:A.pets_pries, endpoint:A.endpoint, url_tab:A.url_tab, url_create:A.url_create, wc_endpoints:A.wc_endpoints, qv:A.wc_query_vars} : null;

if(A && A.cookie_value && A.url_tab){
 try{
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1280,height:1000}, ignoreHTTPSErrors:true});
  await ctx.addCookies([
    {name:A.cookie_name, value:A.cookie_value, domain:A.domain, path:'/', httpOnly:true, secure:true},
    {name:A.auth_name,   value:A.auth_value,   domain:A.domain, path:'/', httpOnly:true, secure:true},
  ]);
  const page = await ctx.newPage();
  const errs=[], bad=[];
  page.on('console', m=>{ if(m.type()==='error') errs.push(m.text().slice(0,200)); });
  page.on('response', r=>{ if(r.status()>=400) bad.push(r.status()+' '+r.url().slice(0,140)); });

  // --- A: tuscia busena ---
  await page.goto(A.url_tab, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(1500);
  O.A_url = page.url();
  O.A_prisijunges = await page.locator('body').evaluate(b=>b.className).catch(()=>'') ;
  O.A_mygtukas_yra = await page.getByText('Sukurti profilį', {exact:false}).count();
  O.A_form_laukai = await page.locator('#pspet-form-host input, #pspet-form input').count();
  fs.writeFileSync('/tmp/A.png', await page.screenshot({fullPage:true}));

  // --- B: paspaudimas ---
  if (O.A_mygtukas_yra > 0) {
    try {
      await page.getByText('Sukurti profilį', {exact:false}).first().click({timeout:15000});
      await page.waitForTimeout(2500);
      O.B_url = page.url();
      O.B_form_laukai = await page.locator('#pspet-form-host input, #pspet-form input').count();
      O.B_rusies_pasirinkimas = await page.getByText('Šuo', {exact:false}).count();
      fs.writeFileSync('/tmp/B.png', await page.screenshot({fullPage:true}));
    } catch(e){ O.B_err = String(e).slice(0,300); }
  }

  // --- C: serverio kelias ?action=create ---
  await page.goto(A.url_create, {waitUntil:'domcontentloaded', timeout:60000});
  await page.waitForTimeout(2000);
  O.C_url = page.url();
  O.C_form_laukai = await page.locator('#pspet-form-host input, #pspet-form input').count();
  O.C_rusies_pasirinkimas = await page.getByText('Šuo', {exact:false}).count();
  fs.writeFileSync('/tmp/C.png', await page.screenshot({fullPage:true}));

  O.js_klaidos = errs.slice(0,10);
  O.http_klaidos = bad.slice(0,10);
  await browser.close();
  for (const n of ['A','B','C']) {
    try{ putB64('m8_'+n+'.png', fs.readFileSync('/tmp/'+n+'.png').toString('base64')); }catch(e){ O['png_'+n]=String(e).slice(0,120); }
  }
 }catch(err){ O.BROWSER_ERR = String(err && err.stack ? err.stack : err).slice(0,900); }
}
fs.writeFileSync('/tmp/de.json',JSON.stringify({active:false}));
sh('curl -sSk -o /dev/null '+AUTH+' -H "Content-Type: application/json" -X POST --data-binary @/tmp/de.json "'+API+'/'+sid+'"');
O.site=sh('curl -sSk -m 25 -o /dev/null -w "%{http_code}" "'+SITE+'/"').out.trim();
putB64('m8_e2e.json',Buffer.from(JSON.stringify(O,null,1)).toString('base64'));
console.log('done');
