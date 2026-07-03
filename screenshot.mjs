import { execSync } from "child_process"; import fs from "fs";
const WP_USER=process.env.WP_USER, WP_PASS=process.env.WP_APP_PASS;
const BASE="https://dev.avesa.lt";
const AUTH="Basic "+Buffer.from(`${WP_USER}:${WP_PASS}`).toString("base64");
const repo=process.env.GH_REPO, tok=process.env.GH_TOKEN;
function commit(name,str){ const url='https://api.github.com/repos/'+repo+'/contents/screenshots/'+name; let sha=''; try{ sha=JSON.parse(execSync('curl -s -H "Authorization: Bearer '+tok+'" "'+url+'?ref=main&t='+Date.now()+'"',{encoding:'utf8'})).sha||''; }catch(e){} const body={message:'yri',branch:'main',content:Buffer.from(str,'utf8').toString('base64')}; if(sha) body.sha=sha; fs.writeFileSync('/tmp/cbyri.json',JSON.stringify(body)); execSync('curl -s -o /dev/null -X PUT -H "Authorization: Bearer '+tok+'" -H "Accept: application/vnd.github+json" -d @/tmp/cbyri.json "'+url+'"',{encoding:'utf8'}); }
function exec(cmd){ try{ return execSync(cmd,{encoding:'utf8',maxBuffer:300000000,timeout:40000}); }catch(e){ return 'EXC:'+e.message; } }
const pcode=Buffer.from("YWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCgkX0dFVFsncHNjX3lyZWluZGV4J10gPz8gJycpICE9PSAnMScpIHJldHVybjsKICBpZiAoKCRfR0VUWydrJ10gPz8gJycpICE9PSAncHMyMDI2JyAmJiAhY3VycmVudF91c2VyX2NhbignbWFuYWdlX29wdGlvbnMnKSkgcmV0dXJuOwogICRvdXQ9YXJyYXkoKTsKCiAgLy8gMS4gWUlUSCB0dXJpIHNhdm8gbG9va3VwIC0gcGF0aWtyaW5hbSBhciB5cmEgWUlUSF9XQ0FOIGtsYXPElyBzdSBjYWNoZSBtZXRvZGFpcwogICRvdXRbJ3lpdGhfY2xhc3NlcyddPWFycmF5KCk7CiAgZm9yZWFjaChhcnJheSgnWUlUSF9XQ0FOJywnWUlUSF9XQ0FOX1F1ZXJ5JywnWUlUSF9XQ0FOX0NhY2hlX0hlbHBlcicsJ1lJVEhfV0NBTl9DYWNoZScpIGFzICRjbHMpewogICAgaWYoY2xhc3NfZXhpc3RzKCRjbHMpKSAkb3V0Wyd5aXRoX2NsYXNzZXMnXVtdPSRjbHM7CiAgfQoKICAvLyAyLiBJxaF0cmluYW0gdmlzdXMgWUlUSCB0cmFuc2llbnQvY2FjaGUKICBnbG9iYWwgJHdwZGI7CiAgJGRlbDEgPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXlpdGhfd2NhbiVjYWNoZSUnIik7CiAgJGRlbDIgPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnX3RyYW5zaWVudF8ld2NhbiUnIik7CiAgJG91dFsnZGVsZXRlZF9jYWNoZSddPSRkZWwxOyAkb3V0WydkZWxldGVkX3RyYW5zaWVudCddPSRkZWwyOwoKICAvLyAzLiBKZWkgWUlUSF9XQ0FOX0NhY2hlX0hlbHBlciB0dXJpIGZsdXNoCiAgaWYoY2xhc3NfZXhpc3RzKCdZSVRIX1dDQU5fQ2FjaGVfSGVscGVyJykpewogICAgaWYobWV0aG9kX2V4aXN0cygnWUlUSF9XQ0FOX0NhY2hlX0hlbHBlcicsJ2ZsdXNoJykpIHsgWUlUSF9XQ0FOX0NhY2hlX0hlbHBlcjo6Zmx1c2goKTsgJG91dFsnY2FjaGVfaGVscGVyX2ZsdXNoJ109J2RvbmUnOyB9CiAgICBpZihtZXRob2RfZXhpc3RzKCdZSVRIX1dDQU5fQ2FjaGVfSGVscGVyJywnY2xlYXJfY2FjaGUnKSkgeyBZSVRIX1dDQU5fQ2FjaGVfSGVscGVyOjpjbGVhcl9jYWNoZSgpOyAkb3V0WydjYWNoZV9oZWxwZXJfY2xlYXInXT0nZG9uZSc7IH0KICB9CgogIC8vIDQuIFByaXZlcnN0aW5haSBwZXJza2FpxI1pdW9qYW0gcGFfdGlwYXMgdGVybWludXMgREFSIGthcnTEhSBzdSBmb3JjZQogICR0ZXJtcyA9IGdldF90ZXJtcyhhcnJheSgndGF4b25vbXknPT4ncGFfdGlwYXMnLCdoaWRlX2VtcHR5Jz0+ZmFsc2UsJ2ZpZWxkcyc9PidpZHMnKSk7CiAgZm9yZWFjaCgkdGVybXMgYXMgJHRpZCl7IHdwX3VwZGF0ZV90ZXJtX2NvdW50X25vdyhhcnJheSgkdGlkKSwgJ3BhX3RpcGFzJyk7IH0KICAkb3V0WydyZWNvdW50ZWQnXT1jb3VudCgkdGVybXMpOwoKICAvLyA1LiBXQyBsb29rdXAgdGFibGUgc3luYyBwcm9kdWt0YW1zIChhdHRyaWJ1dGUgbG9va3VwKQogIGlmKGZ1bmN0aW9uX2V4aXN0cygnd2NfZ2V0X2NvbnRhaW5lcicpKXsKICAgIHRyeSB7CiAgICAgICRkYXRhX3N0b3JlID0gV0NfRGF0YV9TdG9yZTo6bG9hZCgncHJvZHVjdCcpOwogICAgICAkb3V0Wyd3Y19kYXRhc3RvcmUnXT0nbG9hZGVkJzsKICAgIH0gY2F0Y2goRXhjZXB0aW9uICRlKXsgJG91dFsnd2NfZHNfZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIH0KCiAgd3BfY2FjaGVfZmx1c2goKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvdXQpOyBleGl0Owp9KTsK",'base64').toString('utf8').trim();
(async()=>{
  var out={};
  fs.writeFileSync('/tmp/b557.json', JSON.stringify({name:'PSC YREINDEX', code:pcode, scope:'global', active:true}));
  exec('curl -sk -m 20 -X PUT -H "Authorization: '+AUTH+'" -H "Content-Type: application/json" --data-binary @/tmp/b557.json "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  var r=exec('curl -sk -m 35 "'+BASE+'/?psc_yreindex=1&k=ps2026"');
  var m=r.match(/(\{.*\})/s); out.reindex=m?JSON.parse(m[0]):r.slice(0,200);
  exec('curl -sk -m 20 -X DELETE -H "Authorization: '+AUTH+'" "'+BASE+'/wp-json/code-snippets/v1/snippets/557"');
  // iškart testuojam
  await new Promise(r=>setTimeout(r,2000));
  try{
    const { chromium } = await import('playwright');
    const b=await chromium.launch({args:['--no-sandbox']});
    const c=await b.newContext({ignoreHTTPSErrors:true,viewport:{width:1200,height:1400}});
    const p=await c.newPage();
    await p.goto(BASE+'/kategorija/katems/tualetai-kraikai-semtuveliai/?nc='+Date.now(),{waitUntil:'domcontentloaded',timeout:40000});
    await p.waitForTimeout(4000);
    var links = await p.$$('a');
    for (var l of links){ var txt=await l.textContent(); if(txt && txt.trim()==='Uždaras tualetas / namelis'){ await l.click(); break; } }
    await p.waitForTimeout(6000);
    out.result = await p.evaluate(()=>{ var rc=document.querySelector('.woocommerce-result-count'); return rc?rc.textContent.trim():'(nerasta)'; });
    out.product_count = await p.evaluate(()=>document.querySelectorAll('ul.products li.product').length);
    await b.close();
  }catch(e){ out.click_err=e.message.slice(0,80); }
  commit('yith_reindex.json', Buffer.from(JSON.stringify(out),'utf8').toString('base64'));
  console.log(JSON.stringify(out).slice(0,400));
})();
