process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NTcnXSkpIHJldHVybjsKICAgIEBzZXRfdGltZV9saW1pdCgyODApOyBpbmlfc2V0KCdtZW1vcnlfbGltaXQnLCcxMDI0TScpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPVsnVkVSU0lKQSc9PidTMTYwMC1SMSddOwogICAgJHE9ZnVuY3Rpb24oJGxpa2UsJHNhbmQ9bnVsbCwkY2F0PW51bGwsJGxpbT02MCl7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJHNxbD0iU0VMRUNUIHBvLklEIEZST00geyRwfXBvc3RzIHBvIFdIRVJFIHBvLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG8ucG9zdF90aXRsZSBMSUtFICVzIjsgJHI9JHdwZGItPmdldF9jb2woJHdwZGItPnByZXBhcmUoJHNxbCwnJScuJHdwZGItPmVzY19saWtlKCRsaWtlKS4nJScpKTsgJG91dD1bXTsgZm9yZWFjaCAoJHIgYXMgJGlkKXsgJHByPXdjX2dldF9wcm9kdWN0KCRpZCk7IGlmKCEkcHJ8fCEkcHItPmlzX2luX3N0b2NrKCl8fCRwci0+Z2V0X3R5cGUoKT09PSdtaXgtYW5kLW1hdGNoJykgY29udGludWU7ICRzPWdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpOyBpZigkc2FuZCYmJHMhPT0kc2FuZCkgY29udGludWU7ICRjYXRzPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9jYXQnLFsnZmllbGRzJz0+J3NsdWdzJ10pOyBpZigkY2F0JiYhaW5fYXJyYXkoJGNhdCwkY2F0cykpIGNvbnRpbnVlOyAkY29zdD0oZmxvYXQpZ2V0X3Bvc3RfbWV0YSgkaWQsJ19jb3N0X3ByaWNlJyx0cnVlKTsgZm9yZWFjaChbJ192Zl9jb3N0JywnX3piX2Nvc3QnXSBhcyAkbSl7ICR2PShmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwkbSx0cnVlKTsgaWYoJGNvc3Q8PTAmJiR2PjApJGNvc3Q9JHY7fSAkb3V0W109WyhpbnQpJGlkLG1iX3N1YnN0cigkcHItPmdldF9uYW1lKCksMCw2MCksKGZsb2F0KSRwci0+Z2V0X3ByaWNlKCkscm91bmQoJGNvc3QsMiksKGludCkkcHItPmdldF9zdG9ja19xdWFudGl0eSgpLCRzLChmbG9hdCkkcHItPmdldF93ZWlnaHQoKV07IGlmKGNvdW50KCRvdXQpPj0kbGltKSBicmVhazsgfSByZXR1cm4gJG91dDsgfTsKICAgICRvWydleGNsX21pbmknXT0kcSgnRXhjbHVzaW9uIEh5cG9hbGxlcmdlbmljIG1hxb7FsycsJ3ZmJyk7ICRvWydleGNsX2tvbnMnXT0kcSgnRXhjbHVzaW9uIEh5cG9hbGxlcmdlbmljIGtvbnNlcnZhaScpOwogICAgJG9bJ3Blc3MnXT0kcSgnUEVTUycsJ2F2Jyk7ICRvWyd2ZXRvY2FuaXMnXT0kcSgnVmV0b2NhbmlzJywnYXYnKTsKICAgICRvWydrZXBlbnlzJ109JHEoJ2tlcGVuJywnYXYnKTsgCiAgICAkb1snZ2VvcnBsYXN0X3R1YWxldCddPSRxKCdUdWFsZXRhcyBrYXTEl21zJywnYXYnKTsgJG9bJ3NpbGljYSddPSRxKCdTSUxJQ0EnLCdhdicpOyAkb1snc2VtdHV2J109JHEoJ3NlbXR1dicpOyAkb1snZm9udGFuJ109JHEoJ2ZvbnRhbicsJ2F2Jyk7ICRvWydmaWx0cmFpJ109JHEoJ0ZpbHRyYWkgYXV0b21hdGluZWknLCdhdicpOwogICAgJG9bJ2dpbWNhdF9wb2NrZXRzJ109JHEoJ051dHJpIFBvY2tldHMnLCdhdicpOwogICAgLy8gVkYgc2thbmVzdGFpIHN1bmltczogdmlzaSBpbiBzdG9jawogICAgJGlkcz0kd3BkYi0+Z2V0X2NvbCgiU0VMRUNUIHRyLm9iamVjdF9pZCBGUk9NIHskcH10ZXJtX3JlbGF0aW9uc2hpcHMgdHIgSk9JTiB7JHB9dGVybV90YXhvbm9teSB0dCBPTiB0dC50ZXJtX3RheG9ub215X2lkPXRyLnRlcm1fdGF4b25vbXlfaWQgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBBTkQgdC5zbHVnPSdza2FuZXN0YWktc3VuaW1zJyBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD10ci5vYmplY3RfaWQgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyIpOwogICAgJGk9MDsgZm9yZWFjaCAoJGlkcyBhcyAkaWQpIHsgaWYoKyskaSUxMDA9PT0wKSB3cF9jYWNoZV9mbHVzaCgpOyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcnx8ISRwci0+aXNfaW5fc3RvY2soKSkgY29udGludWU7IGlmKGdldF9wb3N0X21ldGEoJGlkLCdfcHNfc2FuZGVsaXMnLHRydWUpIT09J3ZmJykgY29udGludWU7ICRjb3N0PShmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwnX3ZmX2Nvc3QnLHRydWUpOyAkaz0oZmxvYXQpJHByLT5nZXRfcHJpY2UoKTsgJGJyPXdwX2dldF9wb3N0X3Rlcm1zKCRpZCwncHJvZHVjdF9icmFuZCcsWydmaWVsZHMnPT4nbmFtZXMnXSk7ICRvWyd2Zl9za2FuJ11bXT1bKGludCkkaWQsbWJfc3Vic3RyKCRwci0+Z2V0X25hbWUoKSwwLDYwKSwkayxyb3VuZCgkY29zdCwyKSwkY29zdD4wP3JvdW5kKCgoJGsvMS4yMSktJGNvc3QpLyRjb3N0KjEwMCk6bnVsbCwoaW50KSRwci0+Z2V0X3N0b2NrX3F1YW50aXR5KCksJGJyWzBdPz8nJywoZmxvYXQpJHByLT5nZXRfd2VpZ2h0KCldOyB9CiAgICB1c29ydCgkb1sndmZfc2thbiddLGZuKCRhLCRiKT0+c3RyY21wKCRhWzZdLiRhWzFdLCRiWzZdLiRiWzFdKSk7CiAgICAvLyByaW5raW5pYWkucGhwOiBrdXJpbW8gZnVua2NpamEKICAgICRjPWZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1yaW5raW5pYWkucGhwJyk7IGZvcmVhY2ggKCRjIGFzICRpPT4kbCkgaWYgKHByZWdfbWF0Y2goJy9mdW5jdGlvbiAoc3VrdXJ0aXxpc3NhdWdvdGl8a3VydGl8YWpheF9pc3NhdWdvdGl8cmFzeXRpKS8nLCRsKSkgJG9bJ2ZuJ11bXT0oJGkrMSkuJzonLnRyaW0oJGwpOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-132844';
const GKEY='ps_ex57';
const PHASES=["R"];
const OUT='analize/s1600_r.json';
const DATA=[];
const out={v:VER};
const miegok=ms=>new Promise(r=>setTimeout(r,ms));
async function put(p,buf,m){ const u='https://api.github.com/repos/'+REPO+'/contents/'+p; const h={Authorization:'Bearer '+TOK,'Content-Type':'application/json'};
  let sha=null; try{const g=await fetch(u,{headers:h}); if(g.ok){sha=(await g.json()).sha;}}catch(e){}
  const b={message:m,content:buf.toString('base64')}; if(sha)b.sha=sha;
  return (await fetch(u,{method:'PUT',headers:h,body:JSON.stringify(b)})).status; }
