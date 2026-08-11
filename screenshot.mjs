process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcGFyJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2RxN20zeicpIHJldHVybjsKICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J1BBUicpOwogICRwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtcGFyc2VyaXMucGhwJzsKICBpZihmaWxlX2V4aXN0cygkcCkpewogICAgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOwogICAgJG91dFsnZHlkaXMnXT1zdHJsZW4oJGMpOwogICAgLyogQW50cmFzdGUgKi8KICAgICRvdXRbJ2FudHJhc3RlJ109bWJfc3Vic3RyKCRjLDAsMTQwMCk7CiAgICAvKiBNZXRvZGFpICovCiAgICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUGFyc2VyaXMnKSl7CiAgICAgICRvdXRbJ2tsYXNlJ109dHJ1ZTsKICAgICAgJG91dFsndmVyc2lqYSddPWRlZmluZWQoJ1BldHNob3BfUGFyc2VyaXM6OlZFUlNJSkEnKT9QZXRzaG9wX1BhcnNlcmlzOjpWRVJTSUpBOic/JzsKICAgICAgJG91dFsnbWV0b2RhaSddPWdldF9jbGFzc19tZXRob2RzKCdQZXRzaG9wX1BhcnNlcmlzJyk7CiAgICB9CiAgICAvKiBSYWt0YXpvZHppdSBibG9rYWkgKi8KICAgICRlaWw9ZXhwbG9kZSgiXG4iLCRjKTsKICAgIGZvcmVhY2goJGVpbCBhcyAkaT0+JGUpewogICAgICBpZihwcmVnX21hdGNoKCcvKHRhaXN5a2xlc3xyYWt0YXpvZHppYWl8em9keW5hc3xwYV9bYS16X10rXHMqPT58PT4gKmFycmF5XCggKi4oYmUgZ3J8bW9ub3Byb3x2aXN0fGphdXQpKS9pdScsJGUpKXsKICAgICAgICAkb3V0Wyd0YWlzeWtsZXMnXVskaSsxXT10cmltKG1iX3N1YnN0cigkZSwwLDE0MCkpOwogICAgICB9CiAgICB9CiAgICBpZihpc3NldCgkb3V0Wyd0YWlzeWtsZXMnXSkpICRvdXRbJ3RhaXN5a2xlcyddPWFycmF5X3NsaWNlKCRvdXRbJ3RhaXN5a2xlcyddLDAsMjUsdHJ1ZSk7CiAgfSBlbHNlIHsgJG91dFsnZmFpbGFzJ109J25lcmEnOyB9CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'par', content:b64}; if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function snip(name,code){
  const r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',
    headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name, code, scope:'global', active:true})});
  return await jsonSafe(r)||{};
}
const pause=ms=>new Promise(x=>setTimeout(x,ms));
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await jsonSafe(r);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active&&/^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  const s=await snip('TEMP par', PHP.replace(/^<\?php\s*/,''));
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_par=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/par.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'par');
}
main().catch(e=>{});
