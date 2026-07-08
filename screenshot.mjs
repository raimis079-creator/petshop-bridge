import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const BODY=Buffer.from("PHN0eWxlPgoucGstZ3JpZHtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjVmciA3ZnI7Z2FwOjMycHg7bWFyZ2luOjhweCAwIDMycHh9Ci5way1sZWZ0IGgye21hcmdpbi10b3A6MH0KLnBrLWJveHtiYWNrZ3JvdW5kOiNGN0Y3RjU7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzoyMHB4IDI0cHg7bWFyZ2luOjAgMCAxNnB4fQoucGstYm94IHB7bWFyZ2luOjAgMCA4cHh9Ci5way1ib3ggcDpsYXN0LWNoaWxke21hcmdpbjowfQoucGstdGVse2ZvbnQtc2l6ZToxLjI1cmVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojMkQ1RjNGfQoucGstdGVsIGF7Y29sb3I6IzJENUYzRjt0ZXh0LWRlY29yYXRpb246bm9uZX0KLnBrLWZvcm17YmFja2dyb3VuZDojZmZmO2JvcmRlcjoxcHggc29saWQgI0U1RTdFQjtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjI0cHggMjhweH0KLnBrLWZvcm0gaDJ7bWFyZ2luLXRvcDowfQoucGstbm90ZXtjb2xvcjojNmI3MjgwO2ZvbnQtc2l6ZTowLjlyZW19CkBtZWRpYShtYXgtd2lkdGg6NzY4cHgpey5way1ncmlke2dyaWQtdGVtcGxhdGUtY29sdW1uczoxZnJ9fQo8L3N0eWxlPgoKPGRpdiBjbGFzcz0icGstZ3JpZCI+CiAgPGRpdiBjbGFzcz0icGstbGVmdCI+CiAgICA8aDI+S29udGFrdGFpPC9oMj4KICAgIDxkaXYgY2xhc3M9InBrLWJveCI+CiAgICAgIDxwIGNsYXNzPSJway10ZWwiPjxhIGhyZWY9InRlbDorMzcwNjgxODc3ODciPiszNzAgNjgxIDg3Nzg3PC9hPjwvcD4KICAgICAgPHA+PHN0cm9uZz5EYXJibyBsYWlrYXM6PC9zdHJvbmc+PGJyPknigJNWIDA5OjAw4oCTMTg6MDA8YnI+VkkgMTA6MDDigJMxNTowMDwvcD4KICAgICAgPHAgY2xhc3M9InBrLW5vdGUiPlXFvmtsYXVzYXMgc2nFs3NraXRlIHBlciBrb250YWt0aW7EmSBmb3JtxIUg4oCTIGF0c2Frb21lIGVsLiBwYcWhdHUuPC9wPgogICAgPC9kaXY+CiAgICA8aDI+UmVrdml6aXRhaTwvaDI+CiAgICA8ZGl2IGNsYXNzPSJway1ib3giPgogICAgICA8cD48c3Ryb25nPsSubW9uxJdzIHBhdmFkaW5pbWFzOjwvc3Ryb25nPiBVQUIg4oCeQXZlc2EiPC9wPgogICAgICA8cD48c3Ryb25nPsSubW9uxJdzIGtvZGFzOjwvc3Ryb25nPiAzMDI1Njg0NDI8L3A+CiAgICAgIDxwPjxzdHJvbmc+UFZNIGtvZGFzOjwvc3Ryb25nPiBMVDEwMDAwNTc2ODUxOTwvcD4KICAgICAgPHA+PHN0cm9uZz5KdXJpZGluaXMgYWRyZXNhczo8L3N0cm9uZz48YnI+TGl1Y2lvbmnFsyBnLiA0NiwgTGl1Y2lvbmnFsyBrLiw8YnI+TmVtZW7EjWluxJdzIHNlbi4sIFZpbG5pYXVzIHIuLCBMVC0xNTE2NjwvcD4KICAgIDwvZGl2PgogIDwvZGl2PgogIDxkaXYgY2xhc3M9InBrLWZvcm0iPgogICAgPGgyPlN1c2lzaWVraXRlIHN1IG11bWlzPC9oMj4KICAgIFt3cGZvcm1zIGlkPSIzNDUyMCJdCiAgPC9kaXY+CjwvZGl2Pgo=","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'kk',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 60 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:70000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  // 1. ar kontaktai jau yra?
  const exist=get('/wp-json/wp/v2/pages?slug=kontaktai&status=any&_fields=id,slug,status');
  let existId=0; try{ const a=JSON.parse(exist); if(Array.isArray(a)&&a.length) existId=a[0].id; }catch(e){}
  let pageId=existId;
  if(existId){ const u=api('/wp-json/wp/v2/pages/'+existId,'POST',{title:'Kontaktai',content:BODY,status:'publish'}); out.action='updated'; }
  else { const c=api('/wp-json/wp/v2/pages','POST',{title:'Kontaktai',slug:'kontaktai',content:BODY,status:'publish'}); out.action='created'; try{ pageId=JSON.parse(c).id; }catch(e){} }
  out.pageId=pageId;
  // 2. QA
  const html=get('/kontaktai/?nc='+Date.now());
  out.http=html==='EXC'?'EXC':'200-ish';
  out.has_form=html.indexOf('wpforms-form')>=0 || html.indexOf('wpforms-container')>=0;
  out.has_tel=html.indexOf('tel:+37068187787')>=0;
  out.has_rekv=html.indexOf('302568442')>=0;
  out.has_submit=html.indexOf('Siųsti užklausą')>=0;
  out.no_bank=html.indexOf('LT127300010124940593')<0;
  out.footer1_hidden=html.indexOf('.footer-widgets.footer.footer-1{display:none')>=0;
  // 3. screenshot
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1600} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/kontaktai/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3500);
  const buf = await page.screenshot({ fullPage:true });
  putBin('kontaktai_v1.png', buf);
  await browser.close();
  putFile('mkkontaktai.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
