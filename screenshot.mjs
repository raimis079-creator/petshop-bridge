const USER=process.env.WP_USER.trim(),PASS=process.env.WP_APP_PASS.trim();
const AUTH='Basic '+Buffer.from(USER+':'+PASS).toString('base64');
const BASE='https://dev.avesa.lt/wp-json/code-snippets/v1/snippets';
const TOK=process.env.GH_TOKEN;
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const T='aWYoIWRlZmluZWQoJ0FCU1BBVEgnKSlyZXR1cm47CmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoKCRfR0VUWydwc190NjQ1J10/PycnKSE9PSdUNjQ1eCcpIHJldHVybjsKICBpZighKCBjdXJyZW50X3VzZXJfY2FuKCdtYW5hZ2Vfb3B0aW9ucycpIHx8ICgoJF9HRVRbJ2snXT8/JycpPT09J3BzMjAyNicpICkpIHJldHVybjsKICBpZighaGVhZGVyc19zZW50KCkpeyBub2NhY2hlX2hlYWRlcnMoKTsgaGVhZGVyKCdDb250ZW50LVR5cGU6YXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyB9CiAgQHNldF90aW1lX2xpbWl0KDI1MCk7CiAgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkdD0kd3BkYi0+cHJlZml4Lidwc19zb3VyY2VzJzsKICAkbz1hcnJheSgndic9PidUNjQ1Jyk7CgogIC8vIDEpIE1BTk8gVEVTVE8gQVJURUZBS1RBUzogcHJla2UgMTI4MTQgZ2F2byB2ZiBpcmFzYSBpc19hY3RpdmU9MCwga3VyaW8gbmVidXZvLgogIC8vICAgIFNhbGluYW0gVElLIGppIOKAlCB0aWtzbGlhaSBhcGlicmV6dGEgZWlsdXRlLCBrdXJpYSBwYXRzIGthIHRpayBzdWt1cmlhdS4KICAkcHJpZXMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxwcm9kdWN0X2lkLHNvdXJjZSxpc19hY3RpdmUgRlJPTSB7JHR9IFdIRVJFIHByb2R1Y3RfaWQ9MTI4MTQiLCBBUlJBWV9BKTsKICAkb1snMTI4MTRfcHJpZXMnXSA9ICRwcmllczsKICBpZiAoaXNzZXQoJF9HRVRbJ3ZhbHlrJ10pICYmICRfR0VUWyd2YWx5ayddPT09J3RhaXAnKSB7CiAgICAkb1snaXN0cmludGEnXSA9ICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR0fSBXSEVSRSBwcm9kdWN0X2lkPTEyODE0IEFORCBzb3VyY2U9J3ZmJyBBTkQgaXNfYWN0aXZlPTAiKTsKICAgICRvWycxMjgxNF9wbyddID0gJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQscHJvZHVjdF9pZCxzb3VyY2UsaXNfYWN0aXZlIEZST00geyR0fSBXSEVSRSBwcm9kdWN0X2lkPTEyODE0IiwgQVJSQVlfQSk7CiAgfQoKICAvLyAyKSBLVVJJT1MgcHJla2VzIHR1cmkgU0VOVVMgKD4yNCB2YWwuKSB0aWVrZWpvIGR1b21lbmlzCiAgJGlkcyA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgSUQgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIik7CiAgJHNlbmk9YXJyYXkoKTsgJGRhYmFyPWN1cnJlbnRfdGltZSgndGltZXN0YW1wJyk7CiAgZm9yZWFjaCgkaWRzIGFzICRwaWQpewogICAgJHggPSBQZXRzaG9wX1NvdXJjZXM6OnNhbHRpbmlhaSgkcGlkKTsKICAgIGZvcmVhY2goJHhbJ3NhbHRpbmlhaSddIGFzICRzKXsKICAgICAgaWYoJHNbJ3NvdXJjZSddPT09J2F2JykgY29udGludWU7CiAgICAgIGlmKCFpbl9hcnJheSgkc1snc291cmNlJ10sIGFycmF5KCd2ZicsJ3piJyksIHRydWUpKSBjb250aW51ZTsKICAgICAgJGFtej1udWxsOwogICAgICBpZighZW1wdHkoJHNbJ3N5bmNlZF9hdCddKSAmJiAkc1snc3luY2VkX2F0J10hPT0nMDAwMC0wMC0wMCAwMDowMDowMCcpewogICAgICAgICR0cz1zdHJ0b3RpbWUoJHNbJ3N5bmNlZF9hdCddKTsgaWYoJHRzKSAkYW16PSgkZGFiYXItJHRzKS8zNjAwOwogICAgICB9CiAgICAgIGlmKCRhbXo9PT1udWxsIHx8ICRhbXo+MjQpewogICAgICAgICRzZW5pW10gPSBhcnJheSgnaWQnPT4kcGlkLCdwYXYnPT5tYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKGdldF90aGVfdGl0bGUoJHBpZCkpLDAsNDIpLAogICAgICAgICAgJ3NhbHRpbmlzJz0+JHNbJ3NvdXJjZSddLCdzeW5jJz0+JHNbJ3N5bmNlZF9hdCddLCdhbXppdXNfdmFsJz0+JGFtej09PW51bGw/bnVsbDpyb3VuZCgkYW16LDEpLAogICAgICAgICAgJ3RpZWtlam9fbGlrdXRpcyc9PiRzWydzdG9ja19xdHknXSwnZGFiYXJfc3RvY2snPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19zdG9jaycsdHJ1ZSksCiAgICAgICAgICAncGFyZHVvZGFtYV9kYWJhcic9PlBldHNob3BfU3RvY2tfU2VydmljZTo6cXR5KCRwaWQpKTsKICAgICAgfQogICAgfQogIH0KICAkb1snU0VOSV9EVU9NRU5ZUyddID0gYXJyYXkoJ2tpZWsnPT5jb3VudCgkc2VuaSksJ3NhcmFzYXMnPT4kc2VuaSk7CgogIC8vIDMpIEdhbHV0aW5lIGtyeXptaW5lCiAgJG9bJ3JlZ2lzdHJhc192aXNvJ10gPSAoaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHR9Iik7CiAgJG9bJ3JlZ2lzdHJhc19uZWFrdHl2dXMnXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdH0gV0hFUkUgaXNfYWN0aXZlPTAiKTsKICAkb1sncHJla2l1X2JlX3NhbHRpbmlvJ10gPSBjb3VudChQZXRzaG9wX1NvdXJjZXM6OmJlX3NhbHRpbmlvX3NhcmFzYXMoNTAwKSk7CiAgJG9bJ3p6X3Rlc3RfcHJla2UnXSA9ICR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X3N0YXR1cyBGUk9NIHskcH1wb3N0cyBXSEVSRSBwb3N0X3RpdGxlIExJS0UgJ1paIFRFU1QgUzY0NCUnIiwgQVJSQVlfQSk7CgogIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QUkVUVFlfUFJJTlQpOyBleGl0Owp9LCAzKTsK';
async function putResult(name,obj){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/screenshots/'+name;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const body={message:'r '+name,content:Buffer.from(JSON.stringify(obj,null,1)).toString('base64')};
  if(sha) body.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('putResult',name,r.status);
}
async function putFile(path,buf,msg){
  const url='https://api.github.com/repos/raimis079-creator/petshop-bridge/contents/'+path;
  let sha;const g=await fetch(url,{headers:{Authorization:'Bearer '+TOK}});
  if(g.status===200) sha=(await g.json()).sha;
  const body={message:msg,content:buf.toString('base64')}; if(sha) body.sha=sha;
  const r=await fetch(url,{method:'PUT',headers:{Authorization:'Bearer '+TOK,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('putFile',path,r.status);
}
const out={version:'S645-V1',errors:[]};
let id=null;
try{
  const r=await fetch(BASE,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP Valymas ir Seni Duomenys (S645)',code:Buffer.from(T,'base64').toString('utf8'),scope:'global',active:true,priority:11})});
  const j=await r.json(); id=j.id; out.snip=j.id;
}catch(e){out.errors.push(String(e));}
if(id){
  await new Promise(x=>setTimeout(x,3000));
  try{
    const rr=await fetch('https://dev.avesa.lt/?ps_t645=T645x&k=ps2026&valyk=taip&cb='+Date.now(),{headers:{'User-Agent':'Mozilla/5.0'}});
    const t=await rr.text();
    try{out.rez=JSON.parse(t);}catch(e){out.raw=t.slice(0,3000);}
  }catch(e){out.errors.push(String(e));}
  await fetch(BASE+'/'+id,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.isjungta=(await(await fetch(BASE+'/'+id,{headers:{Authorization:AUTH}})).json()).active;
}
// VIZUALINE PATIKRA
try{
  const {chromium}=await import('playwright');
  const br=await chromium.launch();
  const pg=await br.newPage({viewport:{width:1400,height:1000},ignoreHTTPSErrors:true});
  const errs=[]; pg.on('pageerror',e=>errs.push(String(e)));
  await pg.goto('https://dev.avesa.lt/kategorija/sunims/maistas-sunims/sausas-maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000});
  await pg.waitForTimeout(4000);
  await putFile('screenshots/s645_katalogas.png', await pg.screenshot(), 'S645 katalogas');
  out.katalogas={js:errs.length, prekiu: await pg.evaluate(()=>document.querySelectorAll('.product-small, li.product').length)};
  // prekes puslapis
  await pg.goto('https://dev.avesa.lt/preke/josera-sensiplus-125-kg-sausas-maistas-sunims/',{waitUntil:'domcontentloaded',timeout:60000}).catch(()=>{});
  await pg.waitForTimeout(3000);
  await putFile('screenshots/s645_preke.png', await pg.screenshot(), 'S645 preke');
  out.preke={url:pg.url(), js:errs.length,
    stock: await pg.evaluate(()=>{const e=document.querySelector('.stock, p.stock'); return e?e.textContent.trim().slice(0,60):null;}),
    kaina: await pg.evaluate(()=>{const e=document.querySelector('.price'); return e?e.textContent.trim().slice(0,50):null;})};
  out.js_klaidos=errs;
  await br.close();
}catch(e){out.errors.push({s:'shot',e:String(e)});}
await putResult('s645_v1.json',out);
console.log('DONE');
