import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commitB64(name,b64){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'uc',branch:'main',content:b64}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbuc.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbuc.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:35000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3VwZGNvbCddID8/ICcnKSAhPT0gJzEnKSByZXR1cm47CiAgaWYgKCgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3BzMjAyNicgJiYgIWN1cnJlbnRfdXNlcl9jYW4oJ21hbmFnZV9vcHRpb25zJykpIHJldHVybjsKICAvLyBHYW1pbnRvam8gcGFzdGVsaW5pYWkgYXRzcGFsdmlhaQogICRuZXcgPSBhcnJheSgKICAgICd6YWxzdmEnICAgICAgID0+ICcjYjVjOWEwJywgIC8vIHZlcmRlIC0gxaF2ZWxuaSBwYXN0ZWxpbsSXIMW+YWxpYQogICAgJ21lbHN2YScgICAgICAgPT4gJyNhN2M3ZGUnLCAgLy8gY2VsZXN0ZSAtIMWhdmllc2lhaSDFvnlkcmEKICAgICdrYXB1Y2lubycgICAgID0+ICcjY2RiYmE0JywgIC8vIHRvcnRvcmEvYmVpZ2UgLSBzbcSXbGlvL3RhdXBlCiAgICAncmF1c3ZhaS1ydWRhJyA9PiAnI2QzYWViMCcsICAvLyByb3NhIC0gZHVsa8SXdGEgcm/FvmluxJcKICApOwogICRvdXQ9YXJyYXkoKTsKICBmb3JlYWNoKCRuZXcgYXMgJHNsdWc9PiRoZXgpewogICAgJHQ9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCRzbHVnLCdwYV9zcGFsdmEnKTsKICAgIGlmKCR0KXsKICAgICAgdXBkYXRlX3Rlcm1fbWV0YSgkdC0+dGVybV9pZCwncHJvZHVjdF9hdHRyaWJ1dGVfY29sb3InLCRoZXgpOwogICAgICB1cGRhdGVfdGVybV9tZXRhKCR0LT50ZXJtX2lkLCdfdmFyaWF0aW9uX3N3YXRjaF9jb2xvcicsJGhleCk7CiAgICAgIHVwZGF0ZV90ZXJtX21ldGEoJHQtPnRlcm1faWQsJ2NvbG9yJywkaGV4KTsKICAgICAgJG91dFskc2x1Z109JGhleDsKICAgIH0KICB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyB3cF9qc29uX2VuY29kZShhcnJheSgndXBkYXRlZCc9PiRvdXQpKTsgZXhpdDsKfSk7Cg==",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC UPDCOL', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 30 "'+BASE+'/?psc_updcol=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.upd=m?JSON.parse(m[0]):r.slice(0,120);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  await new Promise(r=>setTimeout(r,1000));
  var url = BASE+'/product/kampinis-tualetas-katems-shuttle/';
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1300}});
    const p=await c.newPage();
    await p.goto(url+'?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:30000});
    await p.waitForTimeout(4000);
    out.colors=await p.evaluate(()=> [].slice.call(document.querySelectorAll('.psc-swatch')).map(function(s){return {name:s.getAttribute('data-name'),bg:s.style.background};}));
    const buf=await p.screenshot({fullPage:false}); commitB64('swatch_v2.png', buf.toString('base64'));
    await b.close();
  }catch(e){ out.err=e.message.slice(0,120); }
  commitB64('updcol.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,300));
})();
