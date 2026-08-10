process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcGFiMyddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICdwYjR6OHcnKSByZXR1cm47CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogIGZvcmVhY2goWydQZXRzaG9wX0thdGFsb2dhcycsJ1BldHNob3BfUGFydGlqb3MnLCdQZXRzaG9wX0dhdmltYXMnLCdQZXRzaG9wX1BhcnNlcmlzJywKICAgICAgICAgICAnUGV0c2hvcF9JdnlraWFpJywnUGV0c2hvcF9QYXJkYXZpbWFpJywnUGV0c2hvcF9QaWxudW1hcycsJ1BldHNob3BfUnlzaWFpJ10gYXMgJGMpewogICAgJG91dFsnbW9kdWxpYWknXVtzdHJfcmVwbGFjZSgnUGV0c2hvcF8nLCcnLCRjKV09Y2xhc3NfZXhpc3RzKCRjKT9jb25zdGFudCgkYy4nOjpWRVJTSUpBJyk6J27El3JhJzsKICB9CiAgJG91dFsnYWt0eXZ1c190ZW1wJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIEFORCBuYW1lIExJS0UgJ1RFTVAlJyIsIEFSUkFZX0EpOwogICRvdXRbJ2tvcGlqb3MnXT1bXTsKICBmb3JlYWNoKCR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX2thdGFsb2dhc192JV9iYWsnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3dwYWkxX2JhayUnIikgYXMgJG8pewogICAgJHY9Z2V0X29wdGlvbigkbyk7ICRvdXRbJ2tvcGlqb3MnXVskb109JHY/cm91bmQoc3RybGVuKGJhc2U2NF9kZWNvZGUoJHYpKS8xMDI0KS4nIEtCJzondHXFocSNaWEnOwogIH0KICAkej1nZXRfb3B0aW9uKCdwc19wYXJzZXJpb196dXJuYWxhcycsW10pOwogICRvdXRbJ3BhcnNlcmlvX3p1cm5hbGUnXT1jb3VudCgoYXJyYXkpJHopOwogICRvdXRbJ3V6c2FreW11J109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyR3cGRiLT5wcmVmaXh9d2Nfb3JkZXJzIik7CiAgJG91dFsncGFydGlqb3MnXT1jbGFzc19leGlzdHMoJ1BldHNob3BfUGFydGlqb3MnKT9QZXRzaG9wX1BhcnRpam9zOjpzdGF0aXN0aWthKCk6J27El3JhJzsKICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'pab3', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP pab3', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_pab3=1&k=pb4z8w`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.name);
  await putResult('analize/pab3.json', out);
}
main().catch(async e=>{ await putResult('analize/pab3.json',{klaida:String(e)}); });
