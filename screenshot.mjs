process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from((process.env.WP_USER||'').trim()+':'+(process.env.WP_APP_PASS||'').trim()).toString('base64');
const GH=process.env.GH_TOKEN, REPO=process.env.GH_REPO;
const PHP=Buffer.from('PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcmVjJ10pIHx8ICgkX0dFVFsnayddID8/ICcnKSAhPT0gJ3JjOHYybicpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7CiAgJG91dD1bJ2xhaWthcyc9PmN1cnJlbnRfdGltZSgnbXlzcWwnKV07CiAgLy8ga2FzIGthYmluYXNpIHByaWUgdXpzYWt5bXUgc3RvY2sgaG9va3UKICBnbG9iYWwgJHdwX2ZpbHRlcjsKICBmb3JlYWNoKFsnd29vY29tbWVyY2VfcmVkdWNlX29yZGVyX3N0b2NrJywnd29vY29tbWVyY2VfcGF5bWVudF9jb21wbGV0ZScsJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19wcm9jZXNzaW5nJywKICAgICAgICAgICAnd29vY29tbWVyY2Vfb3JkZXJfc3RhdHVzX2NvbXBsZXRlZCcsJ3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jaGFuZ2VkJywnd29vY29tbWVyY2VfcmVzdG9yZV9vcmRlcl9zdG9jaycsCiAgICAgICAgICAgJ3dvb2NvbW1lcmNlX29yZGVyX2l0ZW1fcXVhbnRpdHknLCd3b29jb21tZXJjZV9jYW5fcmVkdWNlX29yZGVyX3N0b2NrJ10gYXMgJGgpewogICAgJG91dFsnaG9va2FpJ11bJGhdPVtdOwogICAgaWYoaXNzZXQoJHdwX2ZpbHRlclskaF0pKXsKICAgICAgZm9yZWFjaCgkd3BfZmlsdGVyWyRoXS0+Y2FsbGJhY2tzIGFzICRwcj0+JGNicyl7CiAgICAgICAgZm9yZWFjaCgkY2JzIGFzICRrPT4kdil7CiAgICAgICAgICAkZj0kdlsnZnVuY3Rpb24nXTsKICAgICAgICAgIGlmKGlzX3N0cmluZygkZikpICRuPSRmOwogICAgICAgICAgZWxzZWlmKGlzX2FycmF5KCRmKSkgJG49KGlzX29iamVjdCgkZlswXSk/Z2V0X2NsYXNzKCRmWzBdKTokZlswXSkuJzo6Jy4kZlsxXTsKICAgICAgICAgIGVsc2UgJG49J2Nsb3N1cmUnOwogICAgICAgICAgJG91dFsnaG9va2FpJ11bJGhdW109JHByLicg4oaSICcuJG47CiAgICAgICAgfQogICAgICB9CiAgICB9CiAgfQogIC8vIG11LXBsdWdpbnMgc3UgYXYgcmVkdWNlCiAgJG11PVtdOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmKXsKICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsKICAgIGlmKHN0cnBvcygkYywnX293bl9zdG9ja19xdHknKSE9PWZhbHNlIHx8IHN0cnBvcygkYywncmVkdWNlX29yZGVyX3N0b2NrJykhPT1mYWxzZSl7CiAgICAgICRsaW5lcz1leHBsb2RlKCJcbiIsJGMpOyAkaGl0cz1bXTsKICAgICAgZm9yZWFjaCgkbGluZXMgYXMgJGk9PiRMKXsKICAgICAgICBpZihzdHJwb3MoJEwsJ19vd25fc3RvY2tfcXR5JykhPT1mYWxzZXx8c3RycG9zKCRMLCdyZWR1Y2Vfb3JkZXJfc3RvY2snKSE9PWZhbHNlKQogICAgICAgICAgJGhpdHNbXT0oJGkrMSkuJzogJy50cmltKG1iX3N1YnN0cigkTCwwLDEzMCkpOwogICAgICB9CiAgICAgICRtdVtiYXNlbmFtZSgkZildPWFycmF5X3NsaWNlKCRoaXRzLDAsMTApOwogICAgfQogIH0KICAkb3V0WydtdV9mYWlsYWknXT0kbXU7CiAgLy8gc25pcHBldGFpCiAgJG91dFsnc25pcHBldGFpJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUgRlJPTSB7JHdwZGItPnByZWZpeH1zbmlwcGV0cyBXSEVSRSBhY3RpdmU9MSBBTkQgKGNvZGUgTElLRSAnJXJlZHVjZV9vcmRlcl9zdG9jayUnIE9SIGNvZGUgTElLRSAnJV9vd25fc3RvY2tfcXR5JScpIiwgQVJSQVlfQSk7CiAgLy8gdXpzYWt5bXUgbGVudGVsZXMKICAkb3V0WydocG9zJ109JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXdjX29yZGVycyciKT8ndGFpcCc6J25lJzsKICAkb3V0Wyd1enNha3ltdSddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXdjX29yZGVycyIpOwogIHdwX3NlbmRfanNvbigkb3V0KTsKfSk7Cg==','base64').toString();
async function putResult(path, obj){
  const url=`https://api.github.com/repos/${REPO}/contents/${path}`;
  let sha; try{ const r=await fetch(url,{headers:{Authorization:`Bearer ${GH}`}}); if(r.ok) sha=(await r.json()).sha; }catch(e){}
  const body={message:'rec', content:Buffer.from(JSON.stringify(obj,null,2)).toString('base64')};
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
    body:JSON.stringify({name:'TEMP rec', code:PHP.replace(/^<\?php\s*/,''), scope:'global', active:true})});
  const s=await r.json();
  if(!s.id){ out.klaida='nesukurtas'; await putResult('analize/rec.json',out); return; }
  await new Promise(x=>setTimeout(x,2500));
  const resp=await fetch(`${WP}/?ps_rec=1&k=rc8v2n`,{headers:{Authorization:AUTH}});
  try{ out.rez=JSON.parse(await resp.text()); }catch(e){ out.raw='nejson'; }
  await fetch(`${WP}/wp-json/code-snippets/v1/snippets/${s.id}`,{method:'POST',headers:{Authorization:AUTH,'Content-Type':'application/json'},body:JSON.stringify({active:false})});
  await putResult('analize/rec.json', out);
}
main().catch(async e=>{ await putResult('analize/rec.json',{klaida:String(e)}); });
