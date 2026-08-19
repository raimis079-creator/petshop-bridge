process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDA0MyddKT8kX0dFVFsncHNfaDA0MyddOicnKSE9PSdIMDQzJykgcmV0dXJuOwogQHNldF90aW1lX2xpbWl0KDMwMCk7CiBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRvPWFycmF5KCd2Jz0+J0gwNDMnKTsKICRwbD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxlZ2FjeS0zMDEucGhwJzsKICRvWydrb2RhcyddPWlzX3JlYWRhYmxlKCRwbCk/ZmlsZV9nZXRfY29udGVudHMoJHBsKTonTkVSQSc7CiAkZj1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxlZ2FjeS0zMDEtbWFwLmpzb24nOwogJG09anNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoJGYpLCB0cnVlKTsKICRrPWFycmF5X2tleXMoJG0pOwogJG9bJ3Zpc28nXT1jb3VudCgkayk7CiAkb1sncGlybWlfcmFrdGFpJ109YXJyYXlfc2xpY2UoJGssMCwxMik7CiAkc2s9YXJyYXkoJ3N1X3ByYWR6aW9zX2JydWtzbml1Jz0+MCwnYmUnPT4wLCdzdV9wYWJhaWdvcyc9PjApOwogZm9yZWFjaCgkayBhcyAkeCl7CiAgIGlmKHN1YnN0cigkeCwwLDEpPT09Jy8nKSAkc2tbJ3N1X3ByYWR6aW9zX2JydWtzbml1J10rKzsgZWxzZSAkc2tbJ2JlJ10rKzsKICAgaWYoc3Vic3RyKCR4LC0xKT09PScvJykgJHNrWydzdV9wYWJhaWdvcyddKys7CiB9CiAkb1snZm9ybWF0YXMnXT0kc2s7CiAkb1sncHZ6X3JlaWtzbWVzJ109YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKCRtKSwwLDYpOwogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H043'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H043 301 formatas',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  out.snip=j?j.id:'KLAIDA';
  await new Promise(r=>setTimeout(r,9000));
  const r=await fetch(WP+'/?ps_h043=H043'); const t=await r.text();
  try{ out.d=JSON.parse(t); }catch(e){ out.zalias=t.slice(0,400); }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
const zlib=await import('zlib');
await put('screenshots/h043.json.gz', zlib.gzipSync(Buffer.from(JSON.stringify(out))), 'h043 301 formatas');
