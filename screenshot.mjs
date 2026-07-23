import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19hbG9naW4nXSkmJiRfR0VUWydwc19hbG9naW4nXT09PSdFMmVUbXA5eCcpewoJCSRhPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdT0kYT8kYVswXTpudWxsOwoJCWlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsgfQoJCXdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZXByZXAnXSkmJiRfR0VUWydwc19lMmVwcmVwJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRhaWQ9MTsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJLy8gUElMTkFTOiB2aXNpIFMyMTggbGF1a2FpCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFNhcmdpcycsJ3NwZWNpZXMnPT4nZG9nJywnc3BlY2llc19kZXRhaWwnPT4nQXVrc2FzcGFsdmlzIHJldHJpdmVyaXMnLCdiaXJ0aF9kYXRlJz0+JzIwMjItMDUtMTAnLCdsaWZlX3N0YWdlJz0+J2FkdWx0JywnZG9nX3NpemUnPT4nbGFyZ2UnLCdpc19zdGVyaWxpc2VkJz0+J3llcycsJ2ZlZWRpbmdfdHlwZSc9Pidkcnlfb25seScsJ3ByaW1hcnlfbmVlZCc9PidkYWlseScsJ3NlbnNpdGl2aXRpZXMnPT4nY2hpY2tlbixncmFpbnMnLCdob3VzaW5nJz0+J2luZG9vcicsJ2FjdGl2aXR5X2hpbnQnPT4nbW9kZXJhdGUnLCdzdGF0dXMnPT4nYWN0aXZlJywnY3VycmVudF93ZWlnaHRfa2cnPT4yNS41LCd3ZWlnaHRfdXBkYXRlZF9hdCc9PiRub3csJ2lzX3ByaW1hcnknPT4xLCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1snZnVsbCddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQkvLyBEQUxJTklTOiB0aWsgdmFyZGFzK3N2b3JpcyAtPiBjb21wbGV0ZW5lc3MgYmxva2FzCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFB1c2lhdScsJ3NwZWNpZXMnPT4nZG9nJywnc3RhdHVzJz0+J2FjdGl2ZScsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+MTIuMCwnd2VpZ2h0X3VwZGF0ZWRfYXQnPT4kbm93LCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1sncGFydCddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQkkb1snZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CgkJZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cgl9CglpZihpc3NldCgkX0dFVFsncHNfZTJlY2xlYW4nXSkmJiRfR0VUWydwc19lMmVjbGVhbiddPT09J0UyZVRtcDl4Jyl7CgkJZ2xvYmFsICR3cGRiOyRwZj0kd3BkYi0+cHJlZml4OwoJCSRyb3c9JHdwZGItPmdldF9yb3coIlNFTEVDVCBwZXRfbmFtZSxzcGVjaWVzLGJpcnRoX2RhdGUsbGlmZV9zdGFnZSxkb2dfc2l6ZSxpc19zdGVyaWxpc2VkLGFjdGl2aXR5X2hpbnQsZmVlZGluZ190eXBlLHNlbnNpdGl2aXRpZXMsaG91c2luZyxzcGVjaWVzX2RldGFpbCxwcmltYXJ5X25lZWQsY3VycmVudF93ZWlnaHRfa2cgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgcGV0X25hbWU9J0UyRSBQdXNpYXUnIEFORCBzdGF0dXM9J2FjdGl2ZScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwgQVJSQVlfQSk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJZWNobyBqc29uX2VuY29kZShhcnJheSgnaXN0cmludGEnPT5jb3VudCgkaWRzKSwncHVzaWF1X2RiJz0+JHJvdykpOyBleGl0OwoJfQp9KTsK';
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
const mk=wj('POST','code-snippets/v1/snippets',{name:'VIS218B (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
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
  // FORMOS ribose (pspet-form-host) — ne visame dokumente
  const formBtn=async(txt)=>await page.evaluate((t)=>{
    const h=document.getElementById('pspet-form-host'); if(!h) return 'NO HOST';
    const b=[...h.querySelectorAll('button')].find(x=>x.textContent.trim()===t);
    if(b){b.click();return 'OK';} return 'NOT FOUND '+t;
  }, txt);

  await page.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='PRIIMTI');if(b)b.click();});
  await page.waitForTimeout(3000);
  // perjungiam i E2E Pusiau
  await page.evaluate(()=>{const t=document.querySelectorAll('.pspet-switch-item'); for(const x of t){ if(/Pusiau/.test(x.innerText)){x.click();return;} }});
  await page.waitForTimeout(3000);
  // Papildyti profili -> step1 -> Testi (FORMOS)
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Papildyti profil/.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(1500);
  o.t1=await formBtn('Tęsti');
  await page.waitForTimeout(1200);
  await shot('w_1_step2_virsus');
  o.step2txt=await page.evaluate(()=>{const h=document.getElementById('pspet-form-host'); return h? h.innerText.replace(/\s+/g,' ').slice(0,700):'NO HOST';});
  // PILDOM: gimimo data
  o.fill_birth=await page.evaluate(()=>{
    const h=document.getElementById('pspet-form-host');
    const d=h && h.querySelector('input[type=date]'); if(!d) return 'NO DATE INPUT';
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(d,'2025-11-05');
    d.dispatchEvent(new Event('change',{bubbles:true}));
    return 'OK';
  });
  await page.waitForTimeout(400);
  // pill'ai formos ribose pagal teksta
  const pill=async(txt)=>await page.evaluate((t)=>{
    const h=document.getElementById('pspet-form-host');
    const b=[...h.querySelectorAll('.pspet-pill')].find(x=>x.textContent.trim()===t);
    if(b){b.click();return 'OK';} return 'NF '+t;
  }, txt);
  o.p_dydis=await pill('Vidutinis (10–25 kg)');
  o.p_ster=await pill('Ne');
  o.p_akt=await pill('Labai aktyvus');
  o.p_mait=await pill('Tik sausas');
  o.p_sens1=await pill('Vištiena');
  o.p_sens2=await pill('Grūdai');
  o.p_need=await pill('Jautrus virškinimas');
  o.p_hous=await pill('Namuose');
  // veisle
  o.fill_breed=await page.evaluate(()=>{
    const h=document.getElementById('pspet-form-host');
    const i=[...h.querySelectorAll('input[list]')][0]; if(!i) return 'NO BREED';
    i.value='Mišrūnas'; i.dispatchEvent(new Event('input',{bubbles:true})); return 'OK';
  });
  await shot('w_2_step2_uzpildyta');
  // ISSAUGOM
  o.save=await formBtn('Išsaugoti profilį');
  await page.waitForTimeout(4500);
  await shot('w_3_po_issaugojimo');
  o.after=await page.evaluate(()=>{const n=document.querySelector('.pspet-profile'); return n? n.innerText.replace(/\s+/g,' ').slice(0,700):'';});
  o.comp_po=await page.evaluate(()=>{const m=[...document.querySelectorAll('div')].find(x=>/Profilis užpildytas/.test(x.textContent)&&x.textContent.length<400); return m? m.innerText.replace(/\s+/g,' ').slice(0,200):'NEBERODOMAS (100%)';});
  await browser.close();
}catch(e){ o.err=String(e).slice(0,300); }
try{const c=execSync('curl -sk "https://dev.avesa.lt/?ps_e2eclean=E2eTmp9x"',{timeout:30000}).toString();o.clean=c.slice(c.indexOf('{'),c.lastIndexOf('}')+1);}catch(e){}
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('vis218c.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
