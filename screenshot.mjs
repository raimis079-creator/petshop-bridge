import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJsb29rdXBmaXgyIl0pIHx8ICRfR0VUWyJsb29rdXBmaXgyIl0gIT09ICJwczIwMjYiKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRsb2cgPSBhcnJheSgpOwogIC8vIDEuIFVwZGF0ZSB3Y19wcm9kdWN0X2F0dHJpYnV0ZXNfbG9va3VwOiBwYV9iZS1ncnVkdSAtPiBwYV9iZV9ncnVkdQogICRyMSA9ICR3cGRiLT51cGRhdGUoJHdwZGItPnByZWZpeC4id2NfcHJvZHVjdF9hdHRyaWJ1dGVzX2xvb2t1cCIsIGFycmF5KCJ0YXhvbm9teSI9PiJwYV9iZV9ncnVkdSIpLCBhcnJheSgidGF4b25vbXkiPT4icGFfYmUtZ3J1ZHUiKSk7CiAgJGxvZ1sidXBkYXRlZF9iZyJdID0gJHIxOwogICRyMiA9ICR3cGRiLT51cGRhdGUoJHdwZGItPnByZWZpeC4id2NfcHJvZHVjdF9hdHRyaWJ1dGVzX2xvb2t1cCIsIGFycmF5KCJ0YXhvbm9teSI9PiJwYV9zcGVjaWFsaV9taXR5YmEiKSwgYXJyYXkoInRheG9ub215Ij0+InBhX3NwZWNpYWxpLW1pdHliYSIpKTsKICAkbG9nWyJ1cGRhdGVkX3NtIl0gPSAkcjI7CiAgLy8gMi4gY2xlYXIgY2FjaGUKICB3cF9jYWNoZV9mbHVzaCgpOwogIGlmKGZ1bmN0aW9uX2V4aXN0cygid2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cyIpKSB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCk7CiAgZGVsZXRlX3RyYW5zaWVudCgid2NfYXR0cmlidXRlX3RheG9ub21pZXMiKTsKICBmbHVzaF9yZXdyaXRlX3J1bGVzKHRydWUpOwogICRsb2dbImRvbmUiXSA9IHRydWU7CiAgLy8gMy4gcGF0dmlydGluaW1hcwogICRsb2dbImxvb2t1cF9iZ19hZnRlciJdID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2NfcHJvZHVjdF9hdHRyaWJ1dGVzX2xvb2t1cCBXSEVSRSB0YXhvbm9teSA9IFwicGFfYmVfZ3J1ZHVcIiIpOwogICRsb2dbImxvb2t1cF9zbV9hZnRlciJdID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2NfcHJvZHVjdF9hdHRyaWJ1dGVzX2xvb2t1cCBXSEVSRSB0YXhvbm9teSA9IFwicGFfc3BlY2lhbGlfbWl0eWJhXCIiKTsKICAkdXAgPSB3cF91cGxvYWRfZGlyKCk7CiAgZmlsZV9wdXRfY29udGVudHMoJHVwWyJiYXNlZGlyIl0uIi9sb29rdXBmaXgyX3Jlc3VsdC5qc29uIiwgd3BfanNvbl9lbmNvZGUoJGxvZykpOwogIHdwX2RpZSgiTE9PS1VQRklYMl9ET05FIik7Cn0pOw==","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'lf2',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 60 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:65000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP lookupfix2',code:PHP,scope:'global',active:false});
  let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
  out.sid=sid; out.err=err;
  if(sid && !err){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    get('/?lookupfix2=ps2026');
    out.result=get('/wp-content/uploads/lookupfix2_result.json').slice(0,1500);
    api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  }
  await new Promise(r=>setTimeout(r,4000));
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1600} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(4000);
  out.filters = await page.evaluate(()=>{
    const arr=[];
    document.querySelectorAll('.yith-wcan-filter').forEach(f=>{
      const tax=f.getAttribute('data-taxonomy')||'';
      const title=(f.querySelector('.yith-wcan-filter-title')||{}).innerText||'';
      const terms=[]; f.querySelectorAll('.term,li,label').forEach(t=>{const l=(t.innerText||'').trim();if(l&&l.length<40)terms.push(l);});
      arr.push({title:title.trim(), tax, terms:[...new Set(terms)].slice(0,15)});
    });
    return arr;
  });
  putBin('finalfix_desktop.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:500,height:1600} }));
  await browser.close();
  putFile('runlookupfix2.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
