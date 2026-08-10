process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYW50J10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2FuNXQycScpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIElEIEZST00geyR3cGRiLT5wb3N0c30gV0hFUkUgcG9zdF90eXBlPSdwcm9kdWN0JwogICAgQU5EIChwb3N0X3RpdGxlIExJS0UgJyVBbnRpZW5vcyBrdWzFoWVsxJdzJScgT1IgcG9zdF90aXRsZSBMSUtFICcldmnFoXRpZW5vcyDFvmllZGFpJScKICAgICAgT1IgcG9zdF90aXRsZSBMSUtFICclQW50aWVub3MgZmlsxJclJyBPUiBwb3N0X3RpdGxlIExJS0UgJyVyecW+acWzIGthdWxpdWthaSUnKSBMSU1JVCA1Iik7CiAgZm9yZWFjaCgkaWRzIGFzICRpZCl7CiAgICAkcG89Z2V0X3Bvc3QoJGlkKTsKICAgICR0PXdwX3N0cmlwX2FsbF90YWdzKChzdHJpbmcpJHBvLT5wb3N0X2NvbnRlbnQpOwogICAgJHN1ZD1QZXRzaG9wX1BhcnNlcmlzOjpzdWRldGllc19zZWtjaWphKCR0KTsKICAgICRhPVBldHNob3BfUGFyc2VyaXM6OmFuYWxpenVvdGkoJHQsJHBvLT5wb3N0X3RpdGxlLFsncGFfYmVfZ3J1ZHUnLCdwYV9iYWx0eW11X3NhbHRpbmlzJ10pOwogICAgJGVzYW1pPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncGFfYmVfZ3J1ZHUnLFsnZmllbGRzJz0+J25hbWVzJ10pOwogICAgJG91dFsncHJla2VzJ11bXT1bCiAgICAgICdpZCc9PiRpZCwKICAgICAgJ3Bhdic9Pm1iX3N1YnN0cihodG1sX2VudGl0eV9kZWNvZGUoJHBvLT5wb3N0X3RpdGxlKSwwLDUwKSwKICAgICAgJ3Rla3N0b19pbGdpcyc9Pm1iX3N0cmxlbigkdCksCiAgICAgICdTVURFVElTJz0+JHN1ZD09PW51bGw/J05FUkFTVEEnOm1iX3N1YnN0cigkc3VkLDAsMjIwKSwKICAgICAgJ3NpdWxvX2dydWRhaSc9PiRhWydwYV9iZV9ncnVkdSddWydyZWlrc21lJ10/PyfigJQnLAogICAgICAncGFncmluZGFzJz0+JGFbJ3BhX2JlX2dydWR1J11bJ3BhZ3JpbmRhcyddPz8nJywKICAgICAgJ2NpdGF0YSc9Pm1iX3N1YnN0cigkYVsncGFfYmVfZ3J1ZHUnXVsnY2l0YXRhJ10/PycnLDAsMTgwKSwKICAgICAgJ3lyYSc9PighaXNfd3BfZXJyb3IoJGVzYW1pKSYmJGVzYW1pKT8kZXNhbWlbMF06J+KAlCcsCiAgICAgICd0ZWtzdGFzX3ByYWR6aWEnPT5tYl9zdWJzdHIoJHQsMCwyNjApLAogICAgXTsKICB9CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'antiena', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP antiena', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/antiena.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_ant=1&k=an5t2q`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/antiena.json', out);
}
main().catch(async e=>{ await putResult('analize/antiena.json',{klaida:String(e)}); });
