process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKLyogVEVNUCBEMSBWMiBBUFBMWSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc192MmFwJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3YyYTZoMicpIHJldHVybjsKICBpZighY2xhc3NfZXhpc3RzKCdQZXRzaG9wX1BhcmRhdmltYWknKSl7IHdwX3NlbmRfanNvbihbJ2tsYWlkYSc9PidrbGFzZSBuZWlrcmF1dGEnXSk7IH0KICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ1ZFUlNJSkEnPT4nVjIgQVBQTFknLCdsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogICR0MD1taWNyb3RpbWUodHJ1ZSk7CiAgJHBvcz0oaW50KSgkX0dFVFsncG9zJ10/PzApOwogICRwcmFlamltYWk9W107CiAgZm9yKCRpPTA7JGk8NDskaSsrKXsKICAgICRyPVBldHNob3BfUGFyZGF2aW1haTo6cGVyc2thaWNpdW90aV92aXN1cyhbJ3JpYmEnPT41MDAsJ3Bvc2xpbmtpcyc9PiRwb3NdKTsKICAgICRwcmFlamltYWlbXT1bJ251byc9PiRwb3MsJ2FwZG9yb3RhJz0+JHJbJ2FwZG9yb3RhJ10sJ3N1X3BhcmRhdmltYWlzJz0+JHJbJ3N1X3BhcmRhdmltYWlzJ10sJ2xpa28nPT4kclsnbGlrbyddXTsKICAgICRwb3M9JHJbJ2tpdGFzX3Bvc2xpbmtpcyddOwogICAgaWYoJHJbJ2FwZG9yb3RhJ108NTAwKSBicmVhazsKICAgIGlmKG1pY3JvdGltZSh0cnVlKS0kdDA+NDUpIGJyZWFrOwogIH0KICAkb3V0WydwcmFlamltYWknXT0kcHJhZWppbWFpOwogICRvdXRbJ2tpdGFzX3BvcyddPSRwb3M7CiAgJG91dFsnc2VrdW5kZXMnXT1yb3VuZChtaWNyb3RpbWUodHJ1ZSktJHQwLDEpOwogICRvdXRbJ3ByZWt1X3N1X21ldGEnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3NhbGVzX3VwZGF0ZWQnIik7CiAgaWYoaXNzZXQoJF9HRVRbJ2FiYyddKSl7CiAgICAkb3V0WydhYmMnXT1QZXRzaG9wX1BhcmRhdmltYWk6OnBlcnNrYWljaXVvdGlfYWJjKGZhbHNlKTsKICAgICRvdXRbJ2VpbGVfYmFpZ2lhc2knXT1jb3VudChQZXRzaG9wX1BhcmRhdmltYWk6OmVpbGVfYmFpZ2lhc2koKSk7CiAgICAkb3V0WydlaWxlX25lZ3l2b3MnXT1jb3VudChQZXRzaG9wX1BhcmRhdmltYWk6OmVpbGVfbmVneXZvcygpKTsKICAgICRvdXRbJ25lZ3l2dV9wdnonXT1hcnJheV9zbGljZShQZXRzaG9wX1BhcmRhdmltYWk6OmVpbGVfbmVneXZvcygpLDAsNSk7CiAgICAkb3V0WydzdGF0aXN0aWthJ109UGV0c2hvcF9QYXJkYXZpbWFpOjpzdGF0aXN0aWthKCk7CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`v2apply ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={praejimai:[]};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP V2 apply', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/v2apply.json',out); return; }
  await new Promise(x=>setTimeout(x,2000));
  let pos=0, saugiklis=0;
  while(saugiklis<8){
    const abc = (saugiklis>0 && pos>=3700) ? '&abc=1' : '';
    const resp=await fetch(`${WP}/?ps_v2ap=1&k=v2a6h2&pos=${pos}${abc}`,{headers:{Authorization:AUTH}});
    const txt=await resp.text();
    let d; try{ d=JSON.parse(txt); }catch(e){ out.klaida='nejson'; out.raw=txt.slice(0,800); break; }
    out.praejimai.push(d);
    if(d.abc){ out.galutinis=d; break; }
    if(d.kitas_pos<=pos){ break; }
    pos=d.kitas_pos;
    saugiklis++;
  }
  // ABC paskutinis, jei dar nebuvo
  if(!out.galutinis){
    const resp=await fetch(`${WP}/?ps_v2ap=1&k=v2a6h2&pos=${pos}&abc=1`,{headers:{Authorization:AUTH}});
    try{ out.galutinis=JSON.parse(await resp.text()); }catch(e){}
  }
  const d2=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.deakt=d2.status;
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.aktyvus_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>`#${x.id}`);
  await putResult('analize/v2apply.json', out);
}
main().catch(async e=>{ await putResult('analize/v2apply.json',{klaida:String(e)}); });
