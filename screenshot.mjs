process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEUzIHJlY29uMiB2MS4wICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZTMnXSk/JF9HRVRbJ3BzX2UzJ106JycpIT09J1IyJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiAgZ2xvYmFsICR3cGRiOyAkbz1hcnJheSgndic9PidFM1IyJyk7CiAgdHJ5ewogICAgJHQ9JHdwZGItPnByZWZpeC4nd2Nfb3JkZXJzJzsKICAgICRvWyd5cmEnXT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAnJHQnIik/J1RBSVAnOidORSc7CiAgICAkb1snc3R1bHBlbGlhaSddPSR3cGRiLT5nZXRfY29sKCJERVNDUklCRSBgJHRgIiwwKTsKICAgICRvWydpbmRla3NhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBJTkRFWCBGUk9NIGAkdGAiLEFSUkFZX0EpOwogICAgJG9bJ2luZGVrc2FpJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZShhcnJheV9tYXAoZnVuY3Rpb24oJHIpe3JldHVybiAkclsnS2V5X25hbWUnXS4nOicuJHJbJ0NvbHVtbl9uYW1lJ107fSwkb1snaW5kZWtzYWknXSkpKTsKICAgICRvWydzdGF0dXNhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxDT1VOVCgqKSBjIEZST00gYCR0YCBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBHUk9VUCBCWSBzdGF0dXMiLEFSUkFZX0EpOwogICAgJG9bJ3B2eiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsc3RhdHVzLHRvdGFsX2Ftb3VudCxiaWxsaW5nX2VtYWlsLGRhdGVfY3JlYXRlZF9nbXQgRlJPTSBgJHRgIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='e3_recon2-203207';
const GKEY='ps_e3';
const PHASES=["R2"];
const OUT='analize/e3_recon2.json';
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
