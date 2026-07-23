import { execSync } from 'child_process';
import fs from 'fs';
const S='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKCWlmKGlzc2V0KCRfR0VUWydwc19hbG9naW4nXSkmJiRfR0VUWydwc19hbG9naW4nXT09PSdFMmVUbXA5eCcpewoJCSRhPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSkpOyAkdT0kYT8kYVswXTpudWxsOwoJCWlmKCR1KXsgd3Bfc2V0X2N1cnJlbnRfdXNlcigkdS0+SUQpOyB3cF9zZXRfYXV0aF9jb29raWUoJHUtPklELGZhbHNlKTsgfQoJCXdwX3NhZmVfcmVkaXJlY3Qod2NfZ2V0X2FjY291bnRfZW5kcG9pbnRfdXJsKCdhdWdpbnRpbmlzJykpOyBleGl0OwoJfQoJaWYoaXNzZXQoJF9HRVRbJ3BzX2UyZXByZXAnXSkmJiRfR0VUWydwc19lMmVwcmVwJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7ICRhaWQ9MTsgJG5vdz1jdXJyZW50X3RpbWUoJ215c3FsJyk7ICRvPWFycmF5KCk7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJLy8gQTogc3VueXMsIHBpbG5hcyBhdHZlamlzIChzdm9yaXMgKyBzdXNpZXRhcyBtYWlzdGFzKQoJCSR3cGRiLT5pbnNlcnQoJHBmLidwc19wZXRzJyxhcnJheSgndXNlcl9pZCc9PiRhaWQsJ3BldF9uYW1lJz0+J0UyRSBTYXJnaXMnLCdzcGVjaWVzJz0+J2RvZycsJ2xpZmVfc3RhZ2UnPT4nYWR1bHQnLCdkb2dfc2l6ZSc9PidsYXJnZScsJ3N0YXR1cyc9PidhY3RpdmUnLCdjdXJyZW50X3dlaWdodF9rZyc9PjI1LjUsJ3dlaWdodF91cGRhdGVkX2F0Jz0+JG5vdywncHJpbWFyeV9wcm9kdWN0X2lkJz0+MTgwMTQsJ3ByaW1hcnlfcHJvZHVjdF9uYW1lJz0+J0pvc2VyYSBOYXR1cmUgZW5lcmdldGljIDEyLDUga2cnLCdwcmltYXJ5X3Byb2R1Y3RfcGFja2FnZSc9PicxMiw1IGtnJywnY3JlYXRlZF9hdCc9PiRub3csJ3VwZGF0ZWRfYXQnPT4kbm93KSk7CgkJJG9bJ0EnXT0oaW50KSR3cGRiLT5pbnNlcnRfaWQ7CgkJLy8gQjogcm9wbHlzLCBtaW5pbWFsdXMgYXR2ZWppcyAoYmUgc3ZvcmlvLCBiZSBtYWlzdG8sIHRpa2V0aW5hIGJlIHR1cmluaW8pCgkJJHdwZGItPmluc2VydCgkcGYuJ3BzX3BldHMnLGFycmF5KCd1c2VyX2lkJz0+JGFpZCwncGV0X25hbWUnPT4nRTJFIFJvcGxpdWthcycsJ3NwZWNpZXMnPT4ncmVwdGlsZScsJ3N0YXR1cyc9PidhY3RpdmUnLCdjcmVhdGVkX2F0Jz0+JG5vdywndXBkYXRlZF9hdCc9PiRub3cpKTsKCQkkb1snQiddPShpbnQpJHdwZGItPmluc2VydF9pZDsKCQllY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKCX0KCWlmKGlzc2V0KCRfR0VUWydwc19lMmVjbGVhbiddKSYmJF9HRVRbJ3BzX2UyZWNsZWFuJ109PT0nRTJlVG1wOXgnKXsKCQlnbG9iYWwgJHdwZGI7JHBmPSR3cGRiLT5wcmVmaXg7CgkJJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIGlkIEZST00geyRwZn1wc19wZXRzIFdIRVJFIHBldF9uYW1lIExJS0UgJ0UyRSUnIik7CgkJZm9yZWFjaCgkaWRzIGFzICRpKXsgJHdwZGItPmRlbGV0ZSgkcGYuJ3BzX3BldF9wcm9kdWN0cycsYXJyYXkoJ3BldF9pZCc9PiRpKSk7ICR3cGRiLT5kZWxldGUoJHBmLidwc19wZXRzJyxhcnJheSgnaWQnPT4kaSkpOyB9CgkJZWNobyBqc29uX2VuY29kZShhcnJheSgnaXN0cmludGEnPT5jb3VudCgkaWRzKSkpOyBleGl0OwoJfQp9KTsK';
const TOKG=process.env.GH_TOKEN, REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const U=process.env.WP_USER||'', P=(process.env.WP_APP_PASS||'').replace(/\s+/g,'');
const AUTH='-u "'+U+':'+P+'"';
function wj(m,path,body){fs.writeFileSync('/tmp/wb.json', JSON.stringify(body));
  return execSync('curl -sk '+AUTH+' -X '+m+' -H "Content-Type: application/json" --data-binary @/tmp/wb.json "https://dev.avesa.lt/wp-json/'+path+'"',{maxBuffer:50*1024*1024,timeout:70000}).toString();}
