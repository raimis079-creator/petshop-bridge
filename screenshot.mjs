import { execSync } from "child_process"; import fs from "fs";
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
const DEV="https://dev.avesa.lt";
const WPU=(process.env.WP_USER||"").trim();
const WPP=(process.env.WP_APP_PASS||"").replace(/\s+/g,"");
const PHP=Buffer.from("YWRkX2FjdGlvbigid3BfbG9hZGVkIiwgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWyJjbXAiXSkgfHwgJF9HRVRbImNtcCJdICE9PSAicHMyMDI2IikgcmV0dXJuOwogICRyID0gYXJyYXkoKTsKICBmb3JlYWNoKGFycmF5KDM0MDYzPT4iTWFpc3RvIiwgMzQxMDc9PiJTYW1wdW51IiwgMzQxMDM9PiJLcmFpa3UiKSBhcyAkcGlkPT4kbm0pewogICAgJGZpbHRlcnMgPSBnZXRfcG9zdF9tZXRhKCRwaWQsICJfZmlsdGVycyIsIHRydWUpOwogICAgJGZzID0gYXJyYXkoKTsKICAgIGlmKGlzX2FycmF5KCRmaWx0ZXJzKSl7CiAgICAgIGZvcmVhY2goJGZpbHRlcnMgYXMgJGYpewogICAgICAgIC8vIHZpc2kgZ2FsaW1pIHRha3Nvbm9taWpvcyBsYXVrYWkKICAgICAgICAkZnNbXSA9IGFycmF5KAogICAgICAgICAgInRpdGxlIj0+aXNzZXQoJGZbInRpdGxlIl0pPyRmWyJ0aXRsZSJdOiIiLAogICAgICAgICAgInRheG9ub215Ij0+aXNzZXQoJGZbInRheG9ub215Il0pPyRmWyJ0YXhvbm9teSJdOiJbTkVSQV0iLAogICAgICAgICAgInR5cGUiPT5pc3NldCgkZlsidHlwZSJdKT8kZlsidHlwZSJdOiJbTkVSQV0iLAogICAgICAgICAgInVzZV9hbGxfdGVybXMiPT5pc3NldCgkZlsidXNlX2FsbF90ZXJtcyJdKT8kZlsidXNlX2FsbF90ZXJtcyJdOiJbTkVSQV0iLAogICAgICAgICAgImN1c3RvbWl6ZV90ZXJtcyI9Pmlzc2V0KCRmWyJjdXN0b21pemVfdGVybXMiXSk/JGZbImN1c3RvbWl6ZV90ZXJtcyJdOiJbTkVSQV0iLAogICAgICAgICAgImFsbF9rZXlzIj0+aW1wbG9kZSgiLCIsYXJyYXlfa2V5cygkZikpCiAgICAgICAgKTsKICAgICAgfQogICAgfQogICAgJHJbJG5tLiJfIi4kcGlkXSA9ICRmczsKICB9CiAgJHVwID0gd3BfdXBsb2FkX2RpcigpOwogIGZpbGVfcHV0X2NvbnRlbnRzKCR1cFsiYmFzZWRpciJdLiIvY21wX3Jlc3VsdC5qc29uIiwgd3BfanNvbl9lbmNvZGUoJHIpKTsKICB3cF9kaWUoIkNNUF9ET05FIik7Cn0pOw==","base64").toString("utf8");
function putFile(name,str){ try{ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'cm',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/pf.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/pf.json "'+url+'"',{encoding:'utf8'}); }catch(e){} }
function api(path,method,obj){ let cmd='curl -sk -u "$WPU:$WPP" -H "Content-Type: application/json" '; if(method) cmd+='-X '+method+' '; if(obj){ fs.writeFileSync('/tmp/body.json', JSON.stringify(obj)); cmd+='-d @/tmp/body.json '; } cmd+='"'+DEV+path+'"'; try{ return execSync(cmd,{encoding:'utf8',maxBuffer:20000000,timeout:60000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; }}
function get(path){ try{ return execSync('curl -sk -u "$WPU:$WPP" --max-time 40 "'+DEV+path+'"',{encoding:'utf8',maxBuffer:20000000,timeout:45000,env:{...process.env,WPU,WPP}}); }catch(e){ return 'EXC'; } }
function jget(path){ try{ return JSON.parse(get(path)); }catch(e){ return null; } }
const out={};
const c=api('/wp-json/code-snippets/v1/snippets','POST',{name:'TEMP cmp',code:PHP,scope:'global',active:false});
let sid=0,err=''; try{ const j=JSON.parse(c); sid=j.id; err=j.code_error||''; }catch(e){ err='parse'; }
out.sid=sid; out.err=err;
if(sid && !err){
  api('/wp-json/code-snippets/v1/snippets/'+sid,'PUT',{active:true});
  get('/?cmp=ps2026');
  out.result=get('/wp-content/uploads/cmp_result.json').slice(0,6000);
  api('/wp-json/code-snippets/v1/snippets/'+sid,'DELETE');
}
// frontend: ar sampunu kategorija rodo teisingus terminus?
await new Promise(r=>setTimeout(r,2000));
const { chromium } = await import('playwright');
const browser = await chromium.launch({ args:['--no-sandbox','--ignore-certificate-errors'] });
const ctx = await browser.newContext({ httpCredentials:{ username:WPU, password:WPP }, ignoreHTTPSErrors:true, viewport:{width:1280,height:1200} });
const page = await ctx.newPage();
await page.goto(DEV+'/kategorija/sunims/sampunai-sunims/?nc='+Date.now(), { waitUntil:'domcontentloaded', timeout:60000 });
await page.waitForTimeout(4000);
out.sampunai_filters = await page.evaluate(()=>{
  const filters=[];
  document.querySelectorAll('.yith-wcan-filter').forEach(f=>{
    const tax=f.getAttribute('data-taxonomy')||'';
    const terms=[];
    f.querySelectorAll('.term,li').forEach(t=>{const l=(t.innerText||'').trim();if(l&&l.length<40)terms.push(l);});
    filters.push({tax, terms:[...new Set(terms)].slice(0,8)});
  });
  return filters;
});
await browser.close();
putFile('runcmp.json', JSON.stringify(out));
