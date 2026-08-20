process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDEzMCddKSA/ICRfR0VUWydwc19oMTMwJ10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgxODApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTMwJyk7CiAkdHogPSB0cmFpbGluZ3NsYXNoaXQod3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10pLidwcy1iYWNrdXBzL3RpcHUtenVybmFsYXMuanNvbic7CiAkaiA9IGpzb25fZGVjb2RlKEBmaWxlX2dldF9jb250ZW50cygkdHopLCB0cnVlKTsKIGlmKCFpc19hcnJheSgkaikpeyAkb1sna2xhaWRhJ109J25lcGFyc2ludGEnOyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsgfQogJG9bJ3Zpc28nXSA9IGNvdW50KCRqKTsKCiAvKiB0cmF1a2lhbSBUSUsgdHVvcywga3VyIGJyYW5kIC8gY2F0ZWdvcnkgLyBvdGhlck5hbWUgLyBuYW1lIHlyYSBuZSBza2FsaWFyYXMgKi8KICRzdmFyYnVzID0gYXJyYXkoJ2JyYW5kJywnY2F0ZWdvcnknLCdvdGhlck5hbWUnLCduYW1lJywncHJvZHVjdF9uYW1lJywnc3VtbWFyeScsJ2Rlc2NyaXB0aW9uJyk7CiAkb1sncmFkaW5pYWknXSA9IGFycmF5KCk7CiBmb3JlYWNoKCRqIGFzICRpZHg9PiRlKXsKICAgJG5ldCA9ICRlWydORVRJUElOSUFJJ10gPz8gYXJyYXkoKTsKICAgJGtpcnQgPSBhcnJheV9pbnRlcnNlY3QoYXJyYXlfa2V5cygkbmV0KSwgJHN2YXJidXMpOwogICBpZighJGtpcnQpIGNvbnRpbnVlOwogICAkZWlsdXRlID0gYXJyYXkoJ25yJz0+JGlkeCwgJ2xhaWthcyc9PiRlWydsYWlrYXMnXSwgJ2ltcG9ydF9pZCc9PiRlWydpbXBvcnRfaWQnXSwgJ2xhdWthaSc9PmFycmF5KCkpOwogICBmb3JlYWNoKCRraXJ0IGFzICRMKSAkZWlsdXRlWydsYXVrYWknXVskTF0gPSAkbmV0WyRMXTsKICAgJG9bJ3JhZGluaWFpJ11bXSA9ICRlaWx1dGU7CiAgIGlmKGNvdW50KCRvWydyYWRpbmlhaSddKSA+PSAxMikgYnJlYWs7CiB9CiAvKiBpciB2aWVuYXMgaW1hZ2VzIHBhdnl6ZHlzIHBpbG5haSAqLwogZm9yZWFjaCgkaiBhcyAkZSl7CiAgIGlmKGlzc2V0KCRlWydORVRJUElOSUFJJ11bJ2ltYWdlcyddKSl7ICRvWydpbWFnZXNfcGF2eXpkeXMnXSA9ICRlWydORVRJUElOSUFJJ11bJ2ltYWdlcyddOyBicmVhazsgfQogfQogLyoga2llayBpcyB2aXNvIHN1IGtpZWt2aWVudSBsYXVrdSAqLwogJHNrID0gYXJyYXkoKTsKIGZvcmVhY2goJGogYXMgJGUpIGZvcmVhY2goKCRlWydORVRJUElOSUFJJ10gPz8gYXJyYXkoKSkgYXMgJEw9PiRpbmYpewogICAkayA9ICRMLid8a2llaz0nLihzdHJpbmcpKCRpbmZbJ2tpZWsnXSA/PyAnPycpOwogICAkc2tbJGtdID0gKGlzc2V0KCRza1ska10pPyRza1ska106MCkrMTsKIH0KICRvWydzdXZlc3RpbmUnXSA9ICRzazsKICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskUH1zbmlwcGV0cyBTRVQgYWN0aXZlPTAgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7CiBlY2hvIHdwX2pzb25fZW5jb2RlKCRvKTsgZXhpdDsKfSwgMTMxKTsK';
const out={versija:'H130'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
try{
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H130 zurnalo radiniai',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h130=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,600)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h130.json', Buffer.from(JSON.stringify(out,null,1)), 'h130 zurnalo radiniai');