async function fx(u,o,k){ for(let i=0;i<5;i++){ try{ return await fetch(u,o); }catch(e){ await miegok(8000);} } throw new Error('fx:'+k); }
const A={Authorization:AUTH,'Content-Type':'application/json'}; const SNIP=WP+'/wp-json/code-snippets/v1/snippets';
const UA={'Cache-Control':'no-cache','User-Agent':'Mozilla/5.0'};
let sid=null;
try{
  try{ const l=await fx(SNIP,{headers:A},'list'); const arr=JSON.parse(await l.text());
  for(const s of (Array.isArray(arr)?arr:[]).filter(s=>s.active&&/^TEMP/.test(s.name||''))){
    await fetch(SNIP+'/'+s.id,{method:'POST',headers:A,body:JSON.stringify({id:s.id,active:false})}); } }catch(e){ out.list_praleistas=String(e).slice(0,80); }
  const c=await fx(SNIP,{method:'POST',headers:A,body:JSON.stringify({name:'TEMP PS '+VER,
    code:Buffer.from(B64,'base64').toString('utf8'),scope:'global',active:true,priority:5})},'create');
  const ct=await c.text(); out.kurimas=c.status; try{sid=JSON.parse(ct).id; out.sid=sid;}catch(e){out.kurimo_atsakas=ct.slice(0,400);}
  let dq='';
  if(DATA.length){ out.data={}; for(const p of DATA){ const name=p.split('/').pop();
      const g=await fx('https://api.github.com/repos/'+REPO+'/contents/'+p,{headers:{Authorization:'Bearer '+TOK,Accept:'application/vnd.github.raw+json'}},'gh_'+name);
      const buf=Buffer.from(await g.arrayBuffer());
      const m=await fx(WP+'/wp-json/wp/v2/media',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain','Content-Disposition':'attachment; filename="'+name+'"'},body:buf},'media_'+name);
      const mt=await m.text(); try{ const j=JSON.parse(mt); out.data[name]={id:j.id,status:m.status}; dq+='&d_'+name.replace(/\W/g,'_')+'='+j.id; }catch(e){ out.data[name]={status:m.status,err:mt.slice(0,200)}; } } }
  await miegok(9000);
  if(process.env.GTM_SA_JSON){ try{ const sr=await fx(WP+'/wp-json/ps-seo-temp/v1/sa',{method:'POST',headers:{Authorization:AUTH,'Content-Type':'text/plain'},body:process.env.GTM_SA_JSON},'sa'); out.sa_push={status:sr.status,body:(await sr.text()).slice(0,200)}; }catch(e){ out.sa_push=String(e).slice(0,200);} }
  for(let i=0;i<PHASES.length;i++){
    const f=PHASES[i];
    if(i>0) await miegok(5000);
    const d=await fx(WP+'/?'+GKEY+'='+encodeURIComponent(f)+dq,{headers:UA},'faze_'+f);
    const t=await d.text();
    try{ out[f]=JSON.parse(t); }catch(e){ out['zalias_'+f]=t.slice(0,3000); }
  }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
