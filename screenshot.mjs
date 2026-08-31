process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGNvbnNlbnQtY2hhbmdlZCB2MiB0ZXN0aW5pcyBzaXVudGltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19jYyddKXx8JF9HRVRbJ3BzX2NjJ10hPT0nU0VORCcpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgndic9PidDQzInKTsKICB0cnl7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsKICAgICRyPVBldHNob3BfRW1haWxfRGlzcGF0Y2g6OmVucXVldWUoJ2NvbnNlbnRfY2hhbmdlZCcsJ3RlcnJhQGd5dnVuYWkubHQnLGFycmF5KCduYW1lJz0+JycsJ2dyYW50ZWQnPT50cnVlLCdzb3VyY2UnPT4nZm9vdGVyX2Zvcm0nLCdjaGFuZ2VkX2F0Jz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdwcmVmc191cmwnPT5ob21lX3VybCgnL3Bhc2t5cmEvJykpLGFycmF5KCdqb2Jfa2V5Jz0+J25sX3Rlc3RfUzE1MzZfJy50aW1lKCkpKTsKICAgICRvWydlbnF1ZXVlJ109JHI7IGRvX2FjdGlvbigncHNfZW1haWxfZGlzcGF0Y2hfY3JvbicpOwogICAgJG9bJ2pvYiddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsc3RhdHVzLHByb3ZpZGVyX21lc3NhZ2VfaWQsc2VudF9hdCxsYXN0X2Vycm9yLGVycm9yX21lc3NhZ2UgRlJPTSB7JHB9cHNfZW1haWxfam9icyBXSEVSRSBqb2Jfa2V5IExJS0UgJ25sX3Rlc3RfUzE1MzZfJScgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-075351';
const GKEY='ps_cc';
const PHASES=["SEND"];
const OUT='analize/cc_send.json';
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
