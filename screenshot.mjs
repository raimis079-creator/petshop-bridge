process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIE1vbm8gTG9va3VwIFN5bmMgdjIgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICRyID0gJF9HRVRbJ3BzX21vbm9zeW5jJ10gPz8gJyc7CiBpZiggJHIhPT0nRElBRycgJiYgJHIhPT0nRklYJyApIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRvPVsndic9PidNT05PU1lOQzInLCdyZXppbWFzJz0+JHJdOwogJGx0ID0gJHdwZGItPnByZWZpeC4nd2NfcHJvZHVjdF9hdHRyaWJ1dGVzX2xvb2t1cCc7CgogLy8gcHJvZHVrdGFpIChiZXQga29raW8gc3RhdHVzbyksIGt1cmllIFRJS1JBSSB0dXJpIHBhX21vbm9wcm90ZWluPXRhaXAKICR0dXJpID0gJHdwZGItPmdldF9jb2woIgogICBTRUxFQ1QgRElTVElOQ1QgcC5JRCBGUk9NIHskd3BkYi0+cG9zdHN9IHAKICAgSk9JTiB7JHdwZGItPnRlcm1fcmVsYXRpb25zaGlwc30gdHIgT04gdHIub2JqZWN0X2lkPXAuSUQKICAgSk9JTiB7JHdwZGItPnRlcm1fdGF4b25vbXl9IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZAogICBXSEVSRSB0dC50YXhvbm9teT0ncGFfbW9ub3Byb3RlaW4nIEFORCB0dC50ZXJtX2lkPTI5NSBBTkQgcC5wb3N0X3R5cGUgSU4gKCdwcm9kdWN0JywncHJvZHVjdF92YXJpYXRpb24nKSIpOwogJG9bJ3R1cmlfdGVybWluYSddPWNvdW50KCR0dXJpKTsKICRvWydsb29rdXBfcHJpZXMnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkbHQgV0hFUkUgdGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyBBTkQgdGVybV9pZD0yOTUiKTsKCiAkaW4gPSAkdHVyaSA/IGltcGxvZGUoJywnLGFycmF5X21hcCgnaW50dmFsJywkdHVyaSkpIDogJzAnOwogJG9bJ25lc3V0YW1wYSddID0gKGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJGx0IFdIRVJFIHRheG9ub215PSdwYV9tb25vcHJvdGVpbicgQU5EIHRlcm1faWQ9Mjk1IEFORCBwcm9kdWN0X29yX3BhcmVudF9pZCBOT1QgSU4gKCRpbikiKTsKCiBpZigkcj09PSdGSVgnKXsKICAgJG9bJ2lzdHJpbnRhJ10gPSAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NICRsdCBXSEVSRSB0YXhvbm9teT0ncGFfbW9ub3Byb3RlaW4nIEFORCB0ZXJtX2lkPTI5NSBBTkQgcHJvZHVjdF9vcl9wYXJlbnRfaWQgTk9UIElOICgkaW4pIik7CiAgICRvWydsb29rdXBfcG8nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkbHQgV0hFUkUgdGF4b25vbXk9J3BhX21vbm9wcm90ZWluJyBBTkQgdGVybV9pZD0yOTUiKTsKICAgJG9bJ2xvb2t1cF9uZSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICRsdCBXSEVSRSB0YXhvbm9teT0ncGFfbW9ub3Byb3RlaW4nIEFORCB0ZXJtX2lkPTI5NiIpOwogICB3cF9jYWNoZV9mbHVzaCgpOyBkZWxldGVfdHJhbnNpZW50KCd3Y190ZXJtX2NvdW50cycpOwogICB3cF91cGRhdGVfdGVybV9jb3VudF9ub3coWzI5NSwyOTZdLCdwYV9tb25vcHJvdGVpbicpOwogfQogLy8gZ2FsdXRpbmVzIGtvbnRyb2xlcwogJG1rPWZ1bmN0aW9uKCRjYXQpeyAkcT1uZXcgV1BfUXVlcnkoWydwb3N0X3R5cGUnPT4ncHJvZHVjdCcsJ3Bvc3Rfc3RhdHVzJz0+J3B1Ymxpc2gnLCdwb3N0c19wZXJfcGFnZSc9PjEsJ2ZpZWxkcyc9PidpZHMnLAogICAndGF4X3F1ZXJ5Jz0+WydyZWxhdGlvbic9PidBTkQnLFsndGF4b25vbXknPT4ncHJvZHVjdF9jYXQnLCdmaWVsZCc9PidzbHVnJywndGVybXMnPT4kY2F0XSwKICAgWyd0YXhvbm9teSc9PidwYV9tb25vcHJvdGVpbicsJ2ZpZWxkJz0+J3NsdWcnLCd0ZXJtcyc9PlsndGFpcCddXV1dKTsgcmV0dXJuIChpbnQpJHEtPmZvdW5kX3Bvc3RzOyB9OwogJG9bJ21haXN0YXNfc3VuaW1zJ109JG1rKCdtYWlzdGFzLXN1bmltcycpOwogJG9bJ21haXN0YXNfa2F0ZW1zJ109JG1rKCdtYWlzdGFzLWthdGVtcycpOwogJG9bJ3NrYW5lc3RhaV9zdW5pbXMnXT0kbWsoJ3NrYW5lc3RhaS1zdW5pbXMnKTsKICRvWydza2FuZXN0YWlfa2F0ZW1zJ109JG1rKCdza2FuZXN0YWkta2F0ZW1zJyk7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDUpOwo='; const VER='MONOSYNC2'; const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){ const u='https://api.github.com/repos/'+REPO+'/contents/'+path; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha; return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
async function fx(u,o,k){ for(let i=0;i<6;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000); } } throw new Error('fx:'+k); }
let sid=null;
try{
  const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){ await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Mono Lookup Sync v2',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  sid=JSON.parse(await c.text()).id; await miegok(8000);
  const d=await fx(WP+'/?ps_monosync=DIAG',{headers:{'Cache-Control':'no-cache'}},'diag');
  const dt=await d.text(); try{ out.diag=JSON.parse(dt); }catch(e){ out.diag_zalias=dt.slice(0,900); }
  if(out.diag && out.diag.turi_termina){
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:true})});
    await miegok(8000);
    const f=await fx(WP+'/?ps_monosync=FIX',{headers:{'Cache-Control':'no-cache'}},'fix');
    const ft=await f.text(); try{ out.fix=JSON.parse(ft); }catch(e){ out.fix_zalias=ft.slice(0,900); }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
out.fe={};
for(const [k,u] of Object.entries({
  sunims: WP+'/kategorija/sunims/maistas-sunims/?yith_wcan=1&filter_monoprotein=taip',
  katems: WP+'/kategorija/katems/maistas-katems/?yith_wcan=1&filter_monoprotein=taip',
  skanestai: WP+'/kategorija/sunims/skanestai-sunims/?yith_wcan=1&filter_monoprotein=taip'})){
  try{ const h=await (await fx(u,{headers:{'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'}},k)).text();
    out.fe[k]=(h.match(/woocommerce-result-count[\s\S]{0,180}?<\/p>/)||[''])[0].replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').slice(0,110);
  }catch(e){ out.fe[k]='klaida'; }
}
await put('deploy/mono_sync.json', Buffer.from(JSON.stringify(out,null,1)), VER);
