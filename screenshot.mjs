process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEwMyddKSA/ICRfR0VUWydwc19oMTAzJ10gOiAnJykgIT09ICdBUFBMWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTAzJyk7CiAkdXAgPSB3cF91cGxvYWRfZGlyKCk7ICRiayA9IHRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSkuJ3BzLWJhY2t1cHMnOwogaWYoIWlzX2RpcigkYmspKSBAbWtkaXIoJGJrLCAwNzU1LCB0cnVlKTsKCiAvKiByYXN0aSBWSVNVUyB0ZXJtaW51cyBzdSBlc3liZW1pcywgbmUgdGlrIHplbmtsdXMgKi8KICRlaWwgPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoCiAgIlNFTEVDVCB0LnRlcm1faWQsIHQubmFtZSwgdC5zbHVnLCB0dC50YXhvbm9teSwgdHQuY291bnQKICAgRlJPTSB7JFB9dGVybXMgdCBKT0lOIHskUH10ZXJtX3RheG9ub215IHR0IE9OIHQudGVybV9pZD10dC50ZXJtX2lkCiAgIFdIRVJFIHQubmFtZSBSRUdFWFAgJyZbYS16QS1aXSs7fCYjWzAtOV0rOycgT1JERVIgQlkgdC50ZXJtX2lkIiwgQVJSQVlfQSk7CiAkb1sncmFzdGEnXSA9IGNvdW50KCRlaWwpOwoKIC8qIEtPUElKQSAqLwogJGtmID0gJGJrLicvdGVybXNfaDEwMy5qc29uJzsKIEBmaWxlX3B1dF9jb250ZW50cygka2YsIHdwX2pzb25fZW5jb2RlKCRlaWwsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpKTsKICRvWydrb3BpamEnXSA9IGZpbGVfZXhpc3RzKCRrZikgPyBmaWxlc2l6ZSgka2YpIDogJ05FUEFWWUtPJzsKIGlmKCFmaWxlX2V4aXN0cygka2YpKXsKICAgJG9bJ05VVFJBVUtUQSddPSdrb3BpamEgbmVzdWt1cnRhJzsKICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7CiB9CgogJG9rPTA7ICRrbD0wOyAkc2FyPWFycmF5KCk7CiBmb3JlYWNoKCRlaWwgYXMgJHIpewogICAkcHJpZXMgPSAkclsnbmFtZSddOyAkcG8gPSAkcHJpZXM7CiAgIGZvcigkaT0wOyRpPDQ7JGkrKyl7ICRuID0gaHRtbF9lbnRpdHlfZGVjb2RlKCRwbywgRU5UX1FVT1RFU3xFTlRfSFRNTDUsICdVVEYtOCcpOyBpZigkbj09PSRwbykgYnJlYWs7ICRwbz0kbjsgfQogICBpZigkcG8gPT09ICRwcmllcykgY29udGludWU7CiAgIC8qIFNMVUcgTkVMSUVDSUFNQVMg4oCUIHRpayB2YXJkYXMgKi8KICAgJHJlcyA9ICR3cGRiLT51cGRhdGUoJHdwZGItPnRlcm1zLCBhcnJheSgnbmFtZSc9PiRwbyksIGFycmF5KCd0ZXJtX2lkJz0+KGludCkkclsndGVybV9pZCddKSwgYXJyYXkoJyVzJyksIGFycmF5KCclZCcpKTsKICAgaWYoJHJlcyA9PT0gZmFsc2UpeyAka2wrKzsgfQogICBlbHNlIHsgJG9rKys7IGNsZWFuX3Rlcm1fY2FjaGUoKGludCkkclsndGVybV9pZCddLCAkclsndGF4b25vbXknXSk7CiAgICAgICAgICAkc2FyW10gPSBhcnJheSgnaWQnPT4oaW50KSRyWyd0ZXJtX2lkJ10sJ3RheCc9PiRyWyd0YXhvbm9teSddLCdwcmVraXUnPT4oaW50KSRyWydjb3VudCddLCdwcmllcyc9PiRwcmllcywncG8nPT4kcG8sJ3NsdWcnPT4kclsnc2x1ZyddKTsgfQogfQogJG9bJ3BhdGFpc3l0YSddPSRvazsgJG9bJ2tsYWlkdSddPSRrbDsgJG9bJ2VpbHV0ZXMnXT0kc2FyOwogJG9bJ2xpa28nXSA9IChpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH10ZXJtcyBXSEVSRSBuYW1lIFJFR0VYUCAnJlthLXpBLVpdKzt8JiNbMC05XSs7JyIpOwoKIHdwX2NhY2hlX2ZsdXNoKCk7CiBpZihmdW5jdGlvbl9leGlzdHMoJ3djX2RlbGV0ZV9wcm9kdWN0X3RyYW5zaWVudHMnKSkgd2NfZGVsZXRlX3Byb2R1Y3RfdHJhbnNpZW50cygpOwoKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H103'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H103 terminu APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h103=APPLY'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  await miegok(1500);
  out.frontas=(await fetch(WP+'/',{redirect:'manual'})).status;
  if(out.D && Array.isArray(out.D.eilutes)){
    for(const e of out.D.eilutes.slice(0,2)){
      try{ const u=WP+'/gamintojas/'+e.slug+'/'; const r=await fetch(u);
        out['ZENKLAS_'+e.slug]={http:r.status}; }catch(x){}
    }
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h103.json', Buffer.from(JSON.stringify(out,null,1)), 'h103 terminu esybiu APPLY');
