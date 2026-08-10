process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZGlhZyddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdkcTdtM3onKSByZXR1cm47CiAgJHA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1ha2Npam9zLnBocCc7CiAgJG91dD1hcnJheSgnVkVSU0lKQSc9PidESUFHJywneXJhJz0+ZmlsZV9leGlzdHMoJHApLCdkeWRpcyc9PmZpbGVfZXhpc3RzKCRwKT9maWxlc2l6ZSgkcCk6MCwKICAgICdtZDUnPT5maWxlX2V4aXN0cygkcCk/bWQ1X2ZpbGUoJHApOm51bGwsCiAgICAna2xhc2UnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfQWtjaWpvcycpLAogICAgJ3ZlcnNpamEnPT5jbGFzc19leGlzdHMoJ1BldHNob3BfQWtjaWpvcycpP1BldHNob3BfQWtjaWpvczo6VkVSU0lKQTonbmVyYScpOwogIC8qIFNpbnRha3NlcyBwYXRpa3JhIHBlciBwaHAgLWwgYXRpdGlrbWVuaSAqLwogICRrb2Rhcz1maWxlX2dldF9jb250ZW50cygkcCk7CiAgJGxhaWs9c3lzX2dldF90ZW1wX2RpcigpLicvcHNfdGVzdC5waHAnOwogIGZpbGVfcHV0X2NvbnRlbnRzKCRsYWlrLCRrb2Rhcyk7CiAgJG91dFsnbGludCddPSBmdW5jdGlvbl9leGlzdHMoJ2V4ZWMnKSA/IChmdW5jdGlvbigpIHVzZSAoJGxhaWspeyAkbz1hcnJheSgpOyAkcj0wOyBAZXhlYygncGhwIC1sICcuZXNjYXBlc2hlbGxhcmcoJGxhaWspLicgMj4mMScsJG8sJHIpOyByZXR1cm4gaW1wbG9kZSgnIHwgJywkbyk7IH0pKCkgOiAnZXhlYyBuZXJhJzsKICBAdW5saW5rKCRsYWlrKTsKICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'diag', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
const putJson=(p,o)=>putRaw(p, Buffer.from(JSON.stringify(o,null,2)).toString('base64'),'diag');
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP diag', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_diag=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,900); }
  /* Ir admin puslapio atsakymas */
  const a=await fetch(`${WP}/wp-admin/admin.php?page=ps-akcijos`,{headers:{Authorization:AUTH}});
  out.admin_status=a.status;
  const at=await a.text();
  const i=at.indexOf('atal error');
  out.admin_klaida = i>=0 ? at.slice(Math.max(0,i-150), i+250) : (at.indexOf('<b>Warning')>=0 ? at.slice(at.indexOf('<b>Warning'),at.indexOf('<b>Warning')+250) : 'nera');
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putJson('analize/diag.json', out);
}
main().catch(async e=>{ await putJson('analize/diag.json',{klaida:String(e).slice(0,300)}); });
