process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgwIChRQSMzIHJlenVsdGF0YXMgKyBURU1QIHRyeW5pbWFzKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfcjgwJ10pPyRfR0VUWydwc19yODAnXTonJzsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTgwJyk7CiAgdHJ5ewogICAgJG9bJ3Nlb19xYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLGRhdGFfYXQsdGlwYXMsdGlrcmludGEsb2ssTEVGVChrbGFpZG9zLDE1MDApIGtsYWlkb3Msc2FudHJhdWthIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc2VvX3FhIFdIRVJFIHRpcGFzPSdyZWRpcmVjdCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAyIixBUlJBWV9BKTsKICAgICRvWydzZW9fNDA0X3NpYW5kaWVuX2JvdCddPSR3cGRiLT5nZXRfcm93KCR3cGRiLT5wcmVwYXJlKCJTRUxFQ1QgQ09VTlQoKikgbixTVU0oaGl0cykgaCxTVU0oYm90X2hpdHMpIGIgRlJPTSB7JHdwZGItPnByZWZpeH1wc19zZW9fNDA0IFdIRVJFIGRpZW5hPSVzIixnbWRhdGUoJ1ktbS1kJykpLEFSUkFZX0EpOwogICAgJG9bJ2ltZ19zbHVncyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIElELHBvc3RfbmFtZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfdHlwZT0nYXR0YWNobWVudCcgQU5EIHBvc3RfbmFtZSBMSUtFICclLWltZycgT1JERVIgQlkgSUQiLEFSUkFZX0EpOwogICAgJG9bJ2FrdHl2dXNfcHJpZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChpZCwnICcsbmFtZSkgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTEiKTsKICAgIC8vIGRlYWt0eXZ1b3RpIHZpc3VzIFRFTVAgKGnFoXNreXJ1cyBlaW5hbcSFasSvKSBpciB0cmludGkgbmVha3R5dml1czsgZWluYW1hc2lzIGRlYWt0eXZ1b2phbWFzIG1qcyBwYWJhaWdvamUg4oaSIHRyaW50aSBraXTEhSBydW7EhQogICAgJGN1cj0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGlkIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0xIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIpOwogICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUlJyBBTkQgaWQ8PiVkIiwkY3VyKSk7CiAgICAkb1snaXN0cmludGEnXT0kd3BkYi0+cXVlcnkoJHdwZGItPnByZXBhcmUoIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUlJyBBTkQgYWN0aXZlPTAgQU5EIGlkPD4lZCIsJGN1cikpOwogICAgJG9bJ2xpa28nXT0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIENPTkNBVChpZCwnICcsbmFtZSwnIGE9JyxhY3RpdmUpIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICAgICRvWydzbmlwc192aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-162408';
const GKEY='ps_r80';
const PHASES=["GO"];
const OUT='analize/s1580.json';
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
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
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
