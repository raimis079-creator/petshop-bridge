process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIHBhdGlrcmEgdjEuMCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZigoaXNzZXQoJF9HRVRbJ3BzX2UzJ10pPyRfR0VUWydwc19lMyddOicnKSE9PSdQMScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0UzUC0xLjAnKTsKICB0cnl7CiAgICAkYWRtPWdldF91c2VycyhhcnJheSgncm9sZSc9PidhZG1pbmlzdHJhdG9yJywnbnVtYmVyJz0+MSwnZmllbGRzJz0+J0lEJykpOwogICAgJHVpZD0oaW50KSRhZG1bMF07CiAgICAkYz13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLHRpbWUoKSsxMjAsJ3NlY3VyZV9hdXRoJyk7CiAgICAkbD13cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLHRpbWUoKSsxMjAsJ2xvZ2dlZF9pbicpOwogICAgJGNrPVNFQ1VSRV9BVVRIX0NPT0tJRS4nPScuJGMuJzsgJy5MT0dHRURfSU5fQ09PS0lFLic9Jy4kbDsKICAgICRyPXdwX3JlbW90ZV9nZXQoYWRtaW5fdXJsKCdhZG1pbi5waHA/cGFnZT1wZXRzaG9wLXJlenVsdGF0YWkmbGFpa290YXJwaXM9MCcpLAogICAgICBhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdDb29raWUnPT4kY2spKSk7CiAgICBpZihpc193cF9lcnJvcigkcikpeyAkb1snU1RPUCddPSRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyBlY2hvIGpzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogICAgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOwogICAgJG9bJ2h0dHAnXT13cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcik7CiAgICAkb1snaWxnaXMnXT1zdHJsZW4oJGgpOwogICAgJG9bJ3N0b3BnbyddPXN0cnBvcygkaCwnU3RvcCAvIGdvJykhPT1mYWxzZT8nVEFJUCc6J05FJzsKICAgICRvWydrb3J0b3MnXT1zdWJzdHJfY291bnQoJGgsJ2NsYXNzPSJrb3J0Jyk7CiAgICAkb1snZ3J1cGVzJ109YXJyYXkoCiAgICAgIHN0cnBvcygkaCwnaXIgcGFza3lyb3MgbGFpJykhPT1mYWxzZT8ndHJhbnMnOictJywKICAgICAgc3RycG9zKCRoLCdQYXNsYXVnaW5pYWknKSE9PWZhbHNlPydzZXJ2JzonLScsCiAgICAgIHN0cnBvcygkaCwnUmlua29kYXJvcycpIT09ZmFsc2U/J21hcmsnOictJyk7CiAgICAkb1snYmFuZ3VfcGFzdGFiYSddPXN0cnBvcygkaCwnZGFyIG5lYnV2bycpIT09ZmFsc2U/J1RBSVAnOidORSc7CiAgICAkb1snd2FybmluZyddPXByZWdfbWF0Y2goJy8oV2FybmluZ3xOb3RpY2V8RmF0YWx8RGVwcmVjYXRlZCk6LycsJGgpPydZUkEnOidORVJBJzsKICAgICRvWydtZW5pdV9tYXRvbWFzJ109c3RycG9zKCRoLCdwZXRzaG9wLXJlenVsdGF0YWknKSE9PWZhbHNlPydUQUlQJzonTkUnOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='e3_patikra-202230';
const GKEY='ps_e3';
const PHASES=["P1"];
const OUT='analize/e3_patikra.json';
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
