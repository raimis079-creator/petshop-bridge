process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIEYxOSByZWNvbiBVSSt0ZW1wbGF0ZXMgdjEuMCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkdj1pc3NldCgkX0dFVFsncHNfZjE5J10pPyRfR0VUWydwc19mMTknXTonJzsKICBpZigkdiE9PSdSMScpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogICRvPWFycmF5KCd2Jz0+J0YxOVItMS4wJyk7CiAgdHJ5ewogICAgLy8gMS4gVmFyaWtsaW8gaXIgdmVpa3NtbyBmYWlsdSBzYWx0aW5pYWkKICAgICRmMT1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXByZW51bWVyYXRhLnBocCc7CiAgICAkb1sndmFyaWtsaXMnXT1hcnJheSgnbWQ1Jz0+bWQ1X2ZpbGUoJGYxKSwnZHlkaXMnPT5maWxlc2l6ZSgkZjEpLCdiNjQnPT5iYXNlNjRfZW5jb2RlKGZpbGVfZ2V0X2NvbnRlbnRzKCRmMSkpKTsKICAgICRmMj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXByZW51bWVyYXRhLXZlaWtzbWFzLnBocCc7CiAgICAkb1sndmVpa3NtYXNfbWQ1J109bWQ1X2ZpbGUoJGYyKTsKICAgIC8vIDIuIE15IEFjY291bnQgZW5kcG9pbnRhaQogICAgJG9bJ2FjY291bnRfZW5kcG9pbnRzJ109YXJyYXlfa2V5cyh3Y19nZXRfYWNjb3VudF9tZW51X2l0ZW1zKCkpOwogICAgJGRhc2g9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy9jbGFzcy1hY2NvdW50LWRhc2hib2FyZC5waHAnOwogICAgJG9bJ2Rhc2gnXT1maWxlX2V4aXN0cygkZGFzaCk/YXJyYXkoJ21kNSc9Pm1kNV9maWxlKCRkYXNoKSwnZHlkaXMnPT5maWxlc2l6ZSgkZGFzaCkpOidORVJBJzsKICAgIGlmKGZpbGVfZXhpc3RzKCRkYXNoKSl7CiAgICAgICRzcmM9ZmlsZV9nZXRfY29udGVudHMoJGRhc2gpOwogICAgICBwcmVnX21hdGNoX2FsbCgnL2FkZF9yZXdyaXRlX2VuZHBvaW50XHMqXChccypbXCciXShbXlwnIl0rKS8nLCRzcmMsJG0xKTsKICAgICAgcHJlZ19tYXRjaF9hbGwoJy93b29jb21tZXJjZV9hY2NvdW50XyhbYS16X10rKV9lbmRwb2ludC8nLCRzcmMsJG0yKTsKICAgICAgJG9bJ2Rhc2hfZW5kcG9pbnRzJ109YXJyYXkoJ3Jld3JpdGUnPT4kbTFbMV0sJ2hvb2tzJz0+YXJyYXlfdW5pcXVlKCRtMlsxXSkpOwogICAgfQogICAgLy8gMy4gU2FibG9udSByZWdpc3RyYXMg4oCUIGZsb3dzICsgZmFpbGFpCiAgICAkdGRpcj1XUF9QTFVHSU5fRElSLicvcGV0c2hvcC1jb3JlL3RlbXBsYXRlcy9lbWFpbHMnOwogICAgJG9bJ3NhYmxvbmFpJ109aXNfZGlyKCR0ZGlyKT9hcnJheV92YWx1ZXMoYXJyYXlfZGlmZihzY2FuZGlyKCR0ZGlyKSxhcnJheSgnLicsJy4uJykpKTonTkVSQSc7CiAgICAkZmxvd3M9YXBwbHlfZmlsdGVycygncGV0c2hvcF9lbWFpbF9mbG93cycsYXJyYXkoKSk7CiAgICAkb1snZmxvd3MnXT1pc19hcnJheSgkZmxvd3MpP2FycmF5X2tleXMoJGZsb3dzKTonTkUtQVJSQVknOwogICAgLy8gNC4gc3Vic2NyaXB0aW9uX3Q1IHNhYmxvbm8gYnV2aW1hcyBEQiB0dXJpbmlvIHNsdW9rc255amUKICAgIGdsb2JhbCAkd3BkYjsKICAgICRsdD0kd3BkYi0+cHJlZml4Lidwc19lbWFpbF90dXJpbnlzJzsKICAgICRvWyd0dXJpbnlzX2xlbnRlbGUnXT0kd3BkYi0+Z2V0X3ZhcigiU0hPVyBUQUJMRVMgTElLRSAneyRsdH0nIik/J1lSQSc6J05FUkEnOwogICAgaWYoJG9bJ3R1cmlueXNfbGVudGVsZSddPT09J1lSQScpewogICAgICAkb1sndHVyaW55c19mbG93cyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgZmxvd19rZXkgRlJPTSB7JGx0fSIpOwogICAgfQogICAgLy8gNS4gUTEwIFNLVSB3aGl0ZWxpc3Qgb3BjaWphCiAgICAkb1sncTEwX29wY2lqYSddPWdldF9vcHRpb24oJ3BldHNob3BfcHJlbnVtZXJhdGFfc2t1JyxudWxsKTsKICAgIC8vIDYuIHBhc2t5cmEgc2x1ZwogICAgJG9bJ215YWNjb3VudF9wYWdlJ109Z2V0X3Blcm1hbGluayh3Y19nZXRfcGFnZV9pZCgnbXlhY2NvdW50JykpOwogICAgLy8gNy4gcHJlbnVtZXJhdG9zIGxlbnRlbGVzIGJ1c2VuYQogICAgJHN0PSR3cGRiLT5wcmVmaXguJ3BzX3N1YnNjcmlwdGlvbnMnOwogICAgJG9bJ3N1Yl9jb3VudCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskc3R9Iik7CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAICcuJGUtPmdldEZpbGUoKS4nOicuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsKfSk7Cg==';
const VER='f19_recon-074146';
const GKEY='ps_f19';
const PHASES=["R1"];
const OUT='analize/f19_recon.json';
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
