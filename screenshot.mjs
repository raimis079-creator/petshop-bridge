import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJ5Zml4Il0pIHx8ICRfR0VUWyJ5Zml4Il0gIT09ICJwczIwMjYiKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRsb2cgPSBhcnJheSgpOwogIC8vIDEuIFlJVEggdHJhbnNpZW50YWkKICAkZDEgPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF8leWl0aCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfdGltZW91dF8leWl0aCUnIik7CiAgJGxvZ1sieWl0aF90cmFuc2llbnRzX2RlbGV0ZWQiXSA9ICRkMTsKICAvLyAyLiBXQyB0ZXJtIGNvdW50ICsgcXVlcnkgdHJhbnNpZW50YWkKICAkZDIgPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF93Y190ZXJtX2NvdW50cyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ190cmFuc2llbnRfdGltZW91dF93Y190ZXJtX2NvdW50cyUnIik7CiAgJGxvZ1sid2NfdGVybV9jb3VudHNfZGVsZXRlZCJdID0gJGQyOwogICRkMyA9ICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICdfdHJhbnNpZW50X3djX2xheWVyZWRfbmF2JScgT1Igb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF8leWl0aF93Y2FuJSciKTsKICAkbG9nWyJsYXllcmVkX25hdl9kZWxldGVkIl0gPSAkZDM7CiAgLy8gMy4gb2JqZWN0IGNhY2hlIGZsdXNoCiAgd3BfY2FjaGVfZmx1c2goKTsKICAkbG9nWyJjYWNoZV9mbHVzaGVkIl0gPSB0cnVlOwogIC8vIDQuIHBlcmlzc2F1Z29tIHByZXNldGEgMzQwNjMgKHRyaWdnZXJpbmEgWUlUSCBzYXZlIGhvb2tzICsgY2FjaGUgcmVidWlsZCkKICAkZmlsdGVycyA9IGdldF9wb3N0X21ldGEoMzQwNjMsICJfZmlsdGVycyIsIHRydWUpOwogIGlmKGlzX2FycmF5KCRmaWx0ZXJzKSl7CiAgICB1cGRhdGVfcG9zdF9tZXRhKDM0MDYzLCAiX2ZpbHRlcnMiLCAkZmlsdGVycyk7IC8vIHRhcyBwYXRzIGRhdGEsIGJldCB0cmlnZ2VyJ2luYSBob29rcwogICAgLy8gdGFpcCBwYXQgdHJpZ2dlciBjbGVhbl9wb3N0X2NhY2hlCiAgICBjbGVhbl9wb3N0X2NhY2hlKDM0MDYzKTsKICAgICRsb2dbInByZXNldF9yZXNhdmVkIl0gPSBjb3VudCgkZmlsdGVycyk7CiAgfQogIC8vIDUuIFdDIHRyYW5zaWVudHUgdmFseW1hcyBwZXIgQVBJCiAgaWYoZnVuY3Rpb25fZXhpc3RzKCJ3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzIikpeyB3Y19kZWxldGVfcHJvZHVjdF90cmFuc2llbnRzKCk7ICRsb2dbIndjX3RyYW5zaWVudHMiXT0ib2siOyB9CiAgLy8gNi4gaGFyZCBmbHVzaCByZXdyaXRlIHJ1bGVzCiAgZmx1c2hfcmV3cml0ZV9ydWxlcyh0cnVlKTsKICAkbG9nWyJyZXdyaXRlc19mbHVzaGVkIl0gPSB0cnVlOwogICR1cCA9IHdwX3VwbG9hZF9kaXIoKTsKICBmaWxlX3B1dF9jb250ZW50cygkdXBbImJhc2VkaXIiXS4iL3lmaXhfcmVzdWx0Lmpzb24iLCB3cF9qc29uX2VuY29kZSgkbG9nKSk7CiAgd3BfZGllKCJZRklYX0RPTkUiKTsKfSk7","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yf',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 50 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:55000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP yfix',code:PHP,scope:'global',active:false});
  let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
  out.sid=sid; out.err=err;
  if(sid && !err){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    get('/?yfix=ps2026');
    out.result=get('/wp-content/uploads/yfix_result.json').slice(0,800);
    api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  }
  // re-check frontend filtru reiksmes
  await new Promise(r=>setTimeout(r,3000));
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1400} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(4000);
  out.filterValues = await page.evaluate(()=>{
    const all=[];
    document.querySelectorAll('aside, .sidebar, #secondary, .shop-sidebar').forEach(sb=>{
      sb.querySelectorAll('h3,h4,.widget-title,.yith-wcan-filter-title').forEach(h=>{
        const title=h.innerText.trim();
        let values=[];
        let sib=h.closest('.widget, .yith-wcan-filter')||h.parentElement;
        if(sib){ sib.querySelectorAll('label,a,.term-name,li').forEach(l=>{ const t=l.innerText.trim(); if(t&&t.length<40) values.push(t); }); }
        if(title) all.push({title, values:[...new Set(values)].slice(0,14)});
      });
    });
    return all;
  });
  putBin('yfix_check.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:400,height:1000} }));
  await browser.close();
  putFile('runyfix.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
