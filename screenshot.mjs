process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZGVwMjM5J10pIHx8ICRfR0VUWydwc19kZXAyMzknXSE9PSdSVU4yMDI2MDgyMycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nREVQMjM5Jyk7CiAkZD1XUE1VX1BMVUdJTl9ESVI7ICRiYWs9JGQuJy9wcy1iYWNrdXAnOwogaWYoIWlzX2RpcigkYmFrKSl7IEBta2RpcigkYmFrLDA3NTUsdHJ1ZSk7IH0KICRmYWlsYWk9YXJyYXkoJ3BldHNob3AtZGVzay5waHAnPT4nQEBERVNLQEAnLCdwZXRzaG9wLWF2LWRyb3BzaGlwLnBocCc9PidAQERST1BAQCcpOwogZm9yZWFjaCgkZmFpbGFpIGFzICRmPT4kYjY0KXsKICAgJGtvZGFzPWJhc2U2NF9kZWNvZGUoJGI2NCk7CiAgICRyPWFycmF5KCdnYXV0YV9tZDUnPT5tZDUoJGtvZGFzKSwnYmFpdGFpJz0+c3RybGVuKCRrb2RhcykpOwogICB0cnl7IHRva2VuX2dldF9hbGwoJGtvZGFzLCBUT0tFTl9QQVJTRSk7ICRyWydzaW50YWtzZSddPSdvayc7IH0KICAgY2F0Y2goXFBhcnNlRXJyb3IgJGUpeyAkclsnc2ludGFrc2UnXT0nS0xBSURBOiAnLiRlLT5nZXRNZXNzYWdlKCk7ICRUWyRmXT0kcjsgY29udGludWU7IH0KICAgJHA9JGQuJy8nLiRmOwogICAkclsnc2VuYV9tZDUnXT1tZDVfZmlsZSgkcCk7CiAgICRyWydiYWNrdXAnXT1jb3B5KCRwLCRiYWsuJy8nLiRmLicuYmFrX2gyMzknKTsKICAgJHJbJ2lyYXN5dGEnXT0oYm9vbClmaWxlX3B1dF9jb250ZW50cygkcCwka29kYXMpOwogICBjbGVhcnN0YXRjYWNoZSh0cnVlLCRwKTsKICAgJHJbJ25hdWphX21kNSddPW1kNV9maWxlKCRwKTsKICAgJHJbJ29rJ109KCRyWyduYXVqYV9tZDUnXT09PSRyWydnYXV0YV9tZDUnXSk7CiAgICRUWyRmXT0kcjsKIH0KICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5vcHRpb25zfSBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICcldHJhbnNpZW50JXBzX3J5dGFzJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIGpzb25fZW5jb2RlKCRULCBKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSw1KTsK';
const out={v:'DEP239'};
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
  const desk=fs.readFileSync('deploy/petshop-desk.php.b64','utf8').trim();
  const drop=fs.readFileSync('deploy/petshop-av-dropship.php.b64','utf8').trim();
  let kodas=Buffer.from(B64,'base64').toString('utf8').replace('@@DESK@@',desk).replace('@@DROP@@',drop);
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Deploy H239 v1 (desk 3.35 + dropship 1.9)',code:kodas,scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(8000);
    const d=await fetch(WP+'/?ps_dep239=RUN20260823');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,600); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
    out.isjungta=sid;
  }
}catch(e){ out.klaida=String(e).slice(0,600);
  if(sid){ try{ await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(x){} } }
await put('screenshots/dep239.json', Buffer.from(JSON.stringify(out,null,1)), 'DEP239');
