import { execSync } from 'child_process';
import fs from 'fs';
const PREP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19hbG9naW4nXSkmJiRfR0VUWydwc19hbG9naW4nXT09PSdFMmVUbXA5eCcpewoJCSRhPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdT0kYT8kYVswXTpudWxsOwoJCWlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsgfQoJCXdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZXByZXAnXSkmJiRfR0VUWydwc19lMmVwcmVwJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRhaWQ9MTsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJLy8gUElMTkFTOiB2aXNpIFMyMTggbGF1a2FpCgkJJGppZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcC5wb3N0X3RpdGxlIExJS0UgJ0pvc2VyYSBOYXR1cmUgZW5lcmdldGljJScgTElNSVQgMSIpOwoJCWlmKCEkamlkKSAkamlkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdGl0bGUgTElLRSAnSm9zZXJhJTEyLDUga2clJyBMSU1JVCAxIik7CgkJJGp0PSRqaWQ/Z2V0X3RoZV90aXRsZSgkamlkKTonSm9zZXJhJzsKCQkkd3BkYi0+aW5zZXJ0KCRwZi4ncHNfcGV0cycsYXJyYXkoJ3VzZXJfaWQnPT4kYWlkLCdwZXRfbmFtZSc9PidFMkUgU2FyZ2lzJywnc3BlY2llcyc9Pidkb2cnLCdzcGVjaWVzX2RldGFpbCc9PidBdWtzYXNwYWx2aXMgcmV0cml2ZXJpcycsJ2JpcnRoX2RhdGUnPT4nMjAyMi0wNS0xMCcsJ2xpZmVfc3RhZ2UnPT4nYWR1bHQnLCdkb2dfc2l6ZSc9PidsYXJnZScsJ2lzX3N0ZXJpbGlzZWQnPT4neWVzJywnZmVlZGluZ190eXBlJz0+J2RyeV9vbmx5JywncHJpbWFyeV9uZWVkJz0+J2RhaWx5Jywnc2Vuc2l0aXZpdGllcyc9PidjaGlja2VuLGdyYWlucycsJ2hvdXNpbmcnPT4naW5kb29yJywnYWN0aXZpdHlfaGludCc9Pidtb2RlcmF0ZScsJ3N0YXR1cyc9PidhY3RpdmUnLCdjdXJyZW50X3dlaWdodF9rZyc9PjI1LjUsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywncHJpbWFyeV9wcm9kdWN0X2lkJz0+JGppZCwncHJpbWFyeV9wcm9kdWN0X25hbWUnPT4kanQsJ3ByaW1hcnlfcHJvZHVjdF9wYWNrYWdlJz0+JzEyLDUga2cnLCdpc19wcmltYXJ5Jz0+MSwnY3JlYXRlZF9hdCc9PiRub3csJ3VwZGF0ZWRfYXQnPT4kbm93KSk7CgkJJG9bJ2ppZCddPSRqaWQ7CgkJJG9bJ2Z1bGwnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CgkJLy8gREFMSU5JUzogdGlrIHZhcmRhcytzdm9yaXMgLT4gY29tcGxldGVuZXNzIGJsb2thcwoJCSR3cGRiLT5pbnNlcnQoJHBmLidwc19wZXRzJyxhcnJheSgndXNlcl9pZCc9PiRhaWQsJ3BldF9uYW1lJz0+J0UyRSBQdXNpYXUnLCdzcGVjaWVzJz0+J2RvZycsJ3N0YXR1cyc9PidhY3RpdmUnLCdjdXJyZW50X3dlaWdodF9rZyc9PjEyLjAsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywnY3JlYXRlZF9hdCc9PiRub3csJ3VwZGF0ZWRfYXQnPT4kbm93KSk7CgkJJG9bJ3BhcnQnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CgkJJG9bJ2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOwoJCWVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZWNsZWFuJ10pJiYkX0dFVFsncHNfZTJlY2xlYW4nXT09PSdFMmVUbXA5eCcpewoJCWdsb2JhbCAkd3BkYjskcGY9JHdwZGItPnByZWZpeDsKCQkkcm93PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgcGV0X25hbWUsc3BlY2llcyxiaXJ0aF9kYXRlLGxpZmVfc3RhZ2UsZG9nX3NpemUsaXNfc3RlcmlsaXNlZCxhY3Rpdml0eV9oaW50LGZlZWRpbmdfdHlwZSxzZW5zaXRpdml0aWVzLGhvdXNpbmcsc3BlY2llc19kZXRhaWwscHJpbWFyeV9uZWVkLGN1cnJlbnRfd2VpZ2h0X2tnIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lPSdFMkUgUHVzaWF1JyBBTkQgc3RhdHVzPSdhY3RpdmUnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsIEFSUkFZX0EpOwoJCSRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskcGZ9cHNfcGV0cyBXSEVSRSBwZXRfbmFtZSBMSUtFICdFMkUlJyIpOwoJCWZvcmVhY2goJGlkcyBhcyAkaSl7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRfcHJvZHVjdHMnLGFycmF5KCdwZXRfaWQnPT4kaSkpOyAkd3BkYi0+ZGVsZXRlKCRwZi4ncHNfcGV0cycsYXJyYXkoJ2lkJz0+JGkpKTsgfQoJCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2lzdHJpbnRhJz0+Y291bnQoJGlkcyksJ3B1c2lhdV9kYic9PiRyb3cpKTsgZXhpdDsKCX0KCWlmKGlzc2V0KCRfR0VUWydwc19yZW1taWcnXSkmJiRfR0VUWydwc19yZW1taWcnXT09PSdFMmVUbXA5eCcpewoJCWdsb2JhbCAkd3BkYjskcGY9JHdwZGItPnByZWZpeDsgJHQ9JHBmLidwc19yZW1pbmRlcnMnOwoJCSRjb2xzPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIsMCk7CgkJaWYoIWluX2FycmF5KCdub3RpZnlfZW1haWwnLCRjb2xzKSkgJHdwZGItPnF1ZXJ5KCJBTFRFUiBUQUJMRSAkdCBBREQgQ09MVU1OIG5vdGlmeV9lbWFpbCBUSU5ZSU5UKDEpIE5PVCBOVUxMIERFRkFVTFQgMCBBRlRFUiByZXBlYXRfaW50ZXJ2YWxfZGF5cyIpOwoJCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2NvbHMnPT4kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00gJHQiLDApLCdlcnInPT4kd3BkYi0+bGFzdF9lcnJvcikpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX3JlbWNoayddKSYmJF9HRVRbJ3BzX3JlbWNoayddPT09J0UyZVRtcDl4Jyl7CgkJZ2xvYmFsICR3cGRiOyRwZj0kd3BkYi0+cHJlZml4OwoJCSRyPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQscmVtaW5kZXJfdHlwZSxkdWVfZGF0ZSxub3RpZnlfZW1haWwgRlJPTSB7JHBmfXBzX3JlbWluZGVycyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwoJCWVjaG8ganNvbl9lbmNvZGUoJHIpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX3Vsb2dpbiddKSYmJF9HRVRbJ3BzX3Vsb2dpbiddPT09J0UyZVRtcDl4Jyl7CgkJJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywnZTJldXNlcicpOwoJCWlmKCEkdSl7ICR1aWQ9d3BfY3JlYXRlX3VzZXIoJ2UyZXVzZXInLCB3cF9nZW5lcmF0ZV9wYXNzd29yZCgyMCksICdlMmUtdGVzdEBwZXRzaG9wLmx0Jyk7ICR1PWdldF91c2VyX2J5KCdpZCcsJHVpZCk7ICR1LT5zZXRfcm9sZSgnY3VzdG9tZXInKTsgfQoJCXdwX3NldF9jdXJyZW50X3VzZXIoJHUtPklEKTsgd3Bfc2V0X2F1dGhfY29va2llKCR1LT5JRCxmYWxzZSk7CgkJd3Bfc2FmZV9yZWRpcmVjdCh3Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ2F1Z2ludGluaXMnKSk7IGV4aXQ7Cgl9CglpZihpc3NldCgkX0dFVFsncHNfdWNsZWFuJ10pJiYkX0dFVFsncHNfdWNsZWFuJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7CgkJJHU9Z2V0X3VzZXJfYnkoJ2xvZ2luJywnZTJldXNlcicpOyAkbj0wOwoJCWlmKCR1KXsgJGlkcz0kd3BkYi0+Z2V0X2NvbCgkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHVzZXJfaWQ9JWQiLCR1LT5JRCkpOwoJCQlmb3JlYWNoKCRpZHMgYXMgJGkpeyAkd3BkYi0+ZGVsZXRlKCRwZi4ncHNfcGV0X3Byb2R1Y3RzJyxhcnJheSgncGV0X2lkJz0+JGkpKTsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3JlbWluZGVycycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyAkbisrOyB9IH0KCQllY2hvIGpzb25fZW5jb2RlKGFycmF5KCdwZXRzX2lzdHJpbnRhJz0+JG4pKTsgZXhpdDsKCX0KfSk7Cg==';
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
const o={net:[],console:[],steps:[]};
const mk2=wj('POST','code-snippets/v1/snippets',{name:'VIS229 (temp)',code:Buffer.from(PREP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid2; try{sid2=JSON.parse(mk2).id;}catch(e){o.mk=String(mk2).slice(0,100);}
execSync('sleep 3');
try{execSync('curl -sk "https://dev.avesa.lt/?ps_uclean=E2eTmp9x"',{timeout:30000});}catch(e){}
try{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1440,height:1500}, ignoreHTTPSErrors:true});
  const page = await ctx.newPage();
  page.on('console', m=>{ if(m.type()==='error') o.console.push(m.text().slice(0,180)); });
  page.on('pageerror', e=>o.console.push('PAGEERROR: '+String(e).slice(0,180)));
  page.on('response', r=>{ if(r.url().includes('/wp-json/') && r.status()>=400) o.net.push(r.status()+' '+r.request().method()+' '+r.url().split('/wp-json/')[1].slice(0,70)); });
  const shot=async(n)=>{ const b=await page.screenshot({fullPage:true}); putB64(n+'.png', b.toString('base64')); o.steps.push(n); };
  // PAPRASTAS VARTOTOJAS
  await page.goto('https://dev.avesa.lt/?ps_ulogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='PRIIMTI');if(b)b.click();});
  await page.waitForTimeout(3000);
  o.t1_empty=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(document.body.innerText.indexOf('Mano augintinis'), document.body.innerText.indexOf('Mano augintinis')+250));
  await shot('u_1_tuscia');
  // Sukurti profili
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>/Sukurti profilį/i.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(2000);
  o.t2_forma=await page.evaluate(()=>{const h=document.getElementById('pspet-form-host'); return h&&h.innerText? h.innerText.replace(/\s+/g,' ').slice(0,120):'NO FORM '+document.body.innerText.replace(/\s+/g,' ').slice(0,120);});
  // pildom: suo, vardas, svoris
  await page.evaluate(()=>{const p=[...document.querySelectorAll('.pspet-pill, button')].find(x=>x.textContent.trim()==='Šuo'); if(p)p.click();});
  await page.waitForTimeout(400);
  await page.evaluate(()=>{
    const h=document.getElementById('pspet-form-host')||document;
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    const n=[...h.querySelectorAll('input[type=text]')][0]; if(n){setter.call(n,'Reksas'); n.dispatchEvent(new Event('input',{bubbles:true}));}
    const w=[...h.querySelectorAll('input')].find(x=>x.inputMode==='decimal'); if(w){setter.call(w,'18'); w.dispatchEvent(new Event('input',{bubbles:true}));}
  });
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Sukurti profilį|Tęsti/.test(x.textContent.trim()));if(b)b.click();});
  await page.waitForTimeout(4500);
  o.t3_po_sukurimo=await page.evaluate(()=>document.body.innerText.replace(/\s+/g,' ').slice(document.body.innerText.indexOf('AUGINTINIAI')>=0?document.body.innerText.indexOf('AUGINTINIAI'):0, 400));
  await shot('u_2_po_sukurimo');
  // Mityba modulis + maisto priskyrimas
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Atidaryti');if(b)b.click();});
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{
    const i=[...document.querySelectorAll('input')].find(x=>x.placeholder==='Įveskite pavadinimą arba prekės ženklą');
    if(i){const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set; setter.call(i,'Josera'); i.dispatchEvent(new Event('input',{bubbles:true}));}
  });
  await page.waitForTimeout(3000);
  o.t4_res=await page.evaluate(()=>document.querySelectorAll('.pspet-res-item').length);
  await page.evaluate(()=>{const b=document.querySelector('.pspet-res-item'); if(b)b.click();});
  await page.waitForTimeout(5000);
  o.t5_planas=await page.evaluate(()=>/Rekomenduojama šėrimo norma|Dabartinis maistas/.test(document.body.innerText));
  await shot('u_3_planas');
  // priminimas
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Grįžti į augintinio/i.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(2500);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Pridėti priminimą/.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(800);
  await page.evaluate(()=>{
    const sels=[...document.querySelectorAll('select')];
    if(sels.length>=4){ sels[0].value='grooming'; const s=sels.slice(-3); s[0].value='05'; s[1].value='09'; s[2].value=String(new Date().getFullYear()); }
  });
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Išsaugoti priminimą/.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(4000);
  o.t6_rem=await page.evaluate(()=>/Kirpimas/.test(document.body.innerText));
  await shot('u_4_priminimas');
  await browser.close();
}catch(e){ o.err=String(e).slice(0,300); }
try{execSync('curl -sk "https://dev.avesa.lt/?ps_uclean=E2eTmp9x"',{timeout:30000});}catch(e){}
if(sid2){ try{wj('POST','code-snippets/v1/snippets/'+sid2,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid2+'"');}catch(e){} }
putB64('utest.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
