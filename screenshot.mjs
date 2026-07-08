import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJ3YXhmaXgiXSkgfHwgJF9HRVRbIndheGZpeCJdICE9PSAicHMyMDI2IikgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkbG9nID0gYXJyYXkoKTsKICAvLyAxLiBJc1RyaW5hbSBXQyBhdHJpYnV0dSB0YWtzb25vbWlqdSBjYWNoZSAoa2VsaW9zIHZlcnNpam9zKQogIGRlbGV0ZV90cmFuc2llbnQoIndjX2F0dHJpYnV0ZV90YXhvbm9taWVzIik7CiAgJGxvZ1sidHJhbnNpZW50X2RlbGV0ZWQiXSA9ICJ3Y19hdHRyaWJ1dGVfdGF4b25vbWllcyI7CiAgLy8gaXIgb3B0aW9uIGNhY2hlCiAgd3BfY2FjaGVfZGVsZXRlKCJ3Y19hdHRyaWJ1dGVfdGF4b25vbWllcyIsICJvcHRpb25zIik7CiAgd3BfY2FjaGVfZGVsZXRlKCJhdHRyaWJ1dGVfdGF4b25vbWllcyIsICJ3b29jb21tZXJjZS1hdHRyaWJ1dGVzIik7CiAgLy8gMi4gZm9yY2UgcmUtZmV0Y2ggaXMgREIKICBpZihmdW5jdGlvbl9leGlzdHMoIndjX2dldF9hdHRyaWJ1dGVfdGF4b25vbWllcyIpKXsKICAgIC8vIGlzdHJpbmFtIHNhdWdvbWEgY2FjaGUnYQogICAgJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lID0gJ190cmFuc2llbnRfd2NfYXR0cmlidXRlX3RheG9ub21pZXMnIE9SIG9wdGlvbl9uYW1lID0gJ190cmFuc2llbnRfdGltZW91dF93Y19hdHRyaWJ1dGVfdGF4b25vbWllcyciKTsKICAgIC8vIGthIERCJ2UgdHVyaW0/CiAgICAkdGF4ZXMgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBhdHRyaWJ1dGVfaWQsIGF0dHJpYnV0ZV9uYW1lLCBhdHRyaWJ1dGVfbGFiZWwsIGF0dHJpYnV0ZV9wdWJsaWMgRlJPTSB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV9hdHRyaWJ1dGVfdGF4b25vbWllcyBPUkRFUiBCWSBhdHRyaWJ1dGVfaWQiKTsKICAgICR0c3VtID0gYXJyYXkoKTsKICAgIGZvcmVhY2goJHRheGVzIGFzICR0KXsgJHRzdW1bXT0iaWR7JHQtPmF0dHJpYnV0ZV9pZH06cGFfeyR0LT5hdHRyaWJ1dGVfbmFtZX0ocHViPXskdC0+YXR0cmlidXRlX3B1YmxpY30pIjsgfQogICAgJGxvZ1siZGJfYXR0cnMiXSA9ICR0c3VtOwogIH0KICAvLyAzLiBnbG9iYWxpIFdDIGF0cmlidXR1IG1hc3l2byBpc3ZhbHltYXMgKGplaSBwbHVnaW4gY2FjaGUnaW5hIGdsb2JhbGluaiB2YXIpCiAgZ2xvYmFsICR3Y19wcm9kdWN0X2F0dHJpYnV0ZXM7CiAgJHdjX3Byb2R1Y3RfYXR0cmlidXRlcyA9IG51bGw7CiAgLy8gNC4gZm9yY2UgaW5pdCB0YWtzb25vbWlqdSAtIHBlciBXQyBmdW5rY2lqYQogIGlmKGZ1bmN0aW9uX2V4aXN0cygid2NfZ2V0X2F0dHJpYnV0ZV90YXhvbm9teV9uYW1lcyIpKXsKICAgICRuYW1lcyA9IHdjX2dldF9hdHRyaWJ1dGVfdGF4b25vbXlfbmFtZXMoKTsKICAgICRsb2dbIndjX25hbWVzX2FmdGVyX2ZsdXNoIl0gPSAkbmFtZXM7CiAgfQogIC8vIDUuIHJhbmtpbml1IGJ1ZHUgcmVnaXN0cnVvamFtIHBhX2JlX2dydWR1IGlyIHBhX3NwZWNpYWxpX21pdHliYSBqZWkgaXMgREIgeXJhIGJldCBuZXJlZ2lzdHIKICBmb3JlYWNoKGFycmF5KCJwYV9iZV9ncnVkdSIsInBhX3NwZWNpYWxpX21pdHliYSIpIGFzICR0YXgpewogICAgaWYoIXRheG9ub215X2V4aXN0cygkdGF4KSl7CiAgICAgIC8vIGlzdHJhdWtpYW0gaXMgREIKICAgICAgJHNsdWcgPSBzdHJfcmVwbGFjZSgicGFfIiwiIiwkdGF4KTsKICAgICAgJHJvdyA9ICR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgKiBGUk9NIHskd3BkYi0+cHJlZml4fXdvb2NvbW1lcmNlX2F0dHJpYnV0ZV90YXhvbm9taWVzIFdIRVJFIGF0dHJpYnV0ZV9uYW1lID0gJXMiLCAkc2x1ZykpOwogICAgICBpZigkcm93KXsKICAgICAgICAkYXJncyA9IGFycmF5KAogICAgICAgICAgImxhYmVscyI9PmFycmF5KCJuYW1lIj0+JHJvdy0+YXR0cmlidXRlX2xhYmVsKSwKICAgICAgICAgICJoaWVyYXJjaGljYWwiPT5mYWxzZSwKICAgICAgICAgICJzaG93X3VpIj0+ZmFsc2UsCiAgICAgICAgICAicXVlcnlfdmFyIj0+dHJ1ZSwKICAgICAgICAgICJyZXdyaXRlIj0+ZmFsc2UsCiAgICAgICAgICAicHVibGljIj0+dHJ1ZSwKICAgICAgICAgICJzaG93X2luX25hdl9tZW51cyI9PmZhbHNlLAogICAgICAgICAgInNob3dfaW5fcmVzdCI9PnRydWUsCiAgICAgICAgKTsKICAgICAgICByZWdpc3Rlcl90YXhvbm9teSgkdGF4LCBhcnJheSgicHJvZHVjdCIpLCAkYXJncyk7CiAgICAgICAgJGxvZ1sibWFudWFsX3JlZ18iLiR0YXhdID0gdGF4b25vbXlfZXhpc3RzKCR0YXgpID8gIk9LIiA6ICJGQUlMIjsKICAgICAgfSBlbHNlIHsKICAgICAgICAkbG9nWyJtYW51YWxfcmVnXyIuJHRheF0gPSAibm9fZGJfcm93IjsKICAgICAgfQogICAgfSBlbHNlIHsKICAgICAgJGxvZ1siYWxyZWFkeV9yZWdfIi4kdGF4XSA9ICJ5ZXMiOwogICAgfQogIH0KICAvLyA2LiBoYXJkIGZsdXNoCiAgZmx1c2hfcmV3cml0ZV9ydWxlcyh0cnVlKTsKICAkbG9nWyJmbHVzaGVkIl0gPSB0cnVlOwogICR1cCA9IHdwX3VwbG9hZF9kaXIoKTsKICBmaWxlX3B1dF9jb250ZW50cygkdXBbImJhc2VkaXIiXS4iL3dheGZpeF9yZXN1bHQuanNvbiIsIHdwX2pzb25fZW5jb2RlKCRsb2cpKTsKICB3cF9kaWUoIldBWEZJWF9ET05FIik7Cn0pOw==","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'wx',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 60 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:65000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP waxfix',code:PHP,scope:'global',active:false});
  let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
  out.sid=sid; out.err=err;
  if(sid && !err){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    get('/?waxfix=ps2026');
    out.result=get('/wp-content/uploads/waxfix_result.json').slice(0,3000);
    api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  }
  await new Promise(r=>setTimeout(r,4000));
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1200} });
  const page = await ctx.newPage();
  await page.goto(DEV+'/kategorija/sunims/maistas-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
  await page.waitForTimeout(4000);
  out.filters = await page.evaluate(()=>{
    const arr=[];
    document.querySelectorAll('.yith-wcan-filter').forEach(f=>{
      const tax=f.getAttribute('data-taxonomy')||'';
      const title=(f.querySelector('.yith-wcan-filter-title')||{}).innerText||'';
      const terms=[]; f.querySelectorAll('.term,li,label').forEach(t=>{const l=(t.innerText||'').trim();if(l&&l.length<40)terms.push(l);});
      arr.push({title:title.trim(), tax, terms:[...new Set(terms)].slice(0,12)});
    });
    return arr;
  });
  putBin('waxfix_check.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:450,height:1200} }));
  await browser.close();
  putFile('runwaxfix.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
