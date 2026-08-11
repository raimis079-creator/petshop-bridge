process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfYW4nXSkgfHwgKCRfR0VUWydrJ10gPz8gJycpICE9PSAnZHE3bTN6JykgcmV0dXJuOwogICRvdXQ9YXJyYXkoJ1ZFUlNJSkEnPT4nQU4nKTsKICBpZihjbGFzc19leGlzdHMoJ1BldHNob3BfUGFyc2VyaXMnKSl7CiAgICAkcj1uZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9QYXJzZXJpcycsJ2FuYWxpenVvdGknKTsKICAgICRvdXRbJ3BhcmFtcyddPWFycmF5KCk7CiAgICBmb3JlYWNoKCRyLT5nZXRQYXJhbWV0ZXJzKCkgYXMgJHApewogICAgICAkb3V0WydwYXJhbXMnXVtdPWFycmF5KCduJz0+JHAtPmdldE5hbWUoKSwnb3B0Jz0+JHAtPmlzT3B0aW9uYWwoKSwKICAgICAgICAnZGVmJz0+JHAtPmlzT3B0aW9uYWwoKSYmJHAtPmlzRGVmYXVsdFZhbHVlQXZhaWxhYmxlKCk/anNvbl9lbmNvZGUoJHAtPmdldERlZmF1bHRWYWx1ZSgpKTpudWxsKTsKICAgIH0KICAgIC8qIEJhbmRvbSBzdSB0aWtydSB0ZWtzdHUgKi8KICAgICR0PSJTdWTEl3RpczogZMW+aW92aW50YSB2acWhdGllbmEgNDUlLCByecW+aWFpLCBrdWt1csWresWzIGtyYWttb2xhcywgxb51dsWzIHRhdWthaS5cbkFuYWxpdGluxJdzIHN1ZGVkYW1vc2lvcyBkYWx5czogxb5hbGkgYmFsdHltYWkgMzAlLCDFvmFsaSByaWViYWxhaSAxOCUuXG7FoMSXcmltbyBpbnN0cnVrY2lqYTogMiBrZyDFoXVuaXVpIOKAlCA0MCBnIHBlciBwYXLEhS4iOwogICAgdHJ5ewogICAgICAkYT1QZXRzaG9wX1BhcnNlcmlzOjphbmFsaXp1b3RpKCR0KTsKICAgICAgJG91dFsnYmFuZHltYXNfMWFyZyddPSRhOwogICAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvdXRbJ2tsYWlkYTEnXT0kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICB0cnl7CiAgICAgICRhMj1QZXRzaG9wX1BhcnNlcmlzOjphbmFsaXp1b3RpKCR0LCdtYWlzdGFzJyk7CiAgICAgICRvdXRbJ2JhbmR5bWFzXzJhcmcnXT0kYTI7CiAgICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG91dFsna2xhaWRhMiddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICB9CiAgd3Bfc2VuZF9qc29uKCRvdXQpOwp9KTsK','base64').toString();
async function jsonSafe(r){ const t=await r.text();
  const a=t.indexOf('['), o=t.indexOf('{');
  const i=(a>=0&&(a<o||o<0))?a:o; if(i<0) return null;
  try{ return JSON.parse(t.slice(i)); }catch(e){ return null; } }
async function putRaw(path,b64,msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'an', content:b64}; if(sha) body.sha=sha;
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
  const s=await snip('TEMP an', PHP.replace(/^<\?php\s*/,''));
  await pause(2500);
  const resp=await fetch(`${WP}/?ps_an=1&k=dq7m3z`,{headers:{Authorization:AUTH}});
  out.rez=await jsonSafe(resp);
  if(s.id) await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putRaw('analize/an.json', Buffer.from(JSON.stringify(out,null,2)).toString('base64'),'an');
}
main().catch(e=>{});
