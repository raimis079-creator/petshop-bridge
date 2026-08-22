process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfaDIxOSddKSB8fCAkX0dFVFsncHNfaDIxOSddIT09J1JVTicpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsKICRUPWFycmF5KCd2Jz0+J0gyMTknKTsKIC8qIHNpYW5kaWVuIGFwbW9rZXRpIC8ga2VpdGV0aSB1enNha3ltYWkgKi8KICRpZHM9JHdwZGItPmdldF9jb2woIlNFTEVDVCBpZCBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyBXSEVSRSB0eXBlPSdzaG9wX29yZGVyJyBBTkQgZGF0ZV91cGRhdGVkX2dtdCA+IChVVENfVElNRVNUQU1QKCkgLSBJTlRFUlZBTCAyIEhPVVIpIE9SREVSIEJZIGRhdGVfdXBkYXRlZF9nbXQgREVTQyBMSU1JVCA4Iik7CiAkZW09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2VpbGUnKTsgJGVtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJGttPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdrbGF1c2ltYXMnKTsgJGttLT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogZm9yZWFjaCgkaWRzIGFzICRpZCl7CiAgICRvPXdjX2dldF9vcmRlcigkaWQpOyBpZighJG8pIGNvbnRpbnVlOwogICAkVFsndXpzYWt5bWFpJ11bXT1hcnJheSgKICAgICAnaWQnPT4kaWQsCiAgICAgJ3N0YXR1cyc9PiRvLT5nZXRfc3RhdHVzKCksCiAgICAgJ2FwbW9rZXRhJz0+JG8tPmlzX3BhaWQoKSwKICAgICAnZWlsZSc9PiRlbS0+aW52b2tlKG51bGwsJG8pLAogICAgICdrbGF1c2ltYXMnPT4ka20tPmludm9rZShudWxsLCRvKSwKICAgICAnc2l1bnRhJz0+KHN0cmluZykkby0+Z2V0X21ldGEoJ3ZlbmlwYWtfc2hpcHBpbmdfb3JkZXJfZGF0YScpID8gJ3R1cmknIDogJycsCiAgICAgJ3RpZWtpbWFzJz0+KHN0cmluZykkby0+Z2V0X21ldGEoJ19wc190aWVraW1hc19sYXVraWEnKSwKICAgKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGVjaG8ganNvbl9lbmNvZGUoJFQsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LCA1KTsK';
const out={v:'H219'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'QQ H219 kur dingo',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,200)};
  if(j&&j.id){
    await miegok(6000);
    const d=await fetch(WP+'/?ps_h219=RUN');
    try{ out.DIEGIMAS=JSON.parse(await d.text()); }catch(e){ out.DIEGIMAS='klaida'; }
    await miegok(2000);
    const d2=await fetch(WP+'/?ps_h219=TEST');
    const t2=await d2.text();
    try{ out.TESTAI=JSON.parse(t2); }catch(e){ out.TESTAI='ne-json: '+t2.slice(0,400); }
    const q=await fetch(WP+'/'); const h=await q.text();
    out.pradzia={s:q.status, fatal:/Fatal error|Parse error/i.test(h)?'TAIP':'ne'};
    await fetch(SNIP+'/'+j.id,{method:'POST',headers:A,body:JSON.stringify({id:j.id,active:false})});
    out.isjungta=j.id;
  }
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h219.json', Buffer.from(JSON.stringify(out,null,1)), 'h219 dingusio paieska');
