process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDE0NSddKSA/ICRfR0VUWydwc19oMTQ1J10gOiAnJykgIT09ICdHTycpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgzMDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTQ1JywnbGFpa2FzJz0+Y3VycmVudF90aW1lKCdteXNxbCcpLCdSRVpJTUFTJz0+J1JFQ09OLU9OTFknKTsKCiAkcSA9ICJTRUxFQ1QgcC5JRCwgcC5wb3N0X3N0YXR1cywKICAgICAgICBDQVNUKENPQUxFU0NFKG8ubWV0YV92YWx1ZSwwKSBBUyBTSUdORUQpIG93bl9xLAogICAgICAgIENBU1QoQ09BTEVTQ0Uoei5tZXRhX3ZhbHVlLDApIEFTIFNJR05FRCkgemJfcSwKICAgICAgICBDQVNUKENPQUxFU0NFKHYubWV0YV92YWx1ZSwwKSBBUyBTSUdORUQpIHZmX3EsCiAgICAgICAgQ0FTVChDT0FMRVNDRShzLm1ldGFfdmFsdWUsMCkgQVMgREVDSU1BTCgxMiwyKSkgd2Nfc3RvY2sKICAgICAgIEZST00geyRQfXBvc3RzIHAKICAgICAgIExFRlQgSk9JTiB7JFB9cG9zdG1ldGEgbyBPTiBvLnBvc3RfaWQ9cC5JRCBBTkQgby5tZXRhX2tleT0nX293bl9zdG9ja19xdHknCiAgICAgICBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHogT04gei5wb3N0X2lkPXAuSUQgQU5EIHoubWV0YV9rZXk9J196Yl9xdHknCiAgICAgICBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHYgT04gdi5wb3N0X2lkPXAuSUQgQU5EIHYubWV0YV9rZXk9J192Zl9xdHknCiAgICAgICBMRUZUIEpPSU4geyRQfXBvc3RtZXRhIHMgT04gcy5wb3N0X2lkPXAuSUQgQU5EIHMubWV0YV9rZXk9J19zdG9jaycKICAgICAgIFdIRVJFIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cyBJTiAoJ3B1Ymxpc2gnLCdkcmFmdCcpIjsKICRyID0gJHdwZGItPmdldF9yZXN1bHRzKCRxKTsKCiAkc3QgPSBhcnJheSgndmlzbyc9PjAsJ251bGlzX3NhbHRpbml1Jz0+MCwndmllbmFzJz0+MCwnRFVfQVJfREFVR0lBVSc9PjApOwogJGtvbWJvPWFycmF5KCk7ICRwdno9YXJyYXkoKTsgJHNraXJ0dW1hcz0wOyAkc3VtYV9wcmFyYXN0YT0wOwogJG93bl90dXNjaWFzX2JldF9zdG9jaz0wOwogZm9yZWFjaCgkciBhcyAkeCl7CiAgICRzdFsndmlzbyddKys7CiAgICRuID0gKCR4LT5vd25fcT4wPzE6MCkrKCR4LT56Yl9xPjA/MTowKSsoJHgtPnZmX3E+MD8xOjApOwogICBpZigkbj09PTApICRzdFsnbnVsaXNfc2FsdGluaXUnXSsrOwogICBlbHNlaWYoJG49PT0xKSAkc3RbJ3ZpZW5hcyddKys7CiAgIGVsc2UgewogICAgICRzdFsnRFVfQVJfREFVR0lBVSddKys7CiAgICAgJGsgPSAoJHgtPm93bl9xPjA/J293bisnOicnKS4oJHgtPnpiX3E+MD8nemIrJzonJykuKCR4LT52Zl9xPjA/J3ZmJzonJyk7CiAgICAgJGtvbWJvWyRrXT0oJGtvbWJvWyRrXT8/MCkrMTsKICAgICAkc3VtID0gJHgtPm93bl9xKyR4LT56Yl9xKyR4LT52Zl9xOwogICAgIGlmKCRzdW0gIT0gJHgtPndjX3N0b2NrKXsgJHNraXJ0dW1hcysrOyAkc3VtYV9wcmFyYXN0YSArPSAoJHN1bSAtICR4LT53Y19zdG9jayk7IH0KICAgICBpZihjb3VudCgkcHZ6KTwxMCkgJHB2eltdID0gJHgtPklELicgWycuJHgtPnBvc3Rfc3RhdHVzLiddIG93bj0nLiR4LT5vd25fcS4nIHpiPScuJHgtPnpiX3EuJyB2Zj0nLiR4LT52Zl9xLicgd2M9Jy4keC0+d2Nfc3RvY2s7CiAgIH0KICAgLyogQVYgdGlwbzogc3RvY2sgeXJhLCBiZXQgb3duX3N0b2NrX3F0eSBudWxpcyBpciBraXRpIG51bGlhaSAqLwogICBpZigkeC0+b3duX3E9PTAgJiYgJHgtPnpiX3E9PTAgJiYgJHgtPnZmX3E9PTAgJiYgJHgtPndjX3N0b2NrPjApICRvd25fdHVzY2lhc19iZXRfc3RvY2srKzsKIH0KICRvWydwYXNpc2tpcnN0eW1hcyddPSRzdDsKICRvWydrb21iaW5hY2lqb3MnXT0ka29tYm87CiAkb1sncHZ6J109JHB2ejsKICRvWydzdW1hdmltYXNfcGFrZWlzdHVfcHJla2l1J109JHNraXJ0dW1hczsKICRvWydwYXBpbGRvbXVfdm50X2F0c2lyYXN0dSddPSRzdW1hX3ByYXJhc3RhOwogJG9bJ3N0b2NrX3lyYV9iZXRfc2FsdGluaXVfbWV0YV9uZXJhJ109JG93bl90dXNjaWFzX2JldF9zdG9jazsKCiBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogZWNobyB3cF9qc29uX2VuY29kZSgkbyk7IGV4aXQ7Cn0sIDEzMSk7Cg==';
const out={versija:'H145'};
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
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H145 ZB blokavimo recon',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h145=GO'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,800)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h145.json', Buffer.from(JSON.stringify(out,null,1)), 'h145 ZB blokavimo recon');
