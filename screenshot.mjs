import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJzbHVnZml4Il0pIHx8ICRfR0VUWyJzbHVnZml4Il0gIT09ICJwczIwMjYiKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRsb2cgPSBhcnJheSgpOwogIC8vIDEuIHRpa3JhIGRhYmFydGluZSBzbHVnIGJ1c2VuYQogICRiZWZvcmUgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBhdHRyaWJ1dGVfaWQsIGF0dHJpYnV0ZV9uYW1lLCBhdHRyaWJ1dGVfbGFiZWwgRlJPTSB7JHdwZGItPnByZWZpeH13b29jb21tZXJjZV9hdHRyaWJ1dGVfdGF4b25vbWllcyBXSEVSRSBhdHRyaWJ1dGVfaWQgSU4gKDcsOCw5KSIpOwogICRsb2dbImJlZm9yZSJdID0gYXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gImlkeyRyLT5hdHRyaWJ1dGVfaWR9Onskci0+YXR0cmlidXRlX25hbWV9Ijt9LCAkYmVmb3JlKTsKICAvLyAyLiB0YWlzb20gYXR0cmlidXRlX3RheG9ub21pZXMgbGVudGVsZQogICRyMSA9ICR3cGRiLT51cGRhdGUoJHdwZGItPnByZWZpeC4id29vY29tbWVyY2VfYXR0cmlidXRlX3RheG9ub21pZXMiLCBhcnJheSgiYXR0cmlidXRlX25hbWUiPT4iYmVfZ3J1ZHUiKSwgYXJyYXkoImF0dHJpYnV0ZV9pZCI9PjcpKTsKICAkcjIgPSAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wcmVmaXguIndvb2NvbW1lcmNlX2F0dHJpYnV0ZV90YXhvbm9taWVzIiwgYXJyYXkoImF0dHJpYnV0ZV9uYW1lIj0+InNwZWNpYWxpX21pdHliYSIpLCBhcnJheSgiYXR0cmlidXRlX2lkIj0+OCkpOwogICRsb2dbInVwZGF0ZWRfYXR0cl90YXgiXSA9IGFycmF5KCJiZV9ncnVkdSI9PiRyMSwgInNwZWNpYWxpX21pdHliYSI9PiRyMik7CiAgLy8gMy4gdGFpc29tIHRlcm1fdGF4b25vbXkgKFdvcmRQcmVzcyB0YWtzb25vbWlqYSAtIGt1ciB0ZXJtaW5haSBwcmlza2lydGkpCiAgJHIzID0gJHdwZGItPnVwZGF0ZSgkd3BkYi0+cHJlZml4LiJ0ZXJtX3RheG9ub215IiwgYXJyYXkoInRheG9ub215Ij0+InBhX2JlX2dydWR1IiksIGFycmF5KCJ0YXhvbm9teSI9PiJwYV9iZS1ncnVkdSIpKTsKICAkcjQgPSAkd3BkYi0+dXBkYXRlKCR3cGRiLT5wcmVmaXguInRlcm1fdGF4b25vbXkiLCBhcnJheSgidGF4b25vbXkiPT4icGFfc3BlY2lhbGlfbWl0eWJhIiksIGFycmF5KCJ0YXhvbm9teSI9PiJwYV9zcGVjaWFsaS1taXR5YmEiKSk7CiAgJGxvZ1sidXBkYXRlZF90ZXJtX3RheCJdID0gYXJyYXkoInBhX2JlX2dydWR1Ij0+JHIzLCAicGFfc3BlY2lhbGlfbWl0eWJhIj0+JHI0KTsKICAvLyA0LiBwYXRpa3JpbmFtIGFyIGxvb2t1cCBsZW50ZWxlIGphdSB0dXJpIHRlaXNpbmd1cwogICRsdV9iZyA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXdjX3Byb2R1Y3RfYXR0cmlidXRlc19sb29rdXAgV0hFUkUgdGF4b25vbXkgPSAncGFfYmVfZ3J1ZHUnIik7CiAgJGx1X3NtID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2NfcHJvZHVjdF9hdHRyaWJ1dGVzX2xvb2t1cCBXSEVSRSB0YXhvbm9teSA9ICdwYV9zcGVjaWFsaV9taXR5YmEnIik7CiAgJGxvZ1sibG9va3VwIl0gPSBhcnJheSgicGFfYmVfZ3J1ZHUiPT4kbHVfYmcsICJwYV9zcGVjaWFsaV9taXR5YmEiPT4kbHVfc20pOwogIC8vIDUuIHZhbG9tIFdDIGF0cmlidXR1IGNhY2hlCiAgZGVsZXRlX3RyYW5zaWVudCgid2NfYXR0cmlidXRlX3RheG9ub21pZXMiKTsKICB3cF9jYWNoZV9kZWxldGUoIndjX2F0dHJpYnV0ZV90YXhvbm9taWVzIiwgIm9wdGlvbnMiKTsKICAkbG9nWyJjYWNoZV9jbGVhcmVkIl0gPSB0cnVlOwogIC8vIDYuIGZsdXNoCiAgZmx1c2hfcmV3cml0ZV9ydWxlcyh0cnVlKTsKICAkbG9nWyJmbHVzaGVkIl0gPSB0cnVlOwogIC8vIDcuIHBhdHZpcnRpbmltYXMKICAkYWZ0ZXIgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBhdHRyaWJ1dGVfaWQsIGF0dHJpYnV0ZV9uYW1lIEZST00geyR3cGRiLT5wcmVmaXh9d29vY29tbWVyY2VfYXR0cmlidXRlX3RheG9ub21pZXMgV0hFUkUgYXR0cmlidXRlX2lkIElOICg3LDgsOSkiKTsKICAkbG9nWyJhZnRlciJdID0gYXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gImlkeyRyLT5hdHRyaWJ1dGVfaWR9Onskci0+YXR0cmlidXRlX25hbWV9Ijt9LCAkYWZ0ZXIpOwogICR1cCA9IHdwX3VwbG9hZF9kaXIoKTsKICBmaWxlX3B1dF9jb250ZW50cygkdXBbImJhc2VkaXIiXS4iL3NsdWdmaXhfcmVzdWx0Lmpzb24iLCB3cF9qc29uX2VuY29kZSgkbG9nKSk7CiAgd3BfZGllKCJTTFVHRklYX0RPTkUiKTsKfSk7","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'sf',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:90000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 60 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:65000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP slugfix',code:PHP,scope:'global',active:false});
  let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
  out.sid=sid; out.err=err;
  if(sid && !err){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    get('/?slugfix=ps2026');
    out.result=get('/wp-content/uploads/slugfix_result.json').slice(0,3000);
    api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  }
  await new Promise(r=>setTimeout(r,5000));
  const { chromium } = await import('playwright');
  const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
  const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1400} });
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
  putBin('slugfix_desktop.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:500,height:1400} }));
  await browser.close();
  putFile('runslugfix.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
