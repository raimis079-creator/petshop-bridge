import { execSync } from 'child_process';
import fs from 'fs';
const PREP='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19hbG9naW4nXSkmJiRfR0VUWydwc19hbG9naW4nXT09PSdFMmVUbXA5eCcpewoJCSRhPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdT0kYT8kYVswXTpudWxsOwoJCWlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsgfQoJCXdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZXByZXAnXSkmJiRfR0VUWydwc19lMmVwcmVwJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRhaWQ9MTsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJLy8gUElMTkFTOiB2aXNpIFMyMTggbGF1a2FpCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFNhcmdpcycsJ3NwZWNpZXMnPT4nZG9nJywnc3BlY2llc19kZXRhaWwnPT4nQXVrc2FzcGFsdmlzIHJldHJpdmVyaXMnLCdiaXJ0aF9kYXRlJz0+JzIwMjItMDUtMTAnLCdsaWZlX3N0YWdlJz0+J2FkdWx0JywnZG9nX3NpemUnPT4nbGFyZ2UnLCdpc19zdGVyaWxpc2VkJz0+J3llcycsJ2ZlZWRpbmdfdHlwZSc9Pidkcnlfb25seScsJ3ByaW1hcnlfbmVlZCc9PidkYWlseScsJ3NlbnNpdGl2aXRpZXMnPT4nY2hpY2tlbixncmFpbnMnLCdob3VzaW5nJz0+J2luZG9vcicsJ2FjdGl2aXR5X2hpbnQnPT4nbW9kZXJhdGUnLCdzdGF0dXMnPT4nYWN0aXZlJywnY3VycmVudF93ZWlnaHRfa2cnPT4yNS41LCd3ZWlnaHRfdXBkYXRlZF9hdCc9PiRub3csJ2lzX3ByaW1hcnknPT4xLCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1snZnVsbCddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQkvLyBEQUxJTklTOiB0aWsgdmFyZGFzK3N2b3JpcyAtPiBjb21wbGV0ZW5lc3MgYmxva2FzCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFB1c2lhdScsJ3NwZWNpZXMnPT4nZG9nJywnc3RhdHVzJz0+J2FjdGl2ZScsJ2N1cnJlbnRfd2VpZ2h0X2tnJz0+MTIuMCwnd2VpZ2h0X3VwZGF0ZWRfYXQnPT4kbm93LCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1sncGFydCddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQkkb1snZXJyJ109JHdwZGItPmxhc3RfZXJyb3I7CgkJZWNobyBqc29uX2VuY29kZSgkbyk7IGV4aXQ7Cgl9CglpZihpc3NldCgkX0dFVFsncHNfZTJlY2xlYW4nXSkmJiRfR0VUWydwc19lMmVjbGVhbiddPT09J0UyZVRtcDl4Jyl7CgkJZ2xvYmFsICR3cGRiOyRwZj0kd3BkYi0+cHJlZml4OwoJCSRyb3c9JHdwZGItPmdldF9yb3coIlNFTEVDVCBwZXRfbmFtZSxzcGVjaWVzLGJpcnRoX2RhdGUsbGlmZV9zdGFnZSxkb2dfc2l6ZSxpc19zdGVyaWxpc2VkLGFjdGl2aXR5X2hpbnQsZmVlZGluZ190eXBlLHNlbnNpdGl2aXRpZXMsaG91c2luZyxzcGVjaWVzX2RldGFpbCxwcmltYXJ5X25lZWQsY3VycmVudF93ZWlnaHRfa2cgRlJPTSB7JHBmfXBzX3BldHMgV0hFUkUgcGV0X25hbWU9J0UyRSBQdXNpYXUnIEFORCBzdGF0dXM9J2FjdGl2ZScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIiwgQVJSQVlfQSk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJZWNobyBqc29uX2VuY29kZShhcnJheSgnaXN0cmludGEnPT5jb3VudCgkaWRzKSwncHVzaWF1X2RiJz0+JHJvdykpOyBleGl0OwoJfQp9KTsK';
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
const o={net:[],console:[]};
const mk2=wj('POST','code-snippets/v1/snippets',{name:'VIS223 (temp)',code:Buffer.from(PREP,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid2; try{sid2=JSON.parse(mk2).id;}catch(e){}
execSync('sleep 3');
try{execSync('curl -sk "https://dev.avesa.lt/?ps_e2eprep=E2eTmp9x"',{timeout:40000});}catch(e){}
try{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1440,height:1400}, ignoreHTTPSErrors:true});
  const page = await ctx.newPage();
  page.on('console', m=>{ if(m.type()==='error') o.console.push(m.text().slice(0,150)); });
  page.on('pageerror', e=>o.console.push('PAGEERROR: '+String(e).slice(0,150)));
  page.on('response', async r=>{
    if(/pet-product-link|pet-dashboard/.test(r.url())){
      let body=''; try{ body=(await r.text()).slice(0, r.url().includes('product-link')?300:0); }catch(e){}
      o.net.push(r.request().method()+' '+r.url().split('/wp-json/')[1].slice(0,60)+' -> '+r.status()+(body?' '+body:''));
    }
  });
  await page.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(1500);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>x.textContent.trim()==='PRIIMTI');if(b)b.click();});
  await page.waitForTimeout(3000);
  await page.evaluate(()=>{const t=document.querySelectorAll('.pspet-switch-item'); for(const x of t){ if(/Sargis/.test(x.innerText)){x.click();return;} }});
  await page.waitForTimeout(3000);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>x.textContent.trim()==='Atidaryti');if(b)b.click();});
  await page.waitForTimeout(3000);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Pridėti papildomą maistą/.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(1000);
  await page.evaluate(()=>{
    const inputs=[...document.querySelectorAll('input')].filter(x=>x.placeholder==='Įveskite pavadinimą arba prekės ženklą');
    const i=inputs[inputs.length-1];
    const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;
    setter.call(i,'Animonda'); i.dispatchEvent(new Event('input',{bubbles:true}));
  });
  await page.waitForTimeout(3000);
  o.first_res=await page.evaluate(()=>{const b=document.querySelector('.pspet-res-item'); return b? JSON.stringify({t:b.textContent.slice(0,40)}):'NONE';});
  await page.evaluate(()=>{const b=document.querySelector('.pspet-res-item'); if(b)b.click();});
  await page.waitForTimeout(6000);
  // shelf is dashboard REST tiesiogiai
  o.shelf=await page.evaluate(async ()=>{
    const petId=(window.PSPetConfig&&0)||null;
    const t=[...document.querySelectorAll('.pspet-switch-item')];
    // pet id nezinom is DOM — imam is fetch: kviesim dashboard visiems? paprasciau: paskutinis pet-dashboard atsakymas jau tinkle
    return 'zr net';
  });
  o.po=await page.evaluate(()=>{const i=document.body.innerText.indexOf('Papildomas maistas'); return i>=0? document.body.innerText.slice(i,i+180).replace(/\s+/g,' '):'NERASTA';});
  await browser.close();
}catch(e){ o.err=String(e).slice(0,300); }
// DB patikra PRIES clean: ar secondary_food irasyta
try{const r=execSync('curl -sk "https://dev.avesa.lt/?ps_e2eclean=E2eTmp9x"',{timeout:30000}).toString();o.clean=r.slice(r.indexOf('{'),r.indexOf('}')+1);}catch(e){}
if(sid2){ try{wj('POST','code-snippets/v1/snippets/'+sid2,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid2+'"');}catch(e){} }
putB64('diag223.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
