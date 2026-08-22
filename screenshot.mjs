process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const out={versija:'R231'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
try{
  const r=await fetch(WP+'/?ps_r230=SKAITYTI');
  const t=await r.text();
  try{ out.DUOM=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,500); }
}catch(e){ out.klaida=String(e).slice(0,300); }
await put('screenshots/r231.json', Buffer.from(JSON.stringify(out,null,1)), 'r231 pedsakas');
