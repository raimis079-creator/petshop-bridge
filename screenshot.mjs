process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
import fs from 'fs';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKCFpc3NldCgkX0dFVFsncHNfZGVwMjQxJ10pIHx8ICRfR0VUWydwc19kZXAyNDEnXSE9PSdSVU4yMDI2MDgyMycpIHJldHVybjsKIGdsb2JhbCAkd3BkYjsgJFQ9YXJyYXkoJ3YnPT4nREVQMjQxJyk7CiAkZD1XUE1VX1BMVUdJTl9ESVI7ICRiYWs9JGQuJy9wcy1iYWNrdXAnOwogaWYoIWlzX2RpcigkYmFrKSl7IEBta2RpcigkYmFrLDA3NTUsdHJ1ZSk7IH0KICRmYWlsYWk9YXJyYXkoJ3BldHNob3Atc2l1bnR1LWxhaXNrYWkucGhwJz0+J0BATEFJQEAnKTsKIGZvcmVhY2goJGZhaWxhaSBhcyAkZj0+JGI2NCl7CiAgICRrb2Rhcz1iYXNlNjRfZGVjb2RlKCRiNjQpOwogICAkcj1hcnJheSgnZ2F1dGFfbWQ1Jz0+bWQ1KCRrb2RhcyksJ2JhaXRhaSc9PnN0cmxlbigka29kYXMpKTsKICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRrb2RhcywgVE9LRU5fUEFSU0UpOyAkclsnc2ludGFrc2UnXT0nb2snOyB9CiAgIGNhdGNoKFxQYXJzZUVycm9yICRlKXsgJHJbJ3NpbnRha3NlJ109J0tMQUlEQTogJy4kZS0+Z2V0TWVzc2FnZSgpOyAkVFskZl09JHI7IGNvbnRpbnVlOyB9CiAgICRwPSRkLicvJy4kZjsKICAgJHJbJ3NlbmFfbWQ1J109bWQ1X2ZpbGUoJHApOwogICAkclsnYmFja3VwJ109Y29weSgkcCwkYmFrLicvJy4kZi4nLmJha19oMjQxJyk7CiAgICRyWydpcmFzeXRhJ109KGJvb2wpZmlsZV9wdXRfY29udGVudHMoJHAsJGtvZGFzKTsKICAgY2xlYXJzdGF0Y2FjaGUodHJ1ZSwkcCk7CiAgICRyWyduYXVqYV9tZDUnXT1tZDVfZmlsZSgkcCk7CiAgICRyWydvayddPSgkclsnbmF1amFfbWQ1J109PT0kclsnZ2F1dGFfbWQ1J10pOwogICAkVFskZl09JHI7CiB9CiAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+b3B0aW9uc30gV0hFUkUgb3B0aW9uX25hbWUgTElLRSAnJXRyYW5zaWVudCVwc19yeXRhcyUnIik7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyBqc29uX2VuY29kZSgkVCwgSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0sNSk7Cg==';
const out={v:'DEP241'};
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
  const lai=fs.readFileSync('deploy/petshop-siuntu-laiskai.php.b64','utf8').trim();
  let kodas=Buffer.from(B64,'base64').toString('utf8').replace('@@LAI@@',lai);
  const c=await fetch(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP Deploy H241 v1 (laiskai 1.2b)',code:kodas,scope:'global',active:true,priority:5})});
  let j=null; const ct=await c.text(); try{j=JSON.parse(ct);}catch(e){}
  out.sukurta=j&&j.id?j.id:{s:c.status,t:ct.slice(0,300)};
  if(j&&j.id){
    sid=j.id; await miegok(8000);
    const d=await fetch(WP+'/?ps_dep241=RUN20260823');
    const t=await d.text();
    try{ out.R=JSON.parse(t); }catch(e){ out.R='ne-json: '+t.slice(0,300); }
    await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})});
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
await put('screenshots/dep241.json', Buffer.from(JSON.stringify(out,null,1)), 'DEP241');
