process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfcmVjNyddKSB8fCAkX0dFVFsncHNfcmVjNyddIT09J1JVTicpIHJldHVybjsKICRUPWFycmF5KCd2Jz0+J1JFQzcnKTsKICRycz1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywnc2FsdGluaWFpJyk7ICRycy0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKICRydj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9EZXNrJywndnlrZHltYXMnKTsgJHJ2LT5zZXRBY2Nlc3NpYmxlKHRydWUpOwogJHJlPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0Rlc2snLCdlaWxlJyk7ICRyZS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsKIGZvcmVhY2goYXJyYXkoMzUwNjUsMzUwNjYpIGFzICRpZCl7CiAgICRvPXdjX2dldF9vcmRlcigkaWQpOwogICAkVFskaWRdPWFycmF5KCdzYWx0aW5pYWknPT4kcnMtPmludm9rZShudWxsLCRvKSwndnlrZHltYXMnPT4kcnYtPmludm9rZShudWxsLCRvKSwnZWlsZSc9PiRyZS0+aW52b2tlKG51bGwsJG8pKTsKIH0KIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'REC7'};
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
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Test Uzsakymai v10 (misrus filtro recon)',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id;
    await miegok(6000);
    const d=await fetch(WP+'/?ps_rec7=RUN');
    const raw=d.headers.getSetCookie?d.headers.getSetCookie():[];
    try{ out.R=JSON.parse(await d.text()); }catch(e){ out.R='ne-json'; }
    const cookies=[];
    for(const s of raw){ const p=s.split(';')[0]; const i=p.indexOf('='); const n=p.slice(0,i), v=p.slice(i+1); if(n) cookies.push({name:n,value:v,domain:'dev.avesa.lt',path:'/',secure:true,httpOnly:false}); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/rec7.json', Buffer.from(JSON.stringify(out,null,1)), 'REC7');
