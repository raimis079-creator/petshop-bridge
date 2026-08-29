process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEs0IENvbnRhY3QgUG9saWN5IHp2YWxneWJhIHYxLjAgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKChpc3NldCgkX0dFVFsncHNfYmlzJ10pPyRfR0VUWydwc19iaXMnXTonJykgIT09ICdLNCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvID0gYXJyYXkoJ3YnPT4nSzQtdjEuMCcpOwogIHRyeSB7CiAgICBpZiAoIWNsYXNzX2V4aXN0cygnUGV0c2hvcF9Db250YWN0X1BvbGljeScpKSB7ICRvWydTVE9QJ109J1BldHNob3BfQ29udGFjdF9Qb2xpY3kgTkVSQSc7IGVjaG8ganNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CiAgICAkcmMgPSBuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0NvbnRhY3RfUG9saWN5Jyk7CiAgICAkZiA9ICRyYy0+Z2V0RmlsZU5hbWUoKTsgJEwgPSBmaWxlKCRmKTsKICAgICRvWydmYWlsYXMnXSA9IHN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRmKTsKICAgIGZvcmVhY2ggKCRyYy0+Z2V0TWV0aG9kcygpIGFzICRtZSkgewogICAgICBpZiAoJG1lLT5jbGFzcyAhPT0gJ1BldHNob3BfQ29udGFjdF9Qb2xpY3knKSBjb250aW51ZTsKICAgICAgJG9bJ21ldG9kYWknXVtdID0gKCRtZS0+aXNTdGF0aWMoKT8nc3RhdGljICc6JycpLiRtZS0+Z2V0TmFtZSgpOwogICAgfQogICAgZm9yZWFjaCAoYXJyYXkoJ2hhc19jb25zZW50Jywnc2V0X2NvbnNlbnQnLCdnZXRfY29uc2VudCcpIGFzICRtKSB7CiAgICAgIGlmICghbWV0aG9kX2V4aXN0cygnUGV0c2hvcF9Db250YWN0X1BvbGljeScsJG0pKSBjb250aW51ZTsKICAgICAgJHJtID0gbmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfQ29udGFjdF9Qb2xpY3knLCRtKTsKICAgICAgJGE9JHJtLT5nZXRTdGFydExpbmUoKTsgJGI9JHJtLT5nZXRFbmRMaW5lKCk7CiAgICAgICRvWydzcmNfJy4kbV0gPSBpbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkTCwgJGEtMSwgbWluKCRiLSRhKzEsIDkwKSkpOwogICAgfQogICAgaWYgKGZ1bmN0aW9uX2V4aXN0cygncHNfZ2V0X21hcmtldGluZ19jb25zZW50JykpIHsKICAgICAgJHJmID0gbmV3IFJlZmxlY3Rpb25GdW5jdGlvbigncHNfZ2V0X21hcmtldGluZ19jb25zZW50Jyk7CiAgICAgICRmZiA9IGZpbGUoJHJmLT5nZXRGaWxlTmFtZSgpKTsKICAgICAgJG9bJ3BzX2dldF9tYXJrZXRpbmdfY29uc2VudF9mYWlsYXMnXSA9IHN0cl9yZXBsYWNlKFdQX0NPTlRFTlRfRElSLCcnLCRyZi0+Z2V0RmlsZU5hbWUoKSk7CiAgICAgICRvWydzcmNfcHNfZ2V0X21hcmtldGluZ19jb25zZW50J10gPSBpbXBsb2RlKCcnLCBhcnJheV9zbGljZSgkZmYsICRyZi0+Z2V0U3RhcnRMaW5lKCktMSwgbWluKCRyZi0+Z2V0RW5kTGluZSgpLSRyZi0+Z2V0U3RhcnRMaW5lKCkrMSwgODApKSk7CiAgICB9CiAgICAvKiBrb2tpZSBtZXRhIHJha3RhaSBhcHNrcml0YWkgbmF1ZG9qYW1pICovCiAgICBnbG9iYWwgJHdwZGI7CiAgICAkb1snbWV0YV9yYWt0YWknXSA9ICR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgbWV0YV9rZXkgRlJPTSB7JHdwZGItPnVzZXJtZXRhfSBXSEVSRSBtZXRhX2tleSBMSUtFICclY29uc2VudCUnIE9SIG1ldGFfa2V5IExJS0UgJyVtYXJrZXRpbmclJyBPUiBtZXRhX2tleSBMSUtFICclbmV3c2xldHRlciUnIExJTUlUIDMwIik7CiAgfSBjYXRjaCAoVGhyb3dhYmxlICRlKSB7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='K4-133842';
const GKEY='ps_bis';
const PHASES=["K4"];
const OUT='analize/k4.json';
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
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f),{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
