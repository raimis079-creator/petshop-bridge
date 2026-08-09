process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfa2FzJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ2thczlyNCcpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2RhYmFyJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdzZXJ2ZXJfbGFpa2FzJz0+ZGF0ZSgnWS1tLWQgSDppOnMnKV07CiAgJGs9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYXRhbG9nYXMucGhwJzsKICAkb3V0WydmYWlsYXMnXT1bJ2R5ZGlzJz0+ZmlsZXNpemUoJGspLCdtdGltZSc9PmRhdGUoJ1ktbS1kIEg6aTpzJyxmaWxlbXRpbWUoJGspKSwnbWQ1Jz0+bWQ1X2ZpbGUoJGspXTsKICAvLyBJcyBrdXIgaWtyYXV0YSBrbGFzZQogICRyYz1uZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0thdGFsb2dhcycpOwogICRvdXRbJ2tsYXNlX2lzJ109JHJjLT5nZXRGaWxlTmFtZSgpOwogICRvdXRbJ2tsYXNlX3ZlcnNpamEnXT1QZXRzaG9wX0thdGFsb2dhczo6VkVSU0lKQTsKICAvLyBGYWlsbyBhbnRyYXN0ZSAocGlybW9zIDYwIGVpbHVjaXUpCiAgJGtvZGFzPWZpbGVfZ2V0X2NvbnRlbnRzKCRrKTsKICAkb3V0WydhbnRyYXN0ZSddPWltcGxvZGUoIlxuIixhcnJheV9zbGljZShleHBsb2RlKCJcbiIsJGtvZGFzKSwwLDQyKSk7CiAgLy8gQXIgeXJhIGtpdHUgUGV0c2hvcF9LYXRhbG9nYXMgc25pcHBldHVvc2UKICAkc249JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVOR1RIKGNvZGUpIGxlbiBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJWNsYXNzIFBldHNob3BfS2F0YWxvZ2FzJSciLCBBUlJBWV9BKTsKICAkb3V0WydzbmlwcGV0dW9zZSddPSRzbjsKICAvLyBWaXNpIG11LXBsdWdpbnMgc3UgbXRpbWUKICAkbXU9W107CiAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGYpeyAkbXVbYmFzZW5hbWUoJGYpXT1kYXRlKCdZLW0tZCBIOmknLGZpbGVtdGltZSgkZikpLicgwrcgJy5maWxlc2l6ZSgkZik7IH0KICBhcnNvcnQoJG11KTsKICAkb3V0WydtdV9mYWlsYWknXT1hcnJheV9zbGljZSgkbXUsMCw4LHRydWUpOwogIC8vIEF0c2FyZ2luZXMga29waWpvcwogIGZvcmVhY2goWydwc19rYXRhbG9nYXNfdjI4X2JhaycsJ3BzX2thdGFsb2dhc192MjlfYmFrJ10gYXMgJG8pewogICAgJHY9Z2V0X29wdGlvbigkbyk7ICRvdXRbJ2tvcGlqb3MnXVskb109JHY/c3RybGVuKGJhc2U2NF9kZWNvZGUoJHYpKS4nIEInOiduxJdyYSc7CiAgfQogIC8vIEFyIGxpa28gb3B0aW9udSBzdSBrb2R1CiAgJG91dFsnbGlrxJlfb3B0aW9ucyddPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1Qgb3B0aW9uX25hbWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzX3YlX2I2NCcgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfdjMwJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfZDElJyIpOwogIC8vIEFrdHl2dXMgc25pcHBldGFpIHN1IGZpbGVfcHV0X2NvbnRlbnRzCiAgJG91dFsncmFzYW50eXNfc25pcHBldGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgY29kZSBMSUtFICclZmlsZV9wdXRfY29udGVudHMlJyIsIEFSUkFZX0EpOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:`kas ${new Date().toISOString()}`, content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
  if(sha) body.sha=sha;
  await fetch(url,{method:'PUT',headers:{Authorization:`Bearer ${GH}`,'Content-Type':'application/json'},body:JSON.stringify(body)});
}
async function main(){
  const out={};
  let r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{headers:{Authorization:AUTH}});
  const list=await r.json();
  out.aktyvus_pries=(Array.isArray(list)?list:[]).filter(x=>x.active).map(x=>`#${x.id} ${x.name}`);
  for(const t of (Array.isArray(list)?list:[]).filter(s=>s.active && /^TEMP/i.test(s.name||''))){
    await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${t.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  }
  r=await fetch(`${WP}/wp-json/code-snippets/v1/snippets`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},
    body:JSON.stringify({name:'TEMP kas rase', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/kas.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_kas=1&k=kas9r4`,{headers:{Authorization:AUTH}});
  const txt=await resp.text();
  try{ out.rez=JSON.parse(txt); }catch(e){ out.raw=txt.slice(0,1500); }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/kas.json', out);
}
main().catch(async e=>{ await putResult('analize/kas.json',{klaida:String(e)}); });
