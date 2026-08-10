process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfdXhyMSddKSB8fCAoJF9HRVRbJ2snXSA/PyAnJykgIT09ICd1eDlxMmYnKSByZXR1cm47CiAgJG91dD1bJ1ZFUlNJSkEnPT4nVVhSMScsJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgJGRpcj1XUE1VX1BMVUdJTl9ESVIuJy8nOwogIGZvcmVhY2goWydwZXRzaG9wLWthdGFsb2dhcy5waHAnLCdwZXRzaG9wLWdhdmltYXMucGhwJywncGV0c2hvcC1wYXJ0aWpvcy5waHAnLCdwZXRzaG9wLXBpbG51bWFzLnBocCcsJ3BldHNob3AtaXZ5a2lhaS5waHAnXSBhcyAkZil7CiAgICAkcD0kZGlyLiRmOwogICAgaWYoZmlsZV9leGlzdHMoJHApKXsgJG91dFsnZmFpbGFpJ11bJGZdPVsnZHlkaXMnPT5maWxlc2l6ZSgkcCksJ2I2NCc9PmJhc2U2NF9lbmNvZGUoZmlsZV9nZXRfY29udGVudHMoJHApKV07IH0KICAgIGVsc2UgeyAkb3V0WydmYWlsYWknXVskZl09J25lcmEnOyB9CiAgfQogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putRaw(path, str, msg){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:msg||'uxr1', content:Buffer.from(str).toString('base64')};
  if(sha) body.sha=sha;
  const pr=await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
  return pr.status;
}
async function main(){
  const out={VERSIJA:'UXR1'};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
    out.deakt=(out.deakt||[]).concat(t.name);
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP uxr1', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_uxr1=1&k=ux9q2f`,{headers:{Authorization:AUTH}});
  let rez; try{ rez=JSON.parse(await resp.text()); }catch(e){ out.klaida='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  if(rez && rez.failai){
    out.laikas=rez.laikas; out.failai={};
    for(const [f,v] of Object.entries(rez.failai)){
      if(v==='nera'){ out.failai[f]='nera'; continue; }
      out.failai[f]=v.dydis;
      const st=await putRaw('analize/uxr1_'+f.replace(/[^a-z0-9.-]/gi,'_')+'.b64', v.b64, 'uxr1 '+f);
      out.failai[f+'_put']=st;
      await new Promise(x=>setTimeout(x,1200));
    }
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const l2=await r.json();
  out.liko_temp=(Array.isArray(l2)?l2:[]).filter(x=>x.active&&/^TEMP/i.test(x.name||'')).map(x=>x.name);
  await putRaw('analize/uxr1.json', JSON.stringify(out,null,2), 'uxr1 rez');
}
main().catch(async e=>{ await putRaw('analize/uxr1.json', JSON.stringify({klaida:String(e)}), 'uxr1 err'); });
