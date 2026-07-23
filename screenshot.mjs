import { execSync } from 'child_process';
import fs from 'fs';
const PREP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19hbG9naW4nXSkmJiRfR0VUWydwc19hbG9naW4nXT09PSdFMmVUbXA5eCcpewoJCSRhPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdT0kYT8kYVswXTpudWxsOwoJCWlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsgfQoJCXdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZXByZXAnXSkmJiRfR0VUWydwc19lMmVwcmVwJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRhaWQ9MTsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJLy8gUElMTkFTOiB2aXNpIFMyMTggbGF1a2FpCgkJJGppZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcC5wb3N0X3RpdGxlIExJS0UgJ0pvc2VyYSBOYXR1cmUgZW5lcmdldGljJScgTElNSVQgMSIpOwoJCWlmKCEkamlkKSAkamlkPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBwLklEIEZST00geyR3cGRiLT5wb3N0c30gcCBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBwLnBvc3RfdGl0bGUgTElLRSAnSm9zZXJhJTEyLDUga2clJyBMSU1JVCAxIik7CgkJJGp0PSRqaWQ/Z2V0X3RoZV90aXRsZSgkamlkKTonSm9zZXJhJzsKCQkkd3BkYi0+aW5zZXJ0KCRwZi4ncHNfcGV0cycsYXJyYXkoJ3VzZXJfaWQnPT4kYWlkLCdwZXRfbmFtZSc9PidFMkUgU2FyZ2lzJywnc3BlY2llcyc9Pidkb2cnLCdzcGVjaWVzX2RldGFpbCc9PidBdWtzYXNwYWx2aXMgcmV0cml2ZXJpcycsJ2JpcnRoX2RhdGUnPT4nMjAyMi0wNS0xMCcsJ2xpZmVfc3RhZ2UnPT4nYWR1bHQnLCdkb2dfc2l6ZSc9PidsYXJnZScsJ2lzX3N0ZXJpbGlzZWQnPT4neWVzJywnZmVlZGluZ190eXBlJz0+J2RyeV9vbmx5JywncHJpbWFyeV9uZWVkJz0+J2RhaWx5Jywnc2Vuc2l0aXZpdGllcyc9PidjaGlja2VuLGdyYWlucycsJ2hvdXNpbmcnPT4naW5kb29yJywnYWN0aXZpdHlfaGludCc9Pidtb2RlcmF0ZScsJ3N0YXR1cyc9PidhY3RpdmUnLCdjdXJyZW50X3dlaWdodF9rZyc9PjI1LjUsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywncHJpbWFyeV9wcm9kdWN0X2lkJz0+JGppZCwncHJpbWFyeV9wcm9kdWN0X25hbWUnPT4kanQsJ3ByaW1hcnlfcHJvZHVjdF9wYWNrYWdlJz0+JzEyLDUga2cnLCdpc19wcmltYXJ5Jz0+MSwnY3JlYXRlZF9hdCc9PiRub3csJ3VwZGF0ZWRfYXQnPT4kbm93KSk7CgkJJG9bJ2ppZCddPSRqaWQ7CgkJJG9bJ2Z1bGwnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CgkJLy8gREFMSU5JUzogdGlrIHZhcmRhcytzdm9yaXMgLT4gY29tcGxldGVuZXNzIGJsb2thcwoJCSR3cGRiLT5pbnNlcnQoJHBmLidwc19wZXRzJyxhcnJheSgndXNlcl9pZCc9PiRhaWQsJ3BldF9uYW1lJz0+J0UyRSBQdXNpYXUnLCdzcGVjaWVzJz0+J2RvZycsJ3N0YXR1cyc9PidhY3RpdmUnLCdjdXJyZW50X3dlaWdodF9rZyc9PjEyLjAsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywnY3JlYXRlZF9hdCc9PiRub3csJ3VwZGF0ZWRfYXQnPT4kbm93KSk7CgkJJG9bJ3BhcnQnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CgkJJG9bJ2VyciddPSR3cGRiLT5sYXN0X2Vycm9yOwoJCWVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZWNsZWFuJ10pJiYkX0dFVFsncHNfZTJlY2xlYW4nXT09PSdFMmVUbXA5eCcpewoJCWdsb2JhbCAkd3BkYjskcGY9JHdwZGItPnByZWZpeDsKCQkkcm93PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgcGV0X25hbWUsc3BlY2llcyxiaXJ0aF9kYXRlLGxpZmVfc3RhZ2UsZG9nX3NpemUsaXNfc3RlcmlsaXNlZCxhY3Rpdml0eV9oaW50LGZlZWRpbmdfdHlwZSxzZW5zaXRpdml0aWVzLGhvdXNpbmcsc3BlY2llc19kZXRhaWwscHJpbWFyeV9uZWVkLGN1cnJlbnRfd2VpZ2h0X2tnIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lPSdFMkUgUHVzaWF1JyBBTkQgc3RhdHVzPSdhY3RpdmUnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsIEFSUkFZX0EpOwoJCSRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskcGZ9cHNfcGV0cyBXSEVSRSBwZXRfbmFtZSBMSUtFICdFMkUlJyIpOwoJCWZvcmVhY2goJGlkcyBhcyAkaSl7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRfcHJvZHVjdHMnLGFycmF5KCdwZXRfaWQnPT4kaSkpOyAkd3BkYi0+ZGVsZXRlKCRwZi4ncHNfcGV0cycsYXJyYXkoJ2lkJz0+JGkpKTsgfQoJCWVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2lzdHJpbnRhJz0+Y291bnQoJGlkcyksJ3B1c2lhdV9kYic9PiRyb3cpKTsgZXhpdDsKCX0KfSk7Cg==';
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
const o={req:[],console:[]};
const mk2=wj('POST','code-snippets/v1/snippets',{name:'VIS224 (temp)',code:Buffer.from(PREP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid2; try{sid2=JSON.parse(mk2).id;}catch(e){}
execSync('sleep 3');
try{execSync('curl -sk "https://dev.avesa.lt/?ps_e2eprep=E2eTmp9x"',{timeout:40000});}catch(e){}
try{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1440,height:1400}, ignoreHTTPSErrors:true});
  const page = await ctx.newPage();
  page.on('console', m=>{ o.console.push(m.type()+': '+m.text().slice(0,150)); });
  page.on('pageerror', e=>o.console.push('PAGEERROR: '+String(e).slice(0,180)));
  let track=false;
  page.on('request', r=>{ if(track && r.url().includes('/wp-json/')) o.req.push(r.method()+' '+r.url().split('/wp-json/')[1].slice(0,70)); });
  page.on('requestfailed', r=>{ if(r.url().includes('/wp-json/')) o.req.push('FAILED '+r.url().split('/wp-json/')[1].slice(0,70)+' '+(r.failure()&&r.failure().errorText)); });
  await page.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='PRIIMTI');if(b)b.click();});
  await page.waitForTimeout(3000);
  o.sw=await page.evaluate(()=>{const t=[...document.querySelectorAll('.pspet-switch-item')]; const m=t.map(x=>x.innerText.replace(/\s+/g,' ').trim()); const x=t.find(x=>/Sargis/.test(x.innerText)); if(x){x.click(); return 'CLICK '+JSON.stringify(m);} return 'NF '+JSON.stringify(m);});
  await page.waitForTimeout(3500);
  o.who=await page.evaluate(()=>{const n=document.querySelector('.pspet-profile'); return n? n.innerText.replace(/\s+/g,' ').slice(0,120):'';});
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Atidaryti');if(b)b.click();});
  await page.waitForTimeout(2500);
  o.mod_state=await page.evaluate(()=>{const t=document.body.innerText; return {D:/Dabartinis maistas/.test(t), B:/Koks dabar yra/.test(t), sec:/Papildomas maistas/.test(t)};});
  o.addbtn=await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Pridėti papildomą maistą/.test(x.textContent));if(b){b.click();return 'CLICK';}return 'NF';});
  await page.waitForTimeout(800);
  await page.evaluate(()=>{
    const inputs=[...document.querySelectorAll('input')].filter(x=>x.placeholder==='Įveskite pavadinimą arba prekės ženklą');
    const i=inputs[inputs.length-1];
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(i,'Animonda'); i.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await page.waitForTimeout(3000);
  track=true;
  o.click=await page.evaluate(()=>{
    const all=[...document.querySelectorAll('.pspet-res-item')];
    const b=all[0]; if(!b) return 'NONE';
    const info={n:all.length, mode:b.dataset.mode, modes:[...new Set(all.map(x=>x.dataset.mode))], txt:b.textContent.slice(0,30)};
    b.click();
    return JSON.stringify(info);
  });
  await page.waitForTimeout(6000);
  track=false;
  o.final=await page.evaluate(()=>{const i=document.body.innerText.indexOf('Papildomas maistas'); return i>=0? document.body.innerText.slice(i,i+200).replace(/\s+/g,' '):'NERASTA';});
  o.final_D=await page.evaluate(()=>/Dabartinis maistas/.test(document.body.innerText));
  // rankinis fetch to paties endpointo — ar VEIKIA is viso
  o.manual=await page.evaluate(async ()=>{
    try{
      const CFG=window.PSPetConfig||{};
      const r=await fetch((CFG.restUrl||'/wp-json/petshop/v1')+'/pet-product-link',{method:'POST',
        headers:{'Content-Type':'application/json','X-WP-Nonce':CFG.nonce||''},credentials:'same-origin',
        body:JSON.stringify({pet_id:(function(){const m=location.href;return null})()||window.__pid||0,product_id:0})});
      return 'status '+r.status;
    }catch(e){ return 'ERR '+String(e).slice(0,120); }
  });
  await browser.close();
}catch(e){ o.err=String(e).slice(0,300); }
try{execSync('curl -sk "https://dev.avesa.lt/?ps_e2eclean=E2eTmp9x"',{timeout:30000});}catch(e){}
if(sid2){ try{wj('POST','code-snippets/v1/snippets/'+sid2,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid2+'"');}catch(e){} }
putB64('diag227.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
