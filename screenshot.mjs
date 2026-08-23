process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjMTUnXSkgfHwgJF9HRVRbJ3BzX3JlYzE1J10hPT0nUlVOJykgcmV0dXJuOwogZ2xvYmFsICR3cGRiOyAkVD1hcnJheSgndic9PidSRUMxNScpOwogJHJlPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdlaWxlJyk7ICRyZS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRycz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnc2FsdGluaWFpJyk7ICRycy0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRvPXdjX2dldF9vcmRlcigzNTA2Nik7CiAkVFsnMzUwNjYnXT1hcnJheSgnYnVzZW5hJz0+JG8tPmdldF9zdGF0dXMoKSwnc2FsdGluaWFpJz0+JHJzLT5pbnZva2UobnVsbCwkbyksCiAgICdlaWxlJz0+JHJlLT5pbnZva2UobnVsbCwkbyksCiAgICdzcHJlbmRpbWFzJz0+JG8tPmdldF9tZXRhKCdfcHNfbWlzcnVzX3NwcmVuZGltYXMnKSwKICAgJ2xhdWtpYSc9PiRvLT5nZXRfbWV0YSgnX3BzX3RpZWtpbWFzX2xhdWtpYScpLAogICAnc2l1bnRhJz0+JG8tPmdldF9tZXRhKCd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnKT8neXJhJzonbmVyYScpOwogJHQ9JHdwZGItPnByZWZpeC4ncHNfdGlla2ltYXNfZWlsJzsKICRUWyd0aWVraW1vX2VpbHV0ZXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBlLiosIHAuYnVzZW5hLCBwLnRpZWtlamFzIEZST00gJHQgZSBKT0lOIHskd3BkYi0+cHJlZml4fXBzX3RpZWtpbWFzIHAgT04gcC5pZD1lLnBhcnRpamFfaWQgV0hFUkUgZS5vcmRlcl9pZD0zNTA2NiIsQVJSQVlfQSk7CiBmb3JlYWNoKCRvLT5nZXRfaXRlbXMoKSBhcyAkaWlkPT4kaXQpewogICAkVFsnZWlsdXRlcyddWyRpaWRdPWFycmF5KCdzcmMnPT4kaXQtPmdldF9tZXRhKCdfcHNfc291cmNlJyksJ2tvbnMnPT4kaXQtPmdldF9tZXRhKCdfcHNfa29uc29saWRhY2lqYScpKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'REC15'};
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
let sid=null;
try{
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Recon H239 v2 (35066 kur dingo)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(6000);
    const d=await fetch(WP+'/?ps_rec15=RUN');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,400); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600); }
await put('screenshots/rec15.json', Buffer.from(JSON.stringify(out,null,1)), 'REC15');
