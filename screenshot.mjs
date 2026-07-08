import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJ5cmVzYXZlIl0pIHx8ICRfR0VUWyJ5cmVzYXZlIl0gIT09ICJwczIwMjYiKSByZXR1cm47CiAgJGxvZyA9IGFycmF5KCk7CiAgLy8ga29raW9zIFlJVEggZnVua2Npam9zIHlyYT8KICAkbG9nWyJoYXNfZ2V0X3ByZXNldCJdID0gZnVuY3Rpb25fZXhpc3RzKCJ5aXRoX3djYW5fZ2V0X3ByZXNldCIpOwogICRsb2dbImNsYXNzX3ByZXNldCJdID0gY2xhc3NfZXhpc3RzKCJZSVRIX1dDQU5fUHJlc2V0Iik7CiAgJGxvZ1siY2xhc3NfZmFjdG9yeSJdID0gY2xhc3NfZXhpc3RzKCJZSVRIX1dDQU5fUHJlc2V0X0ZhY3RvcnkiKTsKICBpZihmdW5jdGlvbl9leGlzdHMoInlpdGhfd2Nhbl9nZXRfcHJlc2V0IikpewogICAgJHByZXNldCA9IHlpdGhfd2Nhbl9nZXRfcHJlc2V0KDM0MDYzKTsKICAgICRsb2dbInByZXNldF9sb2FkZWQiXSA9IGlzX29iamVjdCgkcHJlc2V0KSA/IGdldF9jbGFzcygkcHJlc2V0KSA6ICJub3Rfb2JqZWN0IjsKICAgIGlmKGlzX29iamVjdCgkcHJlc2V0KSl7CiAgICAgICRsb2dbIm1ldGhvZHMiXSA9IGFycmF5X3NsaWNlKGdldF9jbGFzc19tZXRob2RzKCRwcmVzZXQpLCAwLCAzMCk7CiAgICAgIC8vIGFyIHR1cmkgZ2V0X2ZpbHRlcnMgLyBzYXZlCiAgICAgIGlmKG1ldGhvZF9leGlzdHMoJHByZXNldCwiZ2V0X2ZpbHRlcnMiKSl7CiAgICAgICAgJGZpbHRlcnMgPSAkcHJlc2V0LT5nZXRfZmlsdGVycygpOwogICAgICAgICRsb2dbImZpbHRlcnNfdmlhX29iamVjdCJdID0gaXNfYXJyYXkoJGZpbHRlcnMpID8gY291bnQoJGZpbHRlcnMpIDogZ2V0dHlwZSgkZmlsdGVycyk7CiAgICAgICAgLy8gcGF0aWtyaW5hbSBwaXJtbyBmaWx0cm8gdGF4b25vbXkgcGVyIG9iamVrdGEKICAgICAgICBpZihpc19hcnJheSgkZmlsdGVycykgJiYgY291bnQoJGZpbHRlcnMpPjApewogICAgICAgICAgJGZmID0gcmVzZXQoJGZpbHRlcnMpOwogICAgICAgICAgJGxvZ1siZmlyc3RfZmlsdGVyX2NsYXNzIl0gPSBpc19vYmplY3QoJGZmKSA/IGdldF9jbGFzcygkZmYpIDogZ2V0dHlwZSgkZmYpOwogICAgICAgICAgaWYoaXNfb2JqZWN0KCRmZikpewogICAgICAgICAgICAkbG9nWyJmaXJzdF9maWx0ZXJfdGF4Il0gPSBpc3NldCgkZmYtPnRheG9ub215KSA/ICRmZi0+dGF4b25vbXkgOiAobWV0aG9kX2V4aXN0cygkZmYsImdldF90YXhvbm9teSIpID8gJGZmLT5nZXRfdGF4b25vbXkoKSA6ICI/Iik7CiAgICAgICAgICB9CiAgICAgICAgfQogICAgICB9CiAgICAgIC8vIEJBTkRPTSBzYXZlCiAgICAgIGlmKG1ldGhvZF9leGlzdHMoJHByZXNldCwic2F2ZSIpKXsKICAgICAgICAkcHJlc2V0LT5zYXZlKCk7CiAgICAgICAgJGxvZ1sic2F2ZWQiXSA9IHRydWU7CiAgICAgIH0KICAgIH0KICB9CiAgJHVwID0gd3BfdXBsb2FkX2RpcigpOwogIGZpbGVfcHV0X2NvbnRlbnRzKCR1cFsiYmFzZWRpciJdLiIveXJlc2F2ZV9yZXN1bHQuanNvbiIsIHdwX2pzb25fZW5jb2RlKCRsb2cpKTsKICB3cF9kaWUoIllSRVNBVkVfRE9ORSIpOwp9KTs=","base64").toString("utf8");
function putBin(name,buf){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yr',branch:'main',content:buf.toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function putFile(name,str){ putBin(name, Buffer.from(str,'utf8')); }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
(async()=>{
  const out={};
  const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP yresave',code:PHP,scope:'global',active:false});
  let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
  out.sid=sid; out.err=err;
  if(sid && !err){
    api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
    get('/?yresave=ps2026');
    out.result=get('/wp-content/uploads/yresave_result.json').slice(0,2000);
    api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
  }
  // re-check frontend
  await new Promise(r=>setTimeout(r,3000));
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
      const terms=[]; f.querySelectorAll('.term,li').forEach(t=>{const l=(t.innerText||'').trim();if(l&&l.length<40)terms.push(l);});
      arr.push({tax, terms:[...new Set(terms)].slice(0,8)});
    });
    return arr;
  });
  putBin('yresave_check.png', await page.screenshot({ fullPage:false, clip:{x:0,y:0,width:400,height:1000} }));
  await browser.close();
  putFile('runyresave.json', JSON.stringify(out));
})().catch(e=>{ console.log('ERR', String(e).slice(0,200)); });
