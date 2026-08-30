process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSBlaWxlcyBsYXVraWEgcGF0aWtyYSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2YxOSddKT8kX0dFVFsncHNfZjE5J106JycpIT09J1RDJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgJG89YXJyYXkoJ3YnPT4nRjE5RUlMLTEuMCcpOwogIHRyeXsKICAgIGdsb2JhbCAkd3BkYjsgJHQ9UGV0c2hvcF9QcmVudW1lcmF0YTo6dCgpOyAkdGU9UGV0c2hvcF9QcmVudW1lcmF0YTo6dGUoKTsKICAgICRwaWQ9KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG9zdF9zdGF0dXM9J3B1Ymxpc2gnIE9SREVSIEJZIElEIERFU0MgTElNSVQgMSIpOwogICAgJGVtPSdlaWwnLnRpbWUoKS4nQGd5dnVuYWkubHQnOwogICAgJHNpZD1QZXRzaG9wX1ByZW51bWVyYXRhOjpzdWt1cnRpKGFycmF5KCdlbWFpbCc9PiRlbSwncHJvZHVjdF9pZCc9PiRwaWQsCiAgICAgICduZXh0X2N5Y2xlX2RhdGUnPT5nbWRhdGUoJ1ktbS1kJyx0aW1lKCkrMyo4NjQwMCkpKTsKICAgICRhZG09Z2V0X3VzZXJzKGFycmF5KCdyb2xlJz0+J2FkbWluaXN0cmF0b3InLCdudW1iZXInPT4xLCdmaWVsZHMnPT4nSUQnKSk7ICR1aWQ9KGludCkkYWRtWzBdOwogICAgJGNpej1hcnJheShuZXcgV1BfSHR0cF9Db29raWUoYXJyYXkoJ25hbWUnPT5MT0dHRURfSU5fQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsdGltZSgpKzEyMCwnbG9nZ2VkX2luJykpKSwKICAgICAgICAgICAgICAgbmV3IFdQX0h0dHBfQ29va2llKGFycmF5KCduYW1lJz0+U0VDVVJFX0FVVEhfQ09PS0lFLCd2YWx1ZSc9PndwX2dlbmVyYXRlX2F1dGhfY29va2llKCR1aWQsdGltZSgpKzEyMCwnc2VjdXJlX2F1dGgnKSkpKTsKICAgICRnPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wZXRzaG9wLXByZW51bWVyYXRvcyZ0PWVpbGUnKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwnY29va2llcyc9PiRjaXopKTsKICAgICRoPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnKTsKICAgICRvWydsYXVraWFfbWF0b21hJ109c3RycG9zKCRoLCRlbSkhPT1mYWxzZT8nVCc6J04nOwogICAgJG9bJ3NrYWl0bGl1a2FzJ109cHJlZ19tYXRjaCgnL0xhdWtpYSBrbGllbnRvIHBhdHZpcnRpbmltb1teKF0qXCgoXGQrKVwpL3UnLCRoLCRtKT8oaW50KSRtWzFdOidORVJBU1RBJzsKICAgICR3cGRiLT5kZWxldGUoJHQsYXJyYXkoJ2lkJz0+JHNpZCkpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJERUxFVEUgRlJPTSB7JHRlfSBXSEVSRSBzdWJzY3JpcHRpb25faWQ9JWQiLCRzaWQpKTsKICAgICRvWyd2YWx5bWFzJ109YXJyYXkoKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR0fSIpLChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskdGV9IikpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='f19_eile-085336';
const GKEY='ps_f19';
const PHASES=["TC"];
const OUT='analize/f19_eile.json';
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
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,1500); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
