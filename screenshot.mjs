process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZzQnXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnZHE3bTN6JykgcmV0dXJuOwogIGdsb2JhbCAkd3BkYjsKICAkb3V0PWFycmF5KCdWRVJTSUpBJz0+J0c0Jyk7CiAgJHBpZD0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfc2t1JyBBTkQgbWV0YV92YWx1ZT0nR0FWVEVTVDAwMScgTElNSVQgMSIpOwogICRvdXRbJ3BpZCddPSRwaWQ7CiAgaWYoJHBpZCl7CiAgICAkcD13Y19nZXRfcHJvZHVjdCgkcGlkKTsKICAgICRvdXRbJ3ByZWtlJ109YXJyYXkoCiAgICAgICdwYXYnPT5nZXRfdGhlX3RpdGxlKCRwaWQpLAogICAgICAnc3RhdHVzYXMnPT5nZXRfcG9zdF9zdGF0dXMoJHBpZCksCiAgICAgICdza3UnPT4kcD8kcC0+Z2V0X3NrdSgpOm51bGwsCiAgICAgICdrYWluYSc9PiRwPyRwLT5nZXRfcmVndWxhcl9wcmljZSgpOm51bGwsCiAgICAgICdhcHJhc3ltb19pbGdpcyc9Pm1iX3N0cmxlbih3cF9zdHJpcF9hbGxfdGFncyhnZXRfcG9zdF9maWVsZCgncG9zdF9jb250ZW50JywkcGlkLCdyYXcnKSkpLAogICAgICAnZWFuJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfZWFuJyx0cnVlKSwKICAgICAgJ3NhbmRlbGlzJz0+Z2V0X3Bvc3RfbWV0YSgkcGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpLAogICAgICAnaV9qdW9kcmFzdGknPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19pX2p1b2RyYXN0aScsdHJ1ZSksCiAgICAgICdrYXRlZ29yaWpvcyc9PndwX2dldF9wb3N0X3Rlcm1zKCRwaWQsJ3Byb2R1Y3RfY2F0JyxhcnJheSgnZmllbGRzJz0+J25hbWVzJykpLAogICAgICAncGlsbnVtYXMnPT5nZXRfcG9zdF9tZXRhKCRwaWQsJ19wc19waWxudW1hcycsdHJ1ZSksCiAgICAgICdrb2RhaSc9PmdldF9wb3N0X21ldGEoJHBpZCwnX3BzX3BpbG51bWFzX2tvZGFpJyx0cnVlKSwKICAgICAgJ21hbmFnZV9zdG9jayc9PiRwPyRwLT5nZXRfbWFuYWdlX3N0b2NrKCk6bnVsbCwKICAgICk7CiAgICAvKiBBciB2YXJ0YWkgam9zIG5lbGllY2l1IChBVikgKi8KICAgIGlmKGNsYXNzX2V4aXN0cygnUGV0c2hvcF9WYXJ0YWknKSl7ICRvdXRbJ3ZhcnRhaV90YWlrb21hJ109UGV0c2hvcF9WYXJ0YWk6OnRhaWtvbWEoJHBpZCk7IH0KICAgIC8qIFZBTFlNQVMgKi8KICAgIHdwX2RlbGV0ZV9wb3N0KCRwaWQsIHRydWUpOwogICAgJG91dFsnaXN0cmludGEnXT0hZ2V0X3Bvc3QoJHBpZCk7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'g4', content:b64}; if(sha) body.sha=sha;
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
  const s=await snip('TEMP g4', PHP.replace(/^<\?php\s*/,''));
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_g4=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/g4chk.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'g4');
}
main().catch(e=>{});
