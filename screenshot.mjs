process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ4IHJlY29uIChzdXBwcmVzc2lvbiArIGVtYWlsIHNhYmxvbmFpKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3M4J10pfHwkX0dFVFsncHNfczgnXSE9PSdSRUNPTicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsKICAkbz1hcnJheSgndic9PidTMTU0OHInKTsKICB0cnl7CiAgICAvKiAxLiByYXN0aSBjb25zZW50LXN5bmMgZmFpbGEgKi8KICAgICRrYW5kPWFycmF5KCk7CiAgICBmb3JlYWNoKGFycmF5KFdQTVVfUExVR0lOX0RJUiwgV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcycsIFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcycpIGFzICRkKXsKICAgICAgaWYoIWlzX2RpcigkZCkpIGNvbnRpbnVlOwogICAgICBmb3JlYWNoKGdsb2IoJGQuJy8qY29uc2VudConKSBhcyAkZikgJGthbmRbXT0kZjsKICAgICAgZm9yZWFjaChnbG9iKCRkLicvKmNvbnRhY3QqJykgYXMgJGYpICRrYW5kW109JGY7CiAgICB9CiAgICAkb1sna2FuZGlkYXRhaSddPWFycmF5X21hcChmdW5jdGlvbigkZil7cmV0dXJuIGFycmF5KCRmLGZpbGVzaXplKCRmKSk7fSwka2FuZCk7CiAgICAkY3M9bnVsbDsgZm9yZWFjaCgka2FuZCBhcyAkZil7IGlmKHN0cnBvcyhmaWxlX2dldF9jb250ZW50cygkZiksJ3NldF9tYXJrZXRpbmdfY29uc2VudCcpIT09ZmFsc2UpeyAkY3M9JGY7IGJyZWFrOyB9IH0KICAgICRvWydjb25zZW50X3N5bmNfZmFpbGFzJ109JGNzOwogICAgaWYoJGNzKXsgJG9bJ2NzX21kNSddPW1kNV9maWxlKCRjcyk7ICRvWydjc19keWRpcyddPWZpbGVzaXplKCRjcyk7ICRvWydjc19iNjQnXT1iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRjcykpOyB9CiAgICAvKiAyLiBzdXBwcmVzc2lvbiBsZW50ZWxlICovCiAgICAkc3VwPW51bGw7IGZvcmVhY2goJHdwZGItPmdldF9jb2woJ1NIT1cgVEFCTEVTJykgYXMgJHQpeyBpZihzdHJpcG9zKCR0LCdzdXBwcmVzcycpIT09ZmFsc2UpeyAkc3VwPSR0OyBicmVhazsgfSB9CiAgICAkb1snc3VwX2xlbnRlbGUnXT0kc3VwOwogICAgaWYoJHN1cCl7CiAgICAgICRvWydzdXBfY3JlYXRlJ109JHdwZGItPmdldF92YXIoIlNIT1cgQ1JFQVRFIFRBQkxFICRzdXAiLDEpOwogICAgICAkb1sndGVycmEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoJHdwZGItPnByZXBhcmUoIlNFTEVDVCAqIEZST00gJHN1cCBXSEVSRSBlbWFpbCBMSUtFICVzIE9SREVSIEJZIGlkIERFU0MgTElNSVQgNSIsJyV0ZXJyYSUnKSxBUlJBWV9BKTsKICAgICAgJG9bJ3N1cF9zdGF0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY2hhbm5lbCwgcmVhc29uLCAocmVsZWFzZWRfYXQgSVMgTlVMTCkgYWt0eXZpLCBDT1VOVCgqKSBuIEZST00gJHN1cCBHUk9VUCBCWSBjaGFubmVsLCByZWFzb24sIGFrdHl2aSIsQVJSQVlfQSk7CiAgICB9CiAgICAvKiAzLiBzYWJsb25haSAqLwogICAgJHRkPW51bGw7CiAgICBmb3JlYWNoKGFycmF5KFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvdGVtcGxhdGVzL2VtYWlscycsIFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS90ZW1wbGF0ZXMvZW1haWxzJykgYXMgJGQpeyBpZihpc19kaXIoJGQpKXsgJHRkPSRkOyBicmVhazsgfSB9CiAgICAkb1sndHBsX2RpciddPSR0ZDsKICAgIGlmKCR0ZCl7CiAgICAgIGZvcmVhY2goYXJyYXkoJ29yZGVyLXBhaWQnLCdkdW5uaW5nLTEnLCdmb3VuZGluZycsJ2NvbnNlbnQtY2hhbmdlZCcpIGFzICRuKXsKICAgICAgICAkZj0kdGQuJy8nLiRuLicucGhwJzsKICAgICAgICBpZihmaWxlX2V4aXN0cygkZikpeyAkb1sndHBsJ11bJG5dPWFycmF5KCdtZDUnPT5tZDVfZmlsZSgkZiksJ0InPT5maWxlc2l6ZSgkZiksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpKSk7IH0KICAgICAgfQogICAgICAkb1sndHBsX3Zpc2knXT1hcnJheV9tYXAoJ2Jhc2VuYW1lJyxnbG9iKCR0ZC4nLyoucGhwJykpOwogICAgfQogICAgLyogNC4gbGF5b3V0IGtsYXNlICovCiAgICAkbGY9bnVsbDsgZm9yZWFjaCgka2FuZD1hcnJheV9tZXJnZShnbG9iKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMvKmxheW91dConKSxnbG9iKFdQTVVfUExVR0lOX0RJUi4nLypsYXlvdXQqJykpIGFzICRmKXsgJGxmPSRmOyBicmVhazsgfQogICAgaWYoISRsZiAmJiBjbGFzc19leGlzdHMoJ1BldHNob3BfRW1haWxfTGF5b3V0JykpeyAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9FbWFpbF9MYXlvdXQnKTsgJGxmPSRyYy0+Z2V0RmlsZU5hbWUoKTsgfQogICAgJG9bJ2xheW91dF9mYWlsYXMnXT0kbGY7CiAgICBpZigkbGYpeyAkb1snbGF5b3V0X2I2NCddPWJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJGxmKSk7ICRvWydsYXlvdXRfbWQ1J109bWQ1X2ZpbGUoJGxmKTsgfQogICAgLyogNS4ga2FpcCBraXRpIHNhYmxvbmFpIGt2aWVjaWEgd3JhcCAtIHBhdnl6ZHlzIGlzIHJlZmlsbCAqLwogICAgaWYoJHRkICYmIGZpbGVfZXhpc3RzKCR0ZC4nL3JlZmlsbC5waHAnKSl7ICRvWydyZWZpbGxfYjY0J109YmFzZTY0X2VuY29kZShmaWxlX2dldF9jb250ZW50cygkdGQuJy9yZWZpbGwucGhwJykpOyB9CiAgICAvKiA2LiBhciB5cmEgcmVsZWFzZSBsb2dpa2EgZGlzcGF0Y2gnZSAqLwogICAgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0NvbnRhY3RfUG9saWN5JykpeyAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9Db250YWN0X1BvbGljeScpOyAkb1sncG9saWN5X2ZhaWxhcyddPSRyYy0+Z2V0RmlsZU5hbWUoKTsgJG9bJ3BvbGljeV9tZXRvZGFpJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPmdldE5hbWUoKTt9LCRyYy0+Z2V0TWV0aG9kcygpKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1sna2xhaWRhJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSk7Cg==';
const VER='dep-211603';
const GKEY='ps_s8';
const PHASES=["RECON"];
const OUT='analize/s1548_recon.json';
const DATA=[];
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
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