function putB64(name,b64){const u='https://api.github.com/repos/'+REPO+'/contents/screenshots/'+name;let s='';
 for(let i=0;i<5;i++){try{const j=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+TOKG+'" "'+u+'?n='+Math.random()+'"').toString());if(j.sha)s=j.sha;}catch(e){}
  fs.writeFileSync('/tmp/pj.json',JSON.stringify({message:'r',content:b64,...(s?{sha:s}:{})}));
  const c=execSync('curl -s -o /dev/null -w "%{http_code}" -X PUT -H "Authorization: Bearer '+TOKG+'" -d @/tmp/pj.json "'+u+'"').toString().trim();
  if(c==='200'||c==='201')return c; execSync('sleep 2');}return 'fail';}
const o={steps:[],console:[]};
const mk=wj('POST','code-snippets/v1/snippets',{name:'PREP (temp)',code:Buffer.from(S,'base64').toString('utf8'),scope:'front-end',active:true,priority:5});
let sid; try{sid=JSON.parse(mk).id;}catch(e){o.mkerr=String(mk).slice(0,150);}
execSync('sleep 3');
try{const r=execSync('curl -sk "https://dev.avesa.lt/?ps_e2eprep=E2eTmp9x"',{timeout:40000}).toString();o.prep=r.slice(r.indexOf('{'),r.indexOf('}')+1);}catch(e){o.prep='ERR';}
try{
  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const ctx = await browser.newContext({viewport:{width:1440,height:1100}, ignoreHTTPSErrors:true});
  const page = await ctx.newPage();
  page.on('console', m=>{ if(m.type()==='error') o.console.push(m.text().slice(0,140)); });
  page.on('pageerror', e=>o.console.push('PAGEERROR: '+String(e).slice(0,140)));
  const shot=async(n)=>{ const b=await page.screenshot({fullPage:true}); putB64(n+'.png', b.toString('base64')); o.steps.push(n); };
  const gap=async()=>await page.evaluate(()=>{const s=document.querySelector('.pspet-content-slot');
    if(!s) return 'nera elemento'; const r=s.getBoundingClientRect(); return {h:Math.round(r.height), vaiku:s.children.length};});
  const clickPet=async(name)=>await page.evaluate((n)=>{const t=[...document.querySelectorAll('.pspet-switch-item,.pspet-switcher *,button,div')].find(x=>x.textContent.trim().startsWith(n)&&x.offsetParent);if(t){t.click();return true;}return false;},name);

  await page.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await page.waitForTimeout(2000);
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>/^PRIIMTI$/i.test(x.textContent.trim()));if(b)b.click();});
  await page.waitForTimeout(2500);
  // 1 desktop pilnas (E2E Sargis)
  await clickPet('E2E Sargis'); await page.waitForTimeout(3000);
  o.gap_pilnas=await gap(); o.t1=(await page.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(200,520);
  await shot('v1_1_desktop_pilnas');
  // 5 Mitybos modulis
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Atidaryti maisto plan/i.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(4000); await shot('v1_5_mityba_modulis');
  o.t_mityba=(await page.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(200,500);
  // 6 grizti
  await page.evaluate(()=>{const b=[...document.querySelectorAll('button')].find(x=>/Gr\u012f\u017Eti \u012f augintinio/i.test(x.textContent));if(b)b.click();});
  await page.waitForTimeout(3000); await shot('v1_6_grizta');
  o.grizo=await page.evaluate(()=>/Atidaryti maisto plan/i.test(document.body.innerText));
  // 2 desktop minimalus (E2E Ropliukas)
  await clickPet('E2E Ropliukas'); await page.waitForTimeout(3000);
  o.gap_minimalus=await gap(); o.t2=(await page.evaluate(()=>document.body.innerText)).replace(/\s+/g,' ').slice(200,520);
  await shot('v1_2_desktop_minimalus');
  // 7 persijungimas atgal
  await clickPet('E2E Sargis'); await page.waitForTimeout(3000);
  o.persijunge=await page.evaluate(()=>/E2E Sargis/.test(document.body.innerText)&&!/Ropliukas/.test(document.querySelector('.pspet-profile')?document.querySelector('.pspet-profile').innerText:''));
  await shot('v1_7_persijungimas');
  // MOBILE
  const ctx2 = await browser.newContext({viewport:{width:390,height:900}, ignoreHTTPSErrors:true, isMobile:true, hasTouch:true, deviceScaleFactor:2});
  const p2 = await ctx2.newPage();
  await p2.goto('https://dev.avesa.lt/?ps_alogin=E2eTmp9x',{waitUntil:'networkidle',timeout:60000});
  await p2.waitForTimeout(2000);
  await p2.evaluate(()=>{const b=[...document.querySelectorAll('button,a')].find(x=>/^PRIIMTI$/i.test(x.textContent.trim()));if(b)b.click();});
  await p2.waitForTimeout(2500);
  await p2.evaluate(()=>{const t=[...document.querySelectorAll('button,div')].find(x=>x.textContent.trim().startsWith('E2E Sargis')&&x.offsetParent);if(t)t.click();});
  await p2.waitForTimeout(3000);
  { const b=await p2.screenshot({fullPage:true}); putB64('v1_3_mobile_pilnas.png', b.toString('base64')); o.steps.push('v1_3_mobile_pilnas'); }
  await p2.evaluate(()=>{const t=[...document.querySelectorAll('button,div')].find(x=>x.textContent.trim().startsWith('E2E Ropliukas')&&x.offsetParent);if(t)t.click();});
  await p2.waitForTimeout(3000);
  { const b=await p2.screenshot({fullPage:true}); putB64('v1_4_mobile_minimalus.png', b.toString('base64')); o.steps.push('v1_4_mobile_minimalus'); }
  await browser.close();
}catch(e){ o.err=String(e).slice(0,300); }
try{const c=execSync('curl -sk "https://dev.avesa.lt/?ps_e2eclean=E2eTmp9x"',{timeout:30000}).toString();o.clean=c.slice(c.indexOf('{'),c.indexOf('}')+1);}catch(e){}
if(sid){ try{wj('POST','code-snippets/v1/snippets/'+sid,{active:false});}catch(e){} try{execSync('curl -sk '+AUTH+' -X DELETE "https://dev.avesa.lt/wp-json/code-snippets/v1/snippets/'+sid+'"');}catch(e){} }
putB64('v1chk.json', Buffer.from(JSON.stringify(o)).toString('base64'));
console.log('done');
