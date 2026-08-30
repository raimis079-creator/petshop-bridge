process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBudW9sYWlkdSBkaWFnbm9zdGlrYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2YxOSddKT8kX0dFVFsncHNfZjE5J106JycpIT09J0RHJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nREctMScpOwogIHRyeXsKICAgICRkPVdQTVVfUExVR0lOX0RJUjsKICAgICRmPWFycmF5KCk7CiAgICBmb3JlYWNoKGdsb2IoJGQuJy9wZXRzaG9wLXByZW51bWVyYXRhKi5waHAnKSBhcyAkcCl7CiAgICAgICRmW2Jhc2VuYW1lKCRwKV09YXJyYXkoJ21kNSc9Pm1kNV9maWxlKCRwKSwnZHlkaXMnPT5maWxlc2l6ZSgkcCkpOwogICAgfQogICAgZm9yZWFjaChnbG9iKCRkLicvcGV0c2hvcC1wcmVuKi5waHAnKSBhcyAkcCl7ICRiPWJhc2VuYW1lKCRwKTsgaWYoIWlzc2V0KCRmWyRiXSkpICRmWyRiXT1hcnJheSgnbWQ1Jz0+bWQ1X2ZpbGUoJHApLCdkeWRpcyc9PmZpbGVzaXplKCRwKSk7IH0KICAgICRvWydmYWlsYWknXT0kZjsKICAgIC8vIGtsYXNlcwogICAgZm9yZWFjaChhcnJheSgnUGV0c2hvcF9QcmVudW1lcmF0YScsJ1BldHNob3BfUHJlbnVtZXJhdGFfUGFza3lyYScsJ1BldHNob3BfUHJlbnVtZXJhdGFfQWRtaW4nLCdQZXRzaG9wX1ByZW51bWVyYXRhX0thdGFsb2dhcycsJ1BldHNob3BfUHJlbnVtZXJhdGFfQ2lrbGFzJykgYXMgJGspewogICAgICAkb1sna2xhc2VzJ11bJGtdPWNsYXNzX2V4aXN0cygkayk7CiAgICB9CiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUHJlbnVtZXJhdGEnKSl7CiAgICAgICRyPW5ldyBSZWZsZWN0aW9uQ2xhc3MoJ1BldHNob3BfUHJlbnVtZXJhdGEnKTsKICAgICAgJG9bJ3ByZW5fZmFpbGFzJ109c3RyX3JlcGxhY2UoJGQuJy8nLCcnLCRyLT5nZXRGaWxlTmFtZSgpKTsKICAgICAgJG1zPWFycmF5KCk7IGZvcmVhY2goJHItPmdldE1ldGhvZHMoKSBhcyAkbSl7ICRtc1tdPSRtLT5nZXROYW1lKCkuJygnLmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICRwLT5nZXROYW1lKCk7fSwkbS0+Z2V0UGFyYW1ldGVycygpKSkuJyknOyB9CiAgICAgICRvWydwcmVuX21ldG9kYWknXT0kbXM7CiAgICAgICRjcz0kci0+Z2V0Q29uc3RhbnRzKCk7ICRvWydwcmVuX2tvbnN0YW50b3MnXT1hcnJheV9zbGljZSgkY3MsMCw0MCx0cnVlKTsKICAgIH0KICAgIC8vIG51b2xhaWR1IHBhaWVza2EgdmlzdW9zZSBwcmVuIGZhaWx1b3NlCiAgICAkcmV6PWFycmF5KCk7CiAgICBmb3JlYWNoKGdsb2IoJGQuJy9wZXRzaG9wLXByZW4qLnBocCcpIGFzICRwKXsKICAgICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgICBmb3JlYWNoKGFycmF5KCdudW9sYWlkJywnZGlzY291bnQnLCdfcHNfcHJlbl9udW9sYWlkYScsJ3ByaWNlX2xvY2tlZCcsJ2thaW5hX2Zpa3N1b3RhJykgYXMgJHQpewogICAgICAgICRuPXN1YnN0cl9jb3VudChzdHJ0b2xvd2VyKCRjKSxzdHJ0b2xvd2VyKCR0KSk7IGlmKCRuKSAkcmV6W2Jhc2VuYW1lKCRwKV1bJHRdPSRuOwogICAgICB9CiAgICB9CiAgICAkb1snZ3JlcCddPSRyZXo7CiAgICAvLyBEQiBzdHJ1a3R1cmEKICAgIGdsb2JhbCAkd3BkYjsKICAgICRvWydzdHVscGVsaWFpJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3N1YnNjcmlwdGlvbnMiKTsKICAgICRvWydpdGVtX3N0dWxwZWxpYWknXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc3Vic2NyaXB0aW9uX2l0ZW1zIik7CiAgICAkb1sna2lla19zdWInXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zdWJzY3JpcHRpb25zIik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUFJFVFRZX1BSSU5UKTsgZXhpdDsKfSk7Cg==';
const VER='diag-183243';
const GKEY='ps_f19';
const PHASES=["DG"];
const OUT='analize/f19dg.json';
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
