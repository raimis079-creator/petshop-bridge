process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKIGlmKChpc3NldCgkX0dFVFsncHNfaDExMCddKSA/ICRfR0VUWydwc19oMTEwJ10gOiAnJykgIT09ICdBUFBMWScpIHJldHVybjsKIEBzZXRfdGltZV9saW1pdCgyNDApOwogZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OwogJG8gPSBhcnJheSgndic9PidIMTEwJyk7CiAkdXAgPSB3cF91cGxvYWRfZGlyKCk7ICRiayA9IHRyYWlsaW5nc2xhc2hpdCgkdXBbJ2Jhc2VkaXInXSkuJ3BzLWJhY2t1cHMnOwogaWYoIWlzX2RpcigkYmspKSBAbWtkaXIoJGJrLCAwNzU1LCB0cnVlKTsKCiAka2VpY2lhbSA9IGFycmF5KDEyPT4na3JlcHNlbGlzJywgMTM9PidrYXNhJyk7CiAkdGVybXNfaWQgPSAzNDUyNDsKCiAvKiBLT1BJSkEgKi8KICRrb3AgPSBhcnJheSgndGVybXNfcHJpZXMnPT5nZXRfb3B0aW9uKCd3b29jb21tZXJjZV90ZXJtc19wYWdlX2lkJyksICdwdXNsYXBpYWknPT5hcnJheSgpKTsKIGZvcmVhY2goJGtlaWNpYW0gYXMgJGlkPT4kbmF1amFzKXsKICAgJGtvcFsncHVzbGFwaWFpJ11bJGlkXSA9IGFycmF5KCdzbHVnJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbmFtZScsJGlkKSwgJ3RpdGxlJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfdGl0bGUnLCRpZCksICd1cmwnPT5nZXRfcGVybWFsaW5rKCRpZCkpOwogfQogQGZpbGVfcHV0X2NvbnRlbnRzKCRiay4nL3BhZ2VzX2gxMTAuanNvbicsIHdwX2pzb25fZW5jb2RlKCRrb3AsIEpTT05fVU5FU0NBUEVEX1VOSUNPREUpKTsKICRvWydrb3BpamEnXSA9IGZpbGVfZXhpc3RzKCRiay4nL3BhZ2VzX2gxMTAuanNvbicpID8gZmlsZXNpemUoJGJrLicvcGFnZXNfaDExMC5qc29uJykgOiAnTkVQQVZZS08nOwogaWYoJG9bJ2tvcGlqYSddID09PSAnTkVQQVZZS08nKXsgJG9bJ05VVFJBVUtUQSddPTE7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0OyB9CgogLyogMS4gU0xVRyBLRUlUSU1BUyDigJQgcGVyIHdwX3VwZGF0ZV9wb3N0LCBrYWQgV29yZFByZXNzIGlzYXVnb3R1IF93cF9vbGRfc2x1ZyBpcgogICAgICAgc2VuYXNpcyBhZHJlc2FzIGF1dG9tYXRpc2thaSAzMDEtaW50dSBpIG5hdWphICovCiBmb3JlYWNoKCRrZWljaWFtIGFzICRpZD0+JG5hdWphcyl7CiAgICRzZW5hcyA9IGdldF9wb3N0X2ZpZWxkKCdwb3N0X25hbWUnLCAkaWQpOwogICBpZigkc2VuYXMgPT09ICRuYXVqYXMpeyAkb1snc2x1ZyddWyRpZF09J2phdSBidXZvJzsgY29udGludWU7IH0KICAgJHIgPSB3cF91cGRhdGVfcG9zdChhcnJheSgnSUQnPT4kaWQsICdwb3N0X25hbWUnPT4kbmF1amFzKSwgdHJ1ZSk7CiAgIGlmKGlzX3dwX2Vycm9yKCRyKSl7ICRvWydzbHVnJ11bJGlkXT0nS0xBSURBOiAnLiRyLT5nZXRfZXJyb3JfbWVzc2FnZSgpOyB9CiAgIGVsc2UgewogICAgICRvWydzbHVnJ11bJGlkXSA9IGFycmF5KCdidXZvJz0+JHNlbmFzLCAnZGFiYXInPT5nZXRfcG9zdF9maWVsZCgncG9zdF9uYW1lJywkaWQpLCAndXJsJz0+Z2V0X3Blcm1hbGluaygkaWQpLAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICdvbGRfc2x1Z19tZXRhJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ193cF9vbGRfc2x1ZycsZmFsc2UpKTsKICAgfQogfQoKIC8qIDIuIFRFUk1TIFBVU0xBUElTICovCiAkdCA9IGdldF9wb3N0KCR0ZXJtc19pZCk7CiBpZigkdCAmJiAkdC0+cG9zdF9zdGF0dXMgPT09ICdwdWJsaXNoJyl7CiAgIHVwZGF0ZV9vcHRpb24oJ3dvb2NvbW1lcmNlX3Rlcm1zX3BhZ2VfaWQnLCAkdGVybXNfaWQpOwogICAkb1sndGVybXMnXSA9IGFycmF5KCdpZCc9PiR0ZXJtc19pZCwgJ3RpdGxlJz0+JHQtPnBvc3RfdGl0bGUsICd1cmwnPT5nZXRfcGVybWFsaW5rKCR0ZXJtc19pZCksCiAgICAgICAgICAgICAgICAgICAgICAgJ2lyYXN5dGEnPT4oaW50KWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX3Rlcm1zX3BhZ2VfaWQnKSk7CiB9IGVsc2UgeyAkb1sndGVybXMnXT0ncHVzbGFwaXMgMzQ1MjQgbmVyYXN0YXMgYXJiYSBuZXB1Ymxpa3VvdGFzJzsgfQoKIC8qIDMuIE5VT1JPRFUgVEFJU1lLTEVTICovCiBmbHVzaF9yZXdyaXRlX3J1bGVzKGZhbHNlKTsKICRvWydyZXdyaXRlX2ZsdXNoJ109J29rJzsKCiAvKiA0LiBQQVRJS1JBIGlzIHZpZGF1cyAqLwogZm9yZWFjaChhcnJheSgnY2FydCcsJ2NoZWNrb3V0JykgYXMgJGspewogICAkaWQgPSAoaW50KSBnZXRfb3B0aW9uKCd3b29jb21tZXJjZV8nLiRrLidfcGFnZV9pZCcpOwogICAkb1sncG8nXVska10gPSBhcnJheSgnaWQnPT4kaWQsICdzbHVnJz0+Z2V0X3Bvc3RfZmllbGQoJ3Bvc3RfbmFtZScsJGlkKSwgJ3VybCc9PmdldF9wZXJtYWxpbmsoJGlkKSk7CiB9CiAkb1snd2NfZnVua2Npam9zJ10gPSBhcnJheSgnY2FydF91cmwnPT53Y19nZXRfY2FydF91cmwoKSwgJ2NoZWNrb3V0X3VybCc9PndjX2dldF9jaGVja291dF91cmwoKSk7CgogJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyRQfXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKIGVjaG8gd3BfanNvbl9lbmNvZGUoJG8pOyBleGl0Owp9LCAxMzEpOwo=';
const out={versija:'H110'};
const miegok=(ms)=>new Promise(r=>setTimeout(r,ms));
async function put(path,buf,msg){
  let sha=null;
  try{const g=await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{headers:{'Authorization':'Bearer '+TOK,'User-Agent':'b'}});if(g.status===200)sha=(await g.json()).sha;}catch(e){}
  const b={message:msg,content:buf.toString('base64')}; if(sha) b.sha=sha;
  return (await fetch(`https://api.github.com/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':'Bearer '+TOK,'Content-Type':'application/json','User-Agent':'b'},body:JSON.stringify(b)})).status;
}
async function api(p,o={}){ try{const r=await fetch(WP+p,{...o,headers:{Authorization:AUTH,'Content-Type':'application/json',...(o.headers||{})}}); return {s:r.status,t:await r.text()};}catch(e){return {s:0,t:String(e).slice(0,200)};} }
async function tikr(p){ try{const r=await fetch(WP+p,{redirect:'manual'}); return {http:r.status, loc:(r.headers.get('location')||'').replace(WP,'')||null};}catch(e){return {klaida:String(e).slice(0,70)};} }
try{
  out.PRIES={cart:await tikr('/cart/'), checkout:await tikr('/checkout/'), krepselis:await tikr('/krepselis/'), kasa:await tikr('/kasa/')};
  const ls=await api('/wp-json/code-snippets/v1/snippets');
  let sar=[]; try{sar=JSON.parse(ls.t);}catch(e){}
  for(const s of (Array.isArray(sar)?sar:[])){ if(String(s.name||'').startsWith('TEMP') && s.active){ await api('/wp-json/code-snippets/v1/snippets/'+s.id,{method:'POST',body:JSON.stringify({id:s.id,active:false})}); } }
  const cr=await api('/wp-json/code-snippets/v1/snippets',{method:'POST',body:JSON.stringify({name:'TEMP H110 slug APPLY',code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})});
  let j=null; try{j=JSON.parse(cr.t);}catch(e){}
  await miegok(9000);
  const rr=await fetch(WP+'/?ps_h110=APPLY'); const tt=await rr.text();
  try{ out.D=JSON.parse(tt); }catch(e){ out.D={ZALIAS:tt.slice(0,700)}; }
  if(j&&j.id) await api('/wp-json/code-snippets/v1/snippets/'+j.id,{method:'POST',body:JSON.stringify({id:j.id,active:false})});
  await miegok(2000);
  out.PO={krepselis:await tikr('/krepselis/'), kasa:await tikr('/kasa/'), cart_senas:await tikr('/cart/'), checkout_senas:await tikr('/checkout/')};
  out.frontas=(await fetch(WP+'/',{redirect:'manual'})).status;
  const h=await (await fetch(WP+'/krepselis/')).text();
  out.krepselio_h1=(h.match(/<h1[^>]*>([\s\S]{0,80}?)<\/h1>/i)||[null,'?'])[1].replace(/<[^>]+>/g,'').trim();
  out.krepselio_title=(h.match(/<title>([^<]*)<\/title>/i)||[null,'?'])[1].slice(0,80);
}catch(e){ out.klaida=String(e).slice(0,400); }
await put('screenshots/h110.json', Buffer.from(JSON.stringify(out,null,1)), 'h110 slug APPLY + terms');
