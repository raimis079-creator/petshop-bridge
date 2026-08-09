process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKLyogVEVNUCBTNzE4IEJhY2t1cCAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19zNzE4YmFrJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2JrNzE4cXonKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQgPSBbJ1ZFUlNJSkEnPT4nUzcxOCBCQUNLVVAnLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogIGZvcmVhY2ggKFsxLDJdIGFzICRpaWQpewogICAgJHJvdz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLG5hbWUsb3B0aW9ucyBGUk9NIHskd3BkYi0+cHJlZml4fXBteGlfaW1wb3J0cyBXSEVSRSBpZD0lZCIsJGlpZCksIEFSUkFZX0EpOwogICAgJG91dFsnd3BhaV8nLiRpaWRdPVsnbmFtZSc9PiRyb3dbJ25hbWUnXSwnb3B0aW9uc19iNjQnPT5iYXNlNjRfZW5jb2RlKCRyb3dbJ29wdGlvbnMnXSksJ2xlbic9PnN0cmxlbigkcm93WydvcHRpb25zJ10pXTsKICB9CiAgJHNuPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgaWQsbmFtZSxjb2RlLGFjdGl2ZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPTI0MDQiLCBBUlJBWV9BKTsKICAkb3V0WydzbmlwMjQwNCddPVsnbmFtZSc9PiRzblsnbmFtZSddLCdhY3RpdmUnPT4kc25bJ2FjdGl2ZSddLCdjb2RlX2I2NCc9PmJhc2U2NF9lbmNvZGUoJHNuWydjb2RlJ10pLCdsZW4nPT5zdHJsZW4oJHNuWydjb2RlJ10pXTsKICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`s718 backup ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  const r2=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  console.log('putResult',r2.status);
}
async function main(){
  const out={steps:[]};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
    out.steps.push(`deakt #${t.id}`);
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP S718 Backup (read-only)', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const snip=await r.json();
  out.steps.push(`sukurtas #${snip.id} st=${r.status}`);
  if(!snip.id){ out.klaida='nesukurtas'; await putResult('analize/s718_backup.json',out); return; }
  await new Promise(s=>setTimeout(s,2000));
  const resp=await fetch(`${WP}/?ps_s718bak=1&k=bk718qz`,{headers:{Authorization:AUTH}});
  const text=await resp.text();
  out.http=resp.status;
  try{ out.rezultatas=JSON.parse(text); }catch(e){ out.raw=text.slice(0,2000); }
  const d=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${snip.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.steps.push(`deakt #${snip.id} st=${d.status}`);
  await putResult('analize/s718_backup.json', out);
}
main().catch(async e=>{ await putResult('analize/s718_backup.json',{klaida:String(e)}); });
