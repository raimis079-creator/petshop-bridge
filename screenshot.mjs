process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4MjcnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89WydWRVJTSUpBJz0+J1MxNTkzLVYxJ107ICRmPSRfR0VUWydwc19leDI3J107CiAgICAkYmFzZT0naHR0cHM6Ly9kZXYuYXZlc2EubHQvd3AtbG9hZC5waHA/aW1wb3J0X2tleT12JmltcG9ydF9pZD0zJzsKICAgIGlmICgkZj09PSdQJykgeyAkcj13cF9yZW1vdGVfZ2V0KCRiYXNlLicmYWN0aW9uPXByb2Nlc3NpbmcnLFsndGltZW91dCc9Pjk1LCdzc2x2ZXJpZnknPT5mYWxzZV0pOyAkb1sncHJvYyddPW1iX3N1YnN0cih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksMCwxNTApOyAkb1sncG14aTMnXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIHByb2Nlc3NpbmcsdHJpZ2dlcmVkLHF1ZXVlX2NodW5rX251bWJlcix1cGRhdGVkLHNraXBwZWQgRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiLEFSUkFZX0EpOyB9CiAgICBpZiAoJGY9PT0nVicpIHsKICAgICAgICAkdT0kd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIHBhdGggRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiKTsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT42MF0pKTsKICAgICAgICAkZmVlZD1bXTsgaWYgKHByZWdfbWF0Y2hfYWxsKCcvPGNvZGU+KC4qPyk8XC9jb2RlPlxzKjxlYW4+KC4qPyk8XC9lYW4+XHMqPHF0eT4oLio/KTxcL3F0eT4vcycsJGIsJG0sUFJFR19TRVRfT1JERVIpKSBmb3JlYWNoICgkbSBhcyAkeCkgJGZlZWRbdHJpbSgkeFsxXSldPShpbnQpJHhbM107CiAgICAgICAgJHJvd3M9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbS5wb3N0X2lkLCBtLm1ldGFfdmFsdWUgc2t1LCBwby5wb3N0X3N0YXR1cywgcG8ucG9zdF90aXRsZSBGUk9NIHskcH1wb3N0bWV0YSBtIEpPSU4geyRwfXBvc3RzIHBvIE9OIHBvLklEPW0ucG9zdF9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfemJfc3VwcGxpZXJfc2t1JyBBTkQgbS5tZXRhX3ZhbHVlPD4nJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcG8ucG9zdF9zdGF0dXMgSU4gKCdwdWJsaXNoJywnZHJhZnQnKSIpOwogICAgICAgICRzaz1bJ3N1dGFtcGEnPT4wLCdza2lyaWFzaSc9PjAsJ25lcmFfZmVlZGUnPT4wXTsgJHNrX3B2ej1bXTsKICAgICAgICBmb3JlYWNoICgkcm93cyBhcyAkcikgeyBpZiAoIWlzc2V0KCRmZWVkWyRyLT5za3VdKSkgeyAkc2tbJ25lcmFfZmVlZGUnXSsrOyBjb250aW51ZTsgfSAkcT0oaW50KWdldF9wb3N0X21ldGEoJHItPnBvc3RfaWQsJ196Yl9xdHknLHRydWUpOyBpZiAoJGZlZWRbJHItPnNrdV09PT0kcSkgJHNrWydzdXRhbXBhJ10rKzsgZWxzZSB7ICRza1snc2tpcmlhc2knXSsrOyBpZiAoY291bnQoJHNrX3B2eik8MTApICRza19wdnpbXT1bJHItPnBvc3RfaWQsJHItPnNrdSwkci0+cG9zdF9zdGF0dXMsJHEsJGZlZWRbJHItPnNrdV0sbWJfc3Vic3RyKCRyLT5wb3N0X3RpdGxlLDAsMzApLGdldF9wb3N0X21ldGEoJHItPnBvc3RfaWQsJ19sZWdhY3lfbWFudWZhY3R1cmVyJyx0cnVlKV07IH0gfQogICAgICAgICRvWyd6Yl9xdHlfdnNfZmVlZCddPSRzazsgJG9bJ3B2eiddPSRza19wdno7CiAgICAgICAgLy8gTW9uZ2UgQVYgcG9yb3M6IHNoYWRvdyAtPiBBVgogICAgICAgIFBldHNob3BfU2VzZWxpYWk6OnN5bmMoJ1MxNTkzJyk7ICRvWydzZXNlbGlhaSddPWdldF9vcHRpb24oJ3BzX3Nlc2VsaWFpX3Bhc2t1dGluaXMnKTsKICAgICAgICBmb3JlYWNoIChbMTczOTQsMTc0MDAsMTczOTcsMTc0MDYsMTc0MTUsMTc0MTIsMTc0MjEsMTc0MTgsMTc0MDMsMTc0MDldIGFzICRpZCkgeyAkc2g9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBwb3N0X2lkIEZST00geyRwfXBvc3RtZXRhIFdIRVJFIG1ldGFfa2V5PSdfcHNfc2hhZG93X29mJyBBTkQgbWV0YV92YWx1ZT0lcyIsJGlkKSk7ICRvWydtb25nZSddWyRpZF09Wyd6Yl9za3UnPT5nZXRfcG9zdF9tZXRhKCRzaCwnX3piX3N1cHBsaWVyX3NrdScsdHJ1ZSksJ2ZlZWQnPT4kZmVlZFtnZXRfcG9zdF9tZXRhKCRzaCwnX3piX3N1cHBsaWVyX3NrdScsdHJ1ZSldPz9udWxsLCdzaGFkb3dfcXR5Jz0+Z2V0X3Bvc3RfbWV0YSgkc2gsJ196Yl9xdHknLHRydWUpLCdhdl96Yl9xdHknPT5nZXRfcG9zdF9tZXRhKCRpZCwnX3piX3F0eScsdHJ1ZSksJ2F2X3N0b2NrJz0+Z2V0X3Bvc3RfbWV0YSgkaWQsJ19zdG9jaycsdHJ1ZSksJ293bic9PmdldF9wb3N0X21ldGEoJGlkLCdfb3duX3N0b2NrX3F0eScsdHJ1ZSksJ2tsaWVudGFzJz0+d2NfZ2V0X3Byb2R1Y3QoJGlkKS0+Z2V0X3N0b2NrX3F1YW50aXR5KCldOyB9CiAgICAgICAgJG9bJ3BteGkzJ109JHdwZGItPmdldF9yb3coIlNFTEVDVCBwcm9jZXNzaW5nLHRyaWdnZXJlZCxxdWV1ZV9jaHVua19udW1iZXIsdXBkYXRlZCxza2lwcGVkLGxhc3RfYWN0aXZpdHkgRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTMiLEFSUkFZX0EpOwogICAgfQogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1J8SlNPTl9JTlZBTElEX1VURjhfU1VCU1RJVFVURSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-094113';
const GKEY='ps_ex27';
const PHASES=["P", "V"];
const OUT='analize/s1593_v.json';
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
