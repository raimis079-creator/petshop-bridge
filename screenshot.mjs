import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncGtleSddKSB8fCAkX0dFVFsncGtleSddICE9PSAnZml4XzNjOCcpIHsgcmV0dXJuOyB9CiAgJGZpZCA9IChpbnQpIGdldF9vcHRpb24oJ3BldHNob3BfY29udGFjdF9mb3JtX2lkJyk7CiAgJHJlcyA9IGFycmF5KCdmaWQnPT4kZmlkKTsKICBpZiAoJGZpZCkgewogICAgJHBvc3QgPSBnZXRfcG9zdCgkZmlkKTsKICAgIGlmICgkcG9zdCkgewogICAgICAkZGF0YSA9IGpzb25fZGVjb2RlKCRwb3N0LT5wb3N0X2NvbnRlbnQsIHRydWUpOwogICAgICBpZiAoaXNfYXJyYXkoJGRhdGEpICYmIGlzc2V0KCRkYXRhWydmaWVsZHMnXVszXVsnY2hvaWNlcyddWzFdWydsYWJlbCddKSkgewogICAgICAgICRyZXNbJ29sZF9sYWJlbCddID0gJGRhdGFbJ2ZpZWxkcyddWzNdWydjaG9pY2VzJ11bMV1bJ2xhYmVsJ107CiAgICAgICAgJGRhdGFbJ2ZpZWxkcyddWzNdWydjaG9pY2VzJ11bMV1bJ2xhYmVsJ10gPSAnU3V0aW5rdSwga2FkIG1hbm8gcGF0ZWlrdGkgZHVvbWVueXMgYsWrdMWzIG5hdWRvamFtaSBhdHNha3l0aSDEryBtYW5vIHXFvmtsYXVzxIUuJzsKICAgICAgICB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kZmlkLCAncG9zdF9jb250ZW50Jz0+d3Bfc2xhc2god3BfanNvbl9lbmNvZGUoJGRhdGEpKSkpOwogICAgICAgICRjaGsgPSBqc29uX2RlY29kZShnZXRfcG9zdCgkZmlkKS0+cG9zdF9jb250ZW50LCB0cnVlKTsKICAgICAgICAkcmVzWyduZXdfbGFiZWwnXSA9ICRjaGtbJ2ZpZWxkcyddWzNdWydjaG9pY2VzJ11bMV1bJ2xhYmVsJ107CiAgICAgIH0gZWxzZSB7ICRyZXNbJ2VyciddID0gJ3N0cnVrdHVyYSBuZXJhc3RhJzsgfQogICAgfSBlbHNlIHsgJHJlc1snZXJyJ10gPSAncG9zdCBuZXJhc3Rhcyc7IH0KICB9IGVsc2UgeyAkcmVzWydlcnInXSA9ICdvcHRpb24gbmVyYXN0YXMnOyB9CiAgJHVwID0gd3BfdXBsb2FkX2RpcigpOwogIGZpbGVfcHV0X2NvbnRlbnRzKCR1cFsnYmFzZWRpciddLicvZml4Zm9ybV9yZXN1bHRfeDguanNvbicsIHdwX2pzb25fZW5jb2RlKCRyZXMpKTsKICB3cF9kaWUoJ0ZJWEZPUk1fRE9ORScpOwp9KTs=","base64").toString("utf8");
const BODY=Buffer.from("PHN0eWxlPgoucGstZ3JpZHtkaXNwbGF5OmdyaWQ7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjVmciA3ZnI7Z2FwOjMycHg7bWFyZ2luOjhweCAwIDMycHh9Ci5way1sZWZ0IGgye21hcmdpbi10b3A6MH0KLnBrLWJveHtiYWNrZ3JvdW5kOiNGN0Y3RjU7Ym9yZGVyLXJhZGl1czo4cHg7cGFkZGluZzoyMHB4IDI0cHg7bWFyZ2luOjAgMCAxNnB4fQoucGstYm94IHB7bWFyZ2luOjAgMCA4cHh9Ci5way1ib3ggcDpsYXN0LWNoaWxke21hcmdpbjowfQoucGstdGVse2ZvbnQtc2l6ZToxLjI1cmVtO2ZvbnQtd2VpZ2h0OjcwMDtjb2xvcjojMkQ1RjNGfQoucGstdGVsIGF7Y29sb3I6IzJENUYzRjt0ZXh0LWRlY29yYXRpb246bm9uZX0KLnBrLWZvcm17YmFja2dyb3VuZDojZmZmO2JvcmRlcjoxcHggc29saWQgI0U1RTdFQjtib3JkZXItcmFkaXVzOjhweDtwYWRkaW5nOjI0cHggMjhweH0KLnBrLWZvcm0gaDJ7bWFyZ2luLXRvcDowfQoucGstbm90ZXtjb2xvcjojNmI3MjgwO2ZvbnQtc2l6ZTowLjlyZW19Ci5way1mb3JtIC53cGZvcm1zLWNvbnRhaW5lciBpbnB1dFt0eXBlPXRleHRdLC5way1mb3JtIC53cGZvcm1zLWNvbnRhaW5lciBpbnB1dFt0eXBlPWVtYWlsXSwucGstZm9ybSAud3Bmb3Jtcy1jb250YWluZXIgdGV4dGFyZWF7d2lkdGg6MTAwJSAhaW1wb3J0YW50O21heC13aWR0aDoxMDAlICFpbXBvcnRhbnQ7Ym94LXNpemluZzpib3JkZXItYm94fQoucGstZm9ybSAud3Bmb3Jtcy1maWVsZHttYXJnaW4tYm90dG9tOjE2cHh9Ci5way1pbnRyb3ttYXJnaW46MCAwIDIwcHg7Y29sb3I6IzRiNTU2M30KQG1lZGlhKG1heC13aWR0aDo3NjhweCl7LnBrLWdyaWR7Z3JpZC10ZW1wbGF0ZS1jb2x1bW5zOjFmcn19Cjwvc3R5bGU+Cgo8ZGl2IGNsYXNzPSJway1ncmlkIj4KICA8ZGl2IGNsYXNzPSJway1sZWZ0Ij4KICAgIDxoMj5Lb250YWt0YWk8L2gyPgogICAgPHAgY2xhc3M9InBrLWludHJvIj5UdXJpdGUga2xhdXNpbcWzIGTEl2wgdcW+c2FreW1vLCBwcmlzdGF0eW1vIGFyIHByZWvEl3MgcGFzaXJpbmtpbW8/IFBhcmHFoXlraXRlIG11bXMg4oCTIGF0c2FreXNpbWUgZWwuIHBhxaF0dS48L3A+CiAgICA8ZGl2IGNsYXNzPSJway1ib3giPgogICAgICA8cCBjbGFzcz0icGstdGVsIj48YSBocmVmPSJ0ZWw6KzM3MDY4MTg3Nzg3Ij4rMzcwIDY4MSA4Nzc4NzwvYT48L3A+CiAgICAgIDxwPjxzdHJvbmc+RGFyYm8gbGFpa2FzOjwvc3Ryb25nPjxicj5J4oCTViAwOTowMOKAkzE4OjAwPGJyPlZJIDEwOjAw4oCTMTU6MDA8L3A+CiAgICAgIDxwIGNsYXNzPSJway1ub3RlIj5Vxb5rbGF1c2FzIHNpxbNza2l0ZSBwZXIga29udGFrdGluxJkgZm9ybcSFIOKAkyBhdHNha29tZSBlbC4gcGHFoXR1LjwvcD4KICAgIDwvZGl2PgogICAgPGgyPlJla3Zpeml0YWk8L2gyPgogICAgPGRpdiBjbGFzcz0icGstYm94Ij4KICAgICAgPHA+PHN0cm9uZz7Erm1vbsSXcyBwYXZhZGluaW1hczo8L3N0cm9uZz4gVUFCIOKAnkF2ZXNhIjwvcD4KICAgICAgPHA+PHN0cm9uZz7Erm1vbsSXcyBrb2Rhczo8L3N0cm9uZz4gMzAyNTY4NDQyPC9wPgogICAgICA8cD48c3Ryb25nPlBWTSBrb2Rhczo8L3N0cm9uZz4gTFQxMDAwMDU3Njg1MTk8L3A+CiAgICAgIDxwPjxzdHJvbmc+SnVyaWRpbmlzIGFkcmVzYXM6PC9zdHJvbmc+PGJyPkxpdWNpb25pxbMgZy4gNDYsIExpdWNpb25pxbMgay4sIE5lbWVuxI1pbsSXcyBzZW4uLCBWaWxuaWF1cyByLiwgTFQtMTUxNjY8L3A+CiAgICA8L2Rpdj4KICA8L2Rpdj4KICA8ZGl2IGNsYXNzPSJway1mb3JtIj4KICAgIDxoMj5TdXNpc2lla2l0ZSBzdSBtdW1pczwvaDI+CiAgICBbd3Bmb3JtcyBpZD0iMzQ1MjAiXQogIDwvZGl2Pgo8L2Rpdj4K","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'fx',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path,to){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time '+(to||60)+' "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:(to||60)*1000+10000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  // 1. checkbox label fix per snippet
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP fix form label',code:PHP,scope:'global',active:false});
  let sid=0; try{ sid=JSON.parse(c).id; }catch(e){}
  out.sid=sid;
  if(sid){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    get('/?pkey=fix_3c8',100);
    out.fix_result=get('/wp-content/uploads/fixform_result_x8.json',30).slice(0,400);
    api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  }
  // 2. puslapio HTML update
  api('/wp-json/wp/v2/pages/34521','POST',{content:BODY,status:'publish'});
  // 3. verify + screenshot
  const html=get('/kontaktai/?nc='+Date.now(),60);
  out.has_intro=html.indexOf('Turite klausimų')>=0;
  out.has_fullwidth=html.indexOf('width:100% !important')>=0;
  out.addr_oneline=html.indexOf('Liucionių g. 46, Liucionių k., Nemenčinės sen.')>=0;
  out.new_checkbox=html.indexOf('atsakyti į mano užklausą')>=0;
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1400} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/kontaktai/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(3500);
  const buf = await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:1280,height:1000} });
  putBin('kontaktai_v2.png', buf);
  await browser.close();
  putFile('fixall.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
