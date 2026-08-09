process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfbW5tJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ21ubTVxMicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJHQ9JHdwZGItPnByZWZpeC4nd2NfbW5tX2NoaWxkX2l0ZW1zJzsKICAkb3V0PVsnc3R1bHBlbGlhaSc9PiR3cGRiLT5nZXRfcmVzdWx0cygiU0hPVyBDT0xVTU5TIEZST00gJHQiLCBBUlJBWV9BKV07CiAgJG91dFsnZWlsdWNpdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0Iik7CiAgJG91dFsncHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NICR0IExJTUlUIDUiLCBBUlJBWV9BKTsKICAvLyBwcmVrZSwga3VyaSB5cmEgcmlua2luaW8ga29tcG9uZW50YXMKICAkb3V0Wydrb21wb25lbnR1X3B2eiddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSAkdCBMSU1JVCAzIiwgQVJSQVlfQSk7CiAgLy8gYnJvbGlhbXM6IHByZWtlIHN1IGRhdWcgcGFrdW9jaXUgKEpvc2VyYSBpciBwYW4uKQogICRicm9sPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHAuSUQsIHAucG9zdF90aXRsZSBGUk9NIHskd3BkYi0+cG9zdHN9IHAgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcC5wb3N0X3RpdGxlIExJS0UgJyVKb3NlcmElJyBMSU1JVCA2IiwgQVJSQVlfQSk7CiAgJG91dFsnam9zZXJhJ109JGJyb2w7CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`mnm ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP mnm recon', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/mnm.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_mnm=1&k=mnm5q2`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,1500); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/mnm.json', out);
}
main().catch(async e=>{ await putResult('analize/mnm.json',{klaida:String(e)}); });
