process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGlzdG9yaWphIHN1c2llamltYXMgcGF2YWRpbmltdSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2pvJ10pfHwkX0dFVFsncHNfam8nXSE9PSdBJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IHNldF90aW1lX2xpbWl0KDIwMCk7ICRvPWFycmF5KCk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJFRFPSRwLidwc19pc3RfZWlsdXRlcyc7CiAgJG5vcm09ZnVuY3Rpb24oJHMpeyAkcz1odG1sX2VudGl0eV9kZWNvZGUoKHN0cmluZykkcyxFTlRfUVVPVEVTLCdVVEYtOCcpOyAkcz1tYl9zdHJ0b2xvd2VyKCRzKTsgJHM9c3RyX3JlcGxhY2UoYXJyYXkoJ+KAkycsJ+KAlCcpLCctJywkcyk7ICRzPXByZWdfcmVwbGFjZSgnL1xzKihbLFwtXC8rJigpXSlccyovdScsJyQxJywkcyk7ICRzPXByZWdfcmVwbGFjZSgnL1xzKy91JywnICcsJHMpOyByZXR1cm4gdHJpbSgkcyk7IH07CiAgJHByb2Q9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90aXRsZSxwb3N0X3N0YXR1cyxwb3N0X3R5cGUgRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIElOICgncHJvZHVjdCcsJ3Byb2R1Y3RfdmFyaWF0aW9uJykgQU5EIHBvc3Rfc3RhdHVzIElOICgncHVibGlzaCcsJ2RyYWZ0JywncHJpdmF0ZScpIixBUlJBWV9BKTsKICAkbWFwPWFycmF5KCk7IGZvcmVhY2goJHByb2QgYXMgJHIpeyAkaz0kbm9ybSgkclsncG9zdF90aXRsZSddKTsgaWYoJGs9PT0nJykgY29udGludWU7IGlmKCFpc3NldCgkbWFwWyRrXSl8fCgkbWFwWyRrXVsxXSE9PSdwdWJsaXNoJyYmJHJbJ3Bvc3Rfc3RhdHVzJ109PT0ncHVibGlzaCcpKSAkbWFwWyRrXT1hcnJheSgoaW50KSRyWydJRCddLCRyWydwb3N0X3N0YXR1cyddKTsgfQogICRvWyd3Y19wYXZhZGluaW11J109Y291bnQoJG1hcCk7CiAgJG5lPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG1vZGVsaXMscGF2YWRpbmltYXMsQ09VTlQoKikgbixST1VORChTVU0oc3VtYSkpIHN1bWEgRlJPTSBgJFRFYCBXSEVSRSB3Y19wcm9kdWN0X2lkIElTIE5VTEwgR1JPVVAgQlkgbW9kZWxpcyxwYXZhZGluaW1hcyIsQVJSQVlfQSk7CiAgJG9bJ3ByaWVzJ109YXJyYXkoJ2dydXBpdSc9PmNvdW50KCRuZSksJ2VpbHVjaXUnPT4oaW50KWFycmF5X3N1bShhcnJheV9jb2x1bW4oJG5lLCduJykpKTsKICAkbW09MDskbWw9MDskbXM9MDskZHJhZnRzPTA7JGxpa289YXJyYXkoKTsKICBmb3JlYWNoKCRuZSBhcyAkcil7ICRrPSRub3JtKCRyWydwYXZhZGluaW1hcyddKTsgaWYoaXNzZXQoJG1hcFska10pKXsgJHBpZD0kbWFwWyRrXVswXTsgaWYoJG1hcFska11bMV0hPT0ncHVibGlzaCcpJGRyYWZ0cysrOyAkd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIlVQREFURSBgJFRFYCBTRVQgd2NfcHJvZHVjdF9pZD0lZCwgc3VzaWVqaW1hcz0ncGF2YWRpbmltYXMnIFdIRVJFIHdjX3Byb2R1Y3RfaWQgSVMgTlVMTCBBTkQgbW9kZWxpcz0lcyBBTkQgcGF2YWRpbmltYXM9JXMiLCRwaWQsJHJbJ21vZGVsaXMnXSwkclsncGF2YWRpbmltYXMnXSkpOyAkbW0rKzsgJG1sKz0kclsnbiddOyAkbXMrPSRyWydzdW1hJ107IH0gZWxzZSAkbGlrb1tdPSRyOyB9CiAgJG9bJ3N1c2lldGEnXT1hcnJheSgnZ3J1cGl1Jz0+JG1tLCdlaWx1Y2l1Jz0+JG1sLCdzdW1hJz0+JG1zLCdpc19qdV9kcmFmdCc9PiRkcmFmdHMpOwogIHVzb3J0KCRsaWtvLGZ1bmN0aW9uKCRhLCRiKXtyZXR1cm4gJGJbJ3N1bWEnXTw9PiRhWydzdW1hJ107fSk7ICRvWydsaWtvX3RvcDI1J109YXJyYXlfbWFwKGZ1bmN0aW9uKCRyKXtyZXR1cm4gJHJbJ21vZGVsaXMnXS4nIHwgJy4kclsnbiddLicgfCAnLiRyWydzdW1hJ10uJyB8ICcubWJfc3Vic3RyKCRyWydwYXZhZGluaW1hcyddLDAsNzApO30sYXJyYXlfc2xpY2UoJGxpa28sMCwyNSkpOwogICRvWydwbyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgU1VNKHdjX3Byb2R1Y3RfaWQgSVMgTk9UIE5VTEwpIHN1LCBDT1VOVCgqKSBuLCBST1VORCgxMDAqU1VNKElGKHdjX3Byb2R1Y3RfaWQgSVMgTk9UIE5VTEwsc3VtYSwwKSkvU1VNKHN1bWEpLDEpIHBjdF9zdW1vcywgU1VNKHN1c2llamltYXM9J3NrdScpIHNrdSwgU1VNKHN1c2llamltYXM9J3BhdmFkaW5pbWFzJykgcGF2IEZST00gYCRURWAiLEFSUkFZX0EpOwogICRvWydqb3NlcmFfbGlrbyddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgQ09VTlQoKikgbiwgUk9VTkQoU1VNKHN1bWEpKSBzIEZST00gYCRURWAgV0hFUkUgd2NfcHJvZHVjdF9pZCBJUyBOVUxMIEFORCBwYXZhZGluaW1hcyBMSUtFICclSm9zZXJhJSciLEFSUkFZX0EpOwogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-155757';
const GKEY='ps_jo';
const PHASES=["A"];
const OUT='analize/jos_apply.json';
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
