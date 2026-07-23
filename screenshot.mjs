import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19hbG9naW4nXSkmJiRfR0VUWydwc19hbG9naW4nXT09PSdFMmVUbXA5eCcpewoJCSRhPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdT0kYT8kYVswXTpudWxsOwoJCWlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsgfQoJCXdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZXByZXAnXSkmJiRfR0VUWydwc19lMmVwcmVwJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRhaWQ9MTsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJLy8gUElMTkFTOiB2aXNpIFMyMTggbGF1a2FpCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFNhcmdpcycsJ3NwZWNpZXMnPT4nZG9nJywnc3BlY2llc19kZXRhaWwnPT4nQXVrc2FzcGFsdmlzIHJldHJpdmVyaXMnLCdiaXJ0aF9kYXRlJz0+JzIwMjItMDUtMTAnLCdsaWZlX3N0YWdlJz0+J2FkdWx0JywnZG9nX3NpemUnPT4nbGFyZ2UnLCdpc19zdGVyaWxpc2VkJz0+J3llcycsJ2ZlZWRpbmdfdHlwZSc9Pidkcnlfb25seScsJ3ByaW1hcnlfbmVlZCc9PidkYWlseScsJ3NlbnNpdGl2aXRpZXMnPT4nY2hpY2tlbixncmFpbnMnLCdob3VzaW5nJz0+J2luZG9vcicsJ2FjdGl2aXR5X2hpbnQnPT4nbW9kZXJhdGUnLCdzdGF0dXMnPT4nYWN0aXZlJywnY3VycmVudF93ZWlnaHRfa2cnPT4yNS41LCd3ZWlnaHRfdXBkYXRlZF9hdCc9PiRub3csJ2lzX3ByaW1hcnknPT4xLCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1snZnVsbCddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQkvLyBEQUxJTklTOiB0aWsgdmFyZGFzK3N2b3JpcyAtPiBjb21wbGV0ZW5lc3MgYmxva2FzCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFB1c2lhdScsJ3NwZWNpZXMnPT4nZG9nJywnc3RhdHVzJz0+J2FjdGl2ZScsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+MTIuMCwnd2VpZ2h0X3VwZGF0ZWRfYXQnPT4kbm93LCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1sncGFydCddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQkkb1snZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CgkJZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cgl9CglpZihpc3NldCgkX0dFVFsncHNfZTJlY2xlYW4nXSkmJiRfR0VUWydwc19lMmVjbGVhbiddPT09J0UyZVRtcDl4Jyl7CgkJZ2xvYmFsICR3cGRiOyRwZj0kd3BkYi0+cHJlZml4OwoJCSRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskcGZ9cHNfcGV0cyBXSEVSRSBwZXRfbmFtZSBMSUtFICdFMkUlJyIpOwoJCWZvcmVhY2goJGlkcyBhcyAkaSl7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRfcHJvZHVjdHMnLGFycmF5KCdwZXRfaWQnPT4kaSkpOyAkd3BkYi0+ZGVsZXRlKCRwZi4ncHNfcGV0cycsYXJyYXkoJ2lkJz0+JGkpKTsgfQoJCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2lzdHJpbnRhJz0+Y291bnQoJGlkcykpKTsgZXhpdDsKCX0KfSk7Cg==';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"',{maxBuffer:50*1024*1024}).toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"',{maxBuffer:50*1024*1024}).toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={steps:[],console:[]};
const mk=wj('POST','code-snippets/v1/snippets',{name:'VIS218 (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,150);}
execSync('sleep 3');
try{const r=execSync('curl -sk "https://dev.avesa.lt/?ps_e2eprep=E2eTmp9x"',{timeout:40000}).toString();o.prep=r.slice(r.indexOf('{'),r.indexOf('}')+1);}catch(e){o.prep='ERR';}
try{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1440,height:1400}, ignoreHTTPSErrors:true});
  const page = await ctx.newPage();
  page.on('console', m=>{ if(m.type()==='error') o.console.push(m.text().slice(0,140)); });
  page.on('pageerror', e=>o.console.push('PAGEERROR: '+String(e).slice(0,140)));
  const shot=async(n)=>{ const b=await page.screenshot({fullPage:true}); putB64(n+'.png', b.toString('base64')); o.steps.push(n); };
  await page.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='PRIIMTI');if(b)b.click();});
  await page.waitForTimeout(3500);
  await shot('v_1_pilnas');
  o.summary=await page.evaluate(()=>{const n=document.querySelector('.pspet-profile'); return n? n.innerText.replace(/\s+/g,' ').slice(0,600):'';});
  // perjungiam i dalini
  await page.evaluate(()=>{const t=document.querySelectorAll('.pspet-switch-item'); for(const x of t){ if(/Pusiau/.test(x.innerText)){x.click();return;} }});
  await page.waitForTimeout(3500);
  await shot('v_2_dalinis');
  o.comp=await page.evaluate(()=>{const m=[...document.querySelectorAll('div')].find(x=>/Profilis užpildytas/.test(x.textContent)&&x.textContent.length<400); return m? m.innerText.replace(/\s+/g,' ').slice(0,300):'NERASTA';});
  // Papildyti profili -> step1 -> Testi -> step2
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Papildyti profil/.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(2000);
  await shot('v_3_step1');
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Tęsti');if(b)b.click();});
  await page.waitForTimeout(1500);
  await shot('v_4_step2');
  o.step2=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(0,900));
  // mobile
  const ctx2 = await browser.newContext({viewport:{width:390,height:900}, ignoreHTTPSErrors:true, isMobile:true, hasTouch:true, deviceScaleFactor:2});
  const p2 = await ctx2.newPage();
  await p2.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await p2.waitForTimeout(1500);
  await p2.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='PRIIMTI');if(b)b.click();});
  await p2.waitForTimeout(3500);
  { const b=await p2.screenshot({fullPage:true}); putB64('v_5_mobile.png', b.toString('base64')); o.steps.push('v_5_mobile'); }
  await browser.close();
}catch(e){ o.err=String(e).slice(0,300); }
try{const c=execSync('curl -sk "https://dev.avesa.lt/?ps_e2eclean=E2eTmp9x"',{timeout:30000}).toString();o.clean=c.slice(c.indexOf('{'),c.indexOf('}')+1);}catch(e){}
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('vis218.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
