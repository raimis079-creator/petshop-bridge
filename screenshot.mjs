process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGZsYWcgZ2FsdXRpbmUgcGF0aWtyYSAoaW4tc3RvY2spICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKChpc3NldCgkX0dFVFsncHNfZjE5J10pPyRfR0VUWydwc19mMTknXTonJykhPT0nVFAnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidHQUwtMS4wJyk7CiAgdHJ5ewogICAgZ2xvYmFsICR3cGRiOwogICAgJHBpZD0zNTA5OTsgJHByPXdjX2dldF9wcm9kdWN0KCRwaWQpOyAkc2t1PXN0cnRvdXBwZXIodHJpbSgkcHItPmdldF9za3UoKSkpOwogICAgJG9bJ3BpZCddPSRwaWQ7ICRvWydza3UnXT0kc2t1OyAkb1snaW5fc3RvY2snXT0kcHItPmlzX2luX3N0b2NrKCk/MTowOwogICAgJHNldD1mdW5jdGlvbigkZmwsJHNrdXMpdXNlKCR3cGRiKXsKICAgICAgJHdwZGItPnF1ZXJ5KCR3cGRiLT5wcmVwYXJlKCJVUERBVEUgeyR3cGRiLT5vcHRpb25zfSBTRVQgb3B0aW9uX3ZhbHVlPSVzIFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9panVuZ3RhJyIsJGZsKSk7CiAgICAgICR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFIHskd3BkYi0+b3B0aW9uc30gU0VUIG9wdGlvbl92YWx1ZT0lcyBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfc2t1JyIsc2VyaWFsaXplKCRza3VzKSkpOwogICAgICBkZWxldGVfdHJhbnNpZW50KCdwc19wcmVuX3NrdV9pZCcpOyB3cF9jYWNoZV9mbHVzaCgpOwogICAgfTsKICAgICR1cmw9Z2V0X3Blcm1hbGluaygkcGlkKTsKICAgICRzZXQoJ3RhaXAnLGFycmF5KCRza3UpKTsKICAgICRnMT13cF9yZW1vdGVfZ2V0KGFkZF9xdWVyeV9hcmcoJ3BzbmMnLHRpbWUoKSwkdXJsKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICRoMT13cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkZzEpOwogICAgJG9bJ29uJ109YXJyYXkoJ2Jsb2thcyc9PnN0cnBvcygkaDEsJ3BzLXByZW4tYmxva2FzJykhPT1mYWxzZT8nUk9ET01BUyc6J05FUk9ET01BUycsCiAgICAgICdyYWRpbzI4Jz0+c3RycG9zKCRoMSwna2FzIDQgc2F2YWl0ZXMnKSE9PWZhbHNlPydUJzonTicsCiAgICAgICdyYWRpbzQyJz0+c3RycG9zKCRoMSwna2FzIDYgc2F2YWl0ZXMnKSE9PWZhbHNlPydUJzonTicsCiAgICAgICd2aWVua2FydGluaXNfZGVmYXVsdCc9PnN0cnBvcygkaDEsJ3ZhbHVlPSIwIiBjaGVja2VkJykhPT1mYWxzZT8nVCc6J04nKTsKICAgICRzZXQoJ25lJyxhcnJheSgkc2t1KSk7CiAgICAkZzI9d3BfcmVtb3RlX2dldChhZGRfcXVlcnlfYXJnKCdwc25jJyx0aW1lKCkrOSwkdXJsKSxhcnJheSgndGltZW91dCc9PjMwLCdzc2x2ZXJpZnknPT5mYWxzZSwnaGVhZGVycyc9PmFycmF5KCdDYWNoZS1Db250cm9sJz0+J25vLWNhY2hlJykpKTsKICAgICRvWydvZmZfYmxva2FzJ109c3RycG9zKHdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRnMiksJ3BzLXByZW4tYmxva2FzJyk9PT1mYWxzZT8nTkVST0RPTUFTKGdlcmFpKSc6J1JPRE9NQVMoYmxvZ2FpKSc7CiAgICAvLyBhdHN0YXR5bWFzOiBmbGFnIG5lLCBza3UgdHVzY2lhcwogICAgJHNldCgnbmUnLGFycmF5KCkpOwogICAgJG9bJ2dhbHV0aW5pcyddPWFycmF5KCdmbGFnJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBvcHRpb25fdmFsdWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lPSdwc19wcmVudW1lcmF0YV9panVuZ3RhJyIpLAogICAgICAnc2t1Jz0+Y291bnQoKGFycmF5KW1heWJlX3Vuc2VyaWFsaXplKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3B0aW9uX3ZhbHVlIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZT0ncHNfcHJlbnVtZXJhdGFfc2t1JyIpKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0pOwo=';
const VER='f19_gal-103303';
const GKEY='ps_f19';
const PHASES=["TP"];
const OUT='analize/f19_gal_1788085983.json';
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
