process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`snipread ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={};
  for(const id of [2505,2507,2497]){
    const r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${id}`,{headers:{Authorization:AUTH}});
    const s=await r.json();
    out['snip_'+id]={name:s.name, code:(s.code||'').slice(0,9000)};
  }
  await putResult('analize/snipread.json', out);
}
main().catch(async e=>{ await putResult('analize/snipread.json',{klaida:String(e)}); });
