process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfdjNhcCddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICd2M2EybTgnKSByZXR1cm47CiAgaWYoIWNsYXNzX2V4aXN0cygnUGV0c2hvcF9QaWxudW1hcycpKXsgd3Bfc2VuZF9qc29uKFsna2xhaWRhJz0+J25lcmEga2xhc2VzJ10pOyB9CiAgZ2xvYmFsICR3cGRiOwogICRvdXQ9WydsYWlrYXMnPT5jdXJyZW50X3RpbWUoJ215c3FsJyldOwogICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRwb3M9KGludCkoJF9HRVRbJ3BvcyddPz8wKTsgJHByPVtdOwogIGZvcigkaT0wOyRpPDY7JGkrKyl7CiAgICAkcj1QZXRzaG9wX1BpbG51bWFzOjpwZXJza2FpY2l1b3RpX3Zpc3VzKFsncmliYSc9PjQwMCwncG9zbGlua2lzJz0+JHBvc10pOwogICAgJHByW109WydudW8nPT4kcG9zLCduJz0+JHJbJ2FwZG9yb3RhJ10sJ3ZpZCc9PiRyWyd2aWR1cmtpcyddLCdwaWxuaSc9PiRyWydwaWxuaSddXTsKICAgICRwb3M9JHJbJ2tpdGFzX3Bvc2xpbmtpcyddOwogICAgaWYoJHJbJ2FwZG9yb3RhJ108NDAwKSBicmVhazsKICAgIGlmKG1pY3JvdGltZSh0cnVlKS0kdDA+NDApIGJyZWFrOwogIH0KICAkb3V0WydwcmFlamltYWknXT0kcHI7ICRvdXRbJ2tpdGFzX3BvcyddPSRwb3M7ICRvdXRbJ3NlayddPXJvdW5kKG1pY3JvdGltZSh0cnVlKS0kdDAsMSk7CiAgJG91dFsnc3VfYmFsdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfcGlsbnVtYXMnIik7CiAgaWYoaXNzZXQoJF9HRVRbJ2ZpbiddKSl7CiAgICAkb3V0WydzdGF0aXN0aWthJ109UGV0c2hvcF9QaWxudW1hczo6c3RhdGlzdGlrYSgpOwogICAgLy8gcGFzaXNraXJzdHltYXMKICAgICRvdXRbJ3Bhc2lza2lyc3R5bWFzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ0FTRSBXSEVOIG1ldGFfdmFsdWUrMD49MTAwIFRIRU4gJzEwMCcgV0hFTiBtZXRhX3ZhbHVlKzA+PTkwIFRIRU4gJzkwLTk5JyBXSEVOIG1ldGFfdmFsdWUrMD49NzUgVEhFTiAnNzUtODknIFdIRU4gbWV0YV92YWx1ZSswPj01MCBUSEVOICc1MC03NCcgRUxTRSAnPDUwJyBFTkQgZ3J1cGUsIENPVU5UKCopIGMgRlJPTSB7JHdwZGItPnBvc3RtZXRhfSBXSEVSRSBtZXRhX2tleT0nX3BzX3BpbG51bWFzJyBHUk9VUCBCWSBncnVwZSBPUkRFUiBCWSBncnVwZSBERVNDIiwgQVJSQVlfQSk7CiAgICAvLyAxMDAlIHByZWtpdSBwYXZ5emR6aWFpCiAgICAkb3V0WydwaWxub3NfcHZ6J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCwgTEVGVChwLnBvc3RfdGl0bGUsNDApIHBhdiBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSU5ORVIgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfcHNfcGlsbnVtYXMnIEFORCBtLm1ldGFfdmFsdWUrMD49MTAwIExJTUlUIDUiLCBBUlJBWV9BKTsKICAgIC8vIGFyIDkwJSBsdWJvcyBkZWwgRUFOPyBwYXRpa3JpbmFtIDkwLTk5IGdydXBlCiAgICAkZGV2eW5pPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgcG9zdF9pZCBGUk9NIHskd3BkYi0+cG9zdG1ldGF9IFdIRVJFIG1ldGFfa2V5PSdfcHNfcGlsbnVtYXMnIEFORCBtZXRhX3ZhbHVlKzAgQkVUV0VFTiA5MCBBTkQgOTkgTElNSVQgMjAwIik7CiAgICAkdGlrX2Vhbj0wOwogICAgZm9yZWFjaCgkZGV2eW5pIGFzICRpZCl7ICR0PWdldF9wb3N0X21ldGEoJGlkLCdfcHNfcGlsbnVtYXNfdHJ1a3N0YScsdHJ1ZSk7IGlmKHRyaW0oJHQpPT09J0VBTicpICR0aWtfZWFuKys7IH0KICAgICRvdXRbJ2dydXBlamVfOTBfdGlrX2Vhbl90cnVrc3RhJ109JHRpa19lYW4uJyBpcyAnLmNvdW50KCRkZXZ5bmkpOwogICAgLy8gZWlsZQogICAgJGVpbGU9UGV0c2hvcF9QaWxudW1hczo6ZWlsZV9za29sb3MoMTApOwogICAgJG91dFsnZWlsZV9za29sb3NfdG9wJ109YXJyYXlfbWFwKGZ1bmN0aW9uKCRlKXsgcmV0dXJuIFsnaWQnPT4kZVsncGlkJ10sJ2JhbGFzJz0+JGVbJ2JhbGFzJ10sJ3YzNjUnPT4kZVsndjM2NSddLCdwYXYnPT5tYl9zdWJzdHIoJGVbJ3BhdiddLDAsMzQpLCd0cnVrc3RhJz0+JGVbJ3RydWtzdGEnXV07IH0sJGVpbGUpOwogIH0KICB3cF9zZW5kX2pzb24oJG91dCk7Cn0pOwo=','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`v3apply ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP v3 apply', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/v3apply.json',out); return; }
  await new Promise(x=>setTimeout(x,2000));
  let pos=0, i=0;
  while(i<8){
    const resp=await fetch(`${WP}/?ps_v3ap=1&k=v3a2m8&pos=${pos}`,{headers:{Authorization:AUTH}});
    let d; try{ d=JSON.parse(await resp.text()); }catch(e){ out.klaida='nejson'; break; }
    out.praejimai.push(d);
    if(d.kitas_pos<=pos) break;
    pos=d.kitas_pos; i++;
  }
  const resp=await fetch(`${WP}/?ps_v3ap=1&k=v3a2m8&pos=${pos}&fin=1`,{headers:{Authorization:AUTH}});
  try{ out.galutinis=JSON.parse(await resp.text()); }catch(e){}
  const d2=await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  out.deakt=d2.status;
  const h=await fetch(`${WP}/`,{headers:{Authorization:AUTH}}); out.svetaine=h.status;
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.aktyvus_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>`#${x.id}`);
  await putResult('analize/v3apply.json', out);
}
main().catch(async e=>{ await putResult('analize/v3apply.json',{klaida:String(e)}); });
