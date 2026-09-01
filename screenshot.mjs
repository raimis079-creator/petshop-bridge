process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3IHJlY29uIGFkYXB0ZXJpcyAqLwphZGRfYWN0aW9uKCdpbml0JyxmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfcmMnXSl8fCRfR0VUWydwc19yYyddIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NDcnKTsKICB0cnl7CiAgICAkZnM9YXJyYXkoJ3BldHNob3AtYXRhc2thaXRhLWF0c2FyZ29zJywncGV0c2hvcC1hdGFza2FpdGEta2xpZW50YWknLCdwZXRzaG9wLWF0YXNrYWl0YS1wcmVrZXMnLCdwZXRzaG9wLWF0YXNrYWl0YS1wYXJkYXZpbWFpJywncGV0c2hvcC1hdGFza2FpdGEtbWVudW8nLCdwZXRzaG9wLWF0YXNrYWl0b3MtdWknLCdwZXRzaG9wLWRpbS1rbGllbnRhaScsJ3BldHNob3AtZmFrdGFpJywncGV0c2hvcC1rbGllbnRhaScsJ3BldHNob3AtYXRhc2thaXR1LWFncmVnYXZpbWFzJywncGV0c2hvcC1yZXp1bHRhdGFpJyk7CiAgICBmb3JlYWNoKCRmcyBhcyAkZil7ICRwPVdQTVVfUExVR0lOX0RJUi4nLycuJGYuJy5waHAnOyAkb1snbWQ1J11bJGZdPWZpbGVfZXhpc3RzKCRwKT9tZDVfZmlsZSgkcCkuJyAnLmZpbGVzaXplKCRwKTonTsSWUkEnOyB9CiAgICAkbXU9Z2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSoucGhwJyk7ICRvWydtdV9hdGFza2FpdCddPWFycmF5X3ZhbHVlcyhhcnJheV9maWx0ZXIoYXJyYXlfbWFwKCdiYXNlbmFtZScsJG11KSxmdW5jdGlvbigkeCl7cmV0dXJuIHByZWdfbWF0Y2goJy9hdGFza2FpdHxmYWt0fGRpbXxrYW5hbHxrbGllbnQvJywkeCk7fSkpOwogICAgZm9yZWFjaChhcnJheSgncHNfZmFrdF91enNha3ltYWknLCdwc19mYWt0X2VpbHV0ZXMnLCdwc19kaW1fa2xpZW50YWknLCdwc19pc3RfdXpzYWt5bWFpJywncHNfaXN0X2VpbHV0ZXMnLCdwc19rbF9zdXZlc3RpbmUnLCdwc19mYWt0X2F0c2FyZ29zX2QnKSBhcyAkdCl7CiAgICAgICR0bj0kd3BkYi0+cHJlZml4LiR0OyAkYz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNIT1cgQ09MVU1OUyBGUk9NICR0biIsQVJSQVlfQSk7CiAgICAgICRvWydzY2hlbWEnXVskdF09JGM/YXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ0ZpZWxkJ10uJzonLiRyWydUeXBlJ107fSwkYyk6J07EllJBJzsKICAgICAgJG9bJ24nXVskdF09KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHRuIik7CiAgICB9CiAgICAkb1snZmFrdF9taW5fbWF4J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNSU4oZGF0YSkgbW4sTUFYKGRhdGEpIG14IEZST00geyR3cGRiLT5wcmVmaXh9cHNfZmFrdF91enNha3ltYWkiLEFSUkFZX0EpOwogICAgJG9bJ2lzdF9taW5fbWF4J109JHdwZGItPmdldF9yb3coIlNFTEVDVCBNSU4oZGF0YSkgbW4sTUFYKGRhdGEpIG14IEZST00geyR3cGRiLT5wcmVmaXh9cHNfaXN0X3V6c2FreW1haSIsQVJSQVlfQSk7CiAgICAkb1snaXN0X3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1wc19pc3RfdXpzYWt5bWFpIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMiIsQVJSQVlfQSk7CiAgICAkb1snaXN0X2VpbF9zYW1wbGUnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCAqIEZST00geyR3cGRiLT5wcmVmaXh9cHNfaXN0X2VpbHV0ZXMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAyIixBUlJBWV9BKTsKICAgICRvWydmYWt0X3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1wc19mYWt0X3V6c2FreW1haSBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDEiLEFSUkFZX0EpOwogICAgJG9bJ2Zha3RfZWlsX3NhbXBsZSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHdwZGItPnByZWZpeH1wc19mYWt0X2VpbHV0ZXMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICAgICRvWydpc3Rfc3RhdHVzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXNhcyxpdnlrZHl0YXMsQ09VTlQoKikgbiBGUk9NIHskd3BkYi0+cHJlZml4fXBzX2lzdF91enNha3ltYWkgR1JPVVAgQlkgMSwyIixBUlJBWV9BKTsKICAgICRvWydpc3Rfc3VzaWVqaW1hcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN1c2llamltYXMsQ09VTlQoKikgbixST1VORChTVU0oc3VtYSkpIHMgRlJPTSB7JHdwZGItPnByZWZpeH1wc19pc3RfZWlsdXRlcyBHUk9VUCBCWSAxIixBUlJBWV9BKTsKICAgICRvWydvcHQnXT1hcnJheSgncGVyanVuZ2ltb19kYXRhJz0+Z2V0X29wdGlvbigncHNfcGVyanVuZ2ltb19kYXRhJyksJ3BzX2FuYWxpemVfc2FsdGluaXMnPT5nZXRfb3B0aW9uKCdwc19hbmFsaXplX3NhbHRpbmlzJykpOwogICAgZm9yZWFjaChhcnJheSgncHNfaXN0XycsJ3BzX3Blcmp1bmcnLCdzYWx0aW5pcycpIGFzICRrKXsgJG9bJ29wdF9saWtlJ11bJGtdPSR3cGRiLT5nZXRfY29sKCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJXMiLCclJy4kay4nJScpKTsgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-072906';
const GKEY='ps_rc';
const PHASES=["GO"];
const OUT='analize/s1547_recon.json';
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
