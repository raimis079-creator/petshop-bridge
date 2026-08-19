process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA3MSddKT8kX0dFVFsncHNfaDA3MSddOicnKSE9PSdIMDcxJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICR0PSRQLidwc19zYXJnYXNfa2xhaWRvcyc7ICRvPWFycmF5KCd2Jz0+J0gwNzEnKTsKICRvWyd2aXNvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00gJHQiKTsKICRvWydwYWdhbF9seWdpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbHlnaXMsQ09VTlQoKikgbixTVU0oa2llaykgc2sgRlJPTSAkdCBHUk9VUCBCWSBseWdpcyBPUkRFUiBCWSBuIERFU0MiLCBBUlJBWV9BKTsKICRvWydpcmFzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxsYWlrYXMsbHlnaXMsTEVGVCh6aW51dGUsMTUwKSB6aW51dGUsCiAgICBMRUZUKGZhaWxhcyw4MCkgZmFpbGFzLGVpbHV0ZSxraWVrLExFRlQodXJsLDYwKSB1cmwgRlJPTSAkdCBPUkRFUiBCWSBraWVrIERFU0MsIGxhaWthcyBERVNDIExJTUlUIDIwIiwgQVJSQVlfQSk7CiAkb1snc2lhbmRpZW4nXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSAkdCBXSEVSRSBEQVRFKGxhaWthcyk9Q1VSREFURSgpIik7CiAkb1sndW5pa2FsaXVfcGFyYXN1J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKERJU1RJTkNUIHBhcmFzYXMpIEZST00gJHQiKTsKICRvWyd2aXNvX2l2eWtpdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBTVU0oa2llaykgRlJPTSAkdCIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H071'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){
    if(String(s.name||'').startsWith('TEMP') && s.active){
      await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})});
    }
  }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H071 klaidu turinys',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h071=H071'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,300); }
const zlib=await import('zlib');
await put('screenshots/h071.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h071 klaidu turinys');
