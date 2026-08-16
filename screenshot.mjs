process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP='https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='YWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmICgoaXNzZXQoJF9HRVRbJ3BzX3AwJ10pID8gJF9HRVRbJ3BzX3AwJ10gOiAnJykgIT09ICdNOFIyJykgcmV0dXJuOwogJG89YXJyYXkoJ3YnPT4nUDBKLU04UkVDMicpOwogJHdjPVdQX0NPTlRFTlRfRElSOwogLyogMS4gdGlrc2xpbmUgZmFpbHUgcGFpZXNrYSBwYWdhbCB2YXJkYSAqLwogJGllc2tvbWk9YXJyYXkoJ3BldC1mb3JtLmpzJywncGV0LXByb2ZpbGUuanMnLCdjbGFzcy1wZXQtdWkucGhwJywnY2xhc3MtYWNjb3VudC1kYXNoYm9hcmQucGhwJywnY2xhc3MtZmVlZGluZy1zZXJ2aWNlLnBocCcsJ3BldC1mb3JtLmNzcycpOwogJHJhc3RhPWFycmF5KCk7CiBmb3JlYWNoIChhcnJheSgkd2MuJy9wbHVnaW5zJywkd2MuJy9tdS1wbHVnaW5zJywkd2MuJy90aGVtZXMnKSBhcyAkYmFzZSkgewogICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRiYXNlLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgIGZvcmVhY2goJGl0IGFzICRmaSl7ICRiPSRmaS0+Z2V0RmlsZW5hbWUoKTsgaWYoaW5fYXJyYXkoJGIsJGllc2tvbWksdHJ1ZSkpICRyYXN0YVtdPXN0cl9yZXBsYWNlKCR3YywnJywkZmktPmdldFBhdGhuYW1lKCkpLicgKCcuJGZpLT5nZXRTaXplKCkuJ0IpJzsgfQogfQogJG9bJ3Jhc3RhJ109JHJhc3RhOwogLyogMi4ga2FzIHJhc28gaSBwc19wZXRfcHJvZmlsZV9kcmFmdHMgaXIgcHNfcGV0cyDigJQgcGVyIHBsdWdpbnMgKi8KICRvWydkcmFmdHNfcmFzeXRvamFpJ109YXJyYXkoKTsgJG9bJ3BldHNfcmFzeXRvamFpJ109YXJyYXkoKTsgJG9bJ2F1Z2ludGluaXNfcmVnJ109YXJyYXkoKTsgJG9bJ2NsYWltJ109YXJyYXkoKTsKIGZvcmVhY2ggKGFycmF5KCR3Yy4nL3BsdWdpbnMnLCR3Yy4nL211LXBsdWdpbnMnKSBhcyAkYmFzZSkgewogICAkaXQ9bmV3IFJlY3Vyc2l2ZUl0ZXJhdG9ySXRlcmF0b3IobmV3IFJlY3Vyc2l2ZURpcmVjdG9yeUl0ZXJhdG9yKCRiYXNlLEZpbGVzeXN0ZW1JdGVyYXRvcjo6U0tJUF9ET1RTKSk7CiAgIGZvcmVhY2goJGl0IGFzICRmaSl7CiAgICAgaWYgKHN1YnN0cigkZmktPmdldEZpbGVuYW1lKCksLTQpIT09Jy5waHAnKSBjb250aW51ZTsKICAgICAkcD0kZmktPmdldFBhdGhuYW1lKCk7CiAgICAgaWYgKHN0cnBvcygkcCwnL3dvb2NvbW1lcmNlLycpIT09ZmFsc2UgfHwgc3RycG9zKCRwLCcvZmxhdHNvbWUnKSE9PWZhbHNlIHx8IHN0cnBvcygkcCwnL3dwLWFsbC1pbXBvcnQnKSE9PWZhbHNlIHx8IHN0cnBvcygkcCwnL2NvZGUtc25pcHBldHMvJykhPT1mYWxzZSB8fCBzdHJwb3MoJHAsJy9jb21wbGlhbnonKSE9PWZhbHNlIHx8IHN0cnBvcygkcCwnL3lpdGgnKSE9PWZhbHNlKSBjb250aW51ZTsKICAgICAkaz1AZmlsZV9nZXRfY29udGVudHMoJHApOyBpZighJGspIGNvbnRpbnVlOwogICAgICR0cnVtcD1zdHJfcmVwbGFjZSgkd2MsJycsJHApOwogICAgIGlmIChzdHJwb3MoJGssJ3BzX3BldF9wcm9maWxlX2RyYWZ0cycpIT09ZmFsc2UpICRvWydkcmFmdHNfcmFzeXRvamFpJ11bXT0kdHJ1bXA7CiAgICAgaWYgKHN0cnBvcygkaywicHNfcGV0cyciKSE9PWZhbHNlIHx8IHN0cnBvcygkaywncHNfcGV0cyInKSE9PWZhbHNlKSAkb1sncGV0c19yYXN5dG9qYWknXVtdPSR0cnVtcDsKICAgICBpZiAoc3RycG9zKCRrLCInYXVnaW50aW5pcyciKSE9PWZhbHNlICYmIChzdHJwb3MoJGssJ2FkZF9yZXdyaXRlX2VuZHBvaW50JykhPT1mYWxzZXx8c3RycG9zKCRrLCd3b29jb21tZXJjZV9hY2NvdW50JykhPT1mYWxzZSkpICRvWydhdWdpbnRpbmlzX3JlZyddW109JHRydW1wOwogICAgIGlmIChzdHJpcG9zKCRrLCdjbGFpbScpIT09ZmFsc2UgJiYgc3RycG9zKCRrLCdwc19wZXQnKSE9PWZhbHNlKSAkb1snY2xhaW0nXVtdPSR0cnVtcDsKICAgfQogfQogZm9yZWFjaCAoYXJyYXkoJ2RyYWZ0c19yYXN5dG9qYWknLCdwZXRzX3Jhc3l0b2phaScsJ2F1Z2ludGluaXNfcmVnJywnY2xhaW0nKSBhcyAka2spICRvWyRra109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkb1ska2tdKSk7CiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'P0J-1'};
async function irasyk(){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0j.json`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:'p0j m8 recon2',content:Buffer.from(JSON.stringify(out)).toString('base64')}; if(sha) b.sha=sha;
  await fetch(`https://api.github.com/repos/${REPO}/contents/screenshots/p0j.json`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)});
}
async function api(p,o={}){ const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()}; }
try{
  // 1. isjungiam visus likusius TEMP snippetus
  const lst=await api('/wp-json/code-snippets/v1/snippets');
  let arr=[]; try{arr=JSON.parse(lst.t);}catch(e){}
  out.temp_isjungta=[];
  for(const s of arr){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); out.temp_isjungta.push(s.id); } }
  // 2. recon snippetas
  const code=Buffer.from(B64,'base64').toString('utf8');
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP P0J M8REC2',code,scope:'global',active:true,priority:5})});
  let id=null; try{id=JSON.parse(cr.t).id;}catch(e){ out.snip_err=cr.t.slice(0,200); }
  out.snip_id=id;
  await new Promise(r=>setTimeout(r,8000));
  try{ const r=await fetch(WP+'/?ps_p0=M8R2'); const tx=await r.text(); out.rez=JSON.parse(tx); }catch(e){ out.e=String(e).slice(0,300); }
  if(id) await api('/wp-json/code-snippets/v1/snippets/'+id,{method:'POST',body:JSON.stringify({id,active:false})});
}catch(e){ out.bendra=String(e).slice(0,300); }
await irasyk();
console.log('ok');
