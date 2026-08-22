process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIyMSddKSB8fCAkX0dFVFsncHNfaDIyMSddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRUPWFycmF5KCd2Jz0+J0gyMjEnKTsKIGZvcmVhY2goYXJyYXkoMzUwMzcsMzUwMzYsMzUwMzUsMzQ4ODEpIGFzICRpZCl7CiAgICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8peyAkVFskaWRdPSduZXJhJzsgY29udGludWU7IH0KICAgJHBhc3RhYm9zPWFycmF5KCk7CiAgIGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKGFycmF5KCdvcmRlcl9pZCc9PiRpZCwnbGltaXQnPT41KSkgYXMgJG4pewogICAgICRwYXN0YWJvc1tdPW1iX3N1YnN0cigkbi0+Y29udGVudCwwLDE2MCk7CiAgIH0KICAgJFRbJ3V6cyddWyRpZF09YXJyYXkoCiAgICAgJ3N0YXR1cyc9PiRvLT5nZXRfc3RhdHVzKCksCiAgICAgJ2FwbW9rZXRhJz0+JG8tPmlzX3BhaWQoKSwKICAgICAnbWV0b2Rhcyc9PiRvLT5nZXRfc2hpcHBpbmdfbWV0aG9kKCksCiAgICAgJ3Bhc3RvbWF0YXMnPT4oc3RyaW5nKSRvLT5nZXRfbWV0YSgndmVuaXBha19waWNrdXBfcG9pbnQnKSwKICAgICAndnBfZGF0YSc9Pm1iX3N1YnN0cigoc3RyaW5nKSRvLT5nZXRfbWV0YSgndmVuaXBha19zaGlwcGluZ19vcmRlcl9kYXRhJyksMCwyMDApLAogICAgICdwYXN0YWJvcyc9PiRwYXN0YWJvcywKICAgKTsKIH0KIC8qIFZlbmlwYWsgbnVzdGF0eW1haSDigJQgYXIgdXNlci9wYXNzIHlyYSAqLwogJG49Z2V0X29wdGlvbignc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfc2V0dGluZ3MnLCBhcnJheSgpKTsKICRUWyd2cF91c2VyJ109ICFlbXB0eSgkblsnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfdXNlcm5hbWUnXSkgPyAnWVJBJyA6ICdUVVNDSUFTJzsKICRUWyd2cF9wYXNzJ109ICFlbXB0eSgkblsnc2hvcHVwX3ZlbmlwYWtfc2hpcHBpbmdfZmllbGRfcGFzc3dvcmQnXSkgPyAnWVJBJyA6ICdUVVNDSUFTJzsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCA1KTsK';
const out={v:'H221'};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  const u='https://api.github.com/repos/'+REPO+'/contents/'+path;
  const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status;
}
const A={Authorization:AUTH,'Content-Type':'application/json'};
const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H221 vp recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h221=RUN');
    try{ out.DIEGIMAS=JSON.parse(await d.text()); }catch(e){ out.DIEGIMAS='klaida'; }
    await miegok(2000);
    const d2=await fetch(WP+'/?ps_h221=TEST');
    const t2=await d2.text();
    try{ out.TESTAI=JSON.parse(t2); }catch(e){ out.TESTAI='ne-json: '+t2.slice(0,400); }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h221.json', Buffer.from(JSON.stringify(out,null,1)), 'h221 venipak recon');
