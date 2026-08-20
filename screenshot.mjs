process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const out={versija:'H178-zvalgyba'};
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function zvalgas(u, opts){
  try{ const r=await fetch(WP+u, opts||{}); const t=await r.text();
    return {kodas:r.status, ilgis:t.length, pradzia:t.slice(0,180).replace(/\s+/g,' ')};
  }catch(e){ return {klaida:String(e).slice(0,150)}; }
}
out.saknis = await zvalgas('/');
out.dep_ping   = await zvalgas('/?ps_dep902=PING');
out.dep_tuscia = await zvalgas('/?ps_dep902=');
out.dep_help   = await zvalgas('/?ps_dep902=HELP');
out.dep_status = await zvalgas('/?ps_dep902=STATUS');
out.dep_recv_probe = await zvalgas('/?ps_dep902=RECV',{method:'POST',body:'PROBE'});
out.wp_login = await zvalgas('/wp-login.php');
out.uploads_txt = await zvalgas('/wp-content/uploads/ps-backups/');
await put('screenshots/h178.json', Buffer.from(JSON.stringify(out,null,1)), 'h178 avarine zvalgyba');
