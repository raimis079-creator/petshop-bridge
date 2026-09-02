process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgSyByZWNvbiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZiAoIWlzc2V0KCRfR0VUWydwc19rMSddKSkgcmV0dXJuOyAkbz1hcnJheSgpOwogICRvWydhdl9zdG9ja19tZXRob2RzJ109Y2xhc3NfZXhpc3RzKCdQZXRzaG9wX0FWX1N0b2NrJyk/YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPm5hbWUuJygnLmltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkcCl7cmV0dXJuICRwLT5uYW1lO30sJG0tPmdldFBhcmFtZXRlcnMoKSkpLicpJzt9LChuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0FWX1N0b2NrJykpLT5nZXRNZXRob2RzKCkpOm51bGw7CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1vcmRlci5waHAnKTsgJG9bJ2F2X29yZGVyX2Zpa3N1b3RpJ109bWJfc3Vic3RyKCRjLHN0cnBvcygkYywncHVibGljIHN0YXRpYyBmdW5jdGlvbiBmaWtzdW90aScpLDI2MDApOwogICRoPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtc3RvY2sucGhwJyk7ICRvWydhdl9zdG9ja19oZWFkJ109bWJfc3Vic3RyKCRoLDAsMTUwMCk7CiAgLy8gVmVuaXBhayBwaWNrdXAgcG9pbnRzIE5lbWVuY2luZQogICRyPXdwX3JlbW90ZV9nZXQoJ2h0dHBzOi8vZ28udmVuaXBhay5sdC93cy9nZXRfcGlja3VwX3BvaW50cz9jb3VudHJ5PUxUJmNpdHk9Jy5yYXd1cmxlbmNvZGUoJ05lbWVuxI1pbsSXJyksYXJyYXkoJ3RpbWVvdXQnPT4zMCkpOyAkYj1pc193cF9lcnJvcigkcik/JHItPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpOyAkaj1qc29uX2RlY29kZSgkYix0cnVlKTsgJG9bJ3BwX25lbWVuY2luZSddPWlzX2FycmF5KCRqKT9hcnJheV9zbGljZSgkaiwwLDUpOm1iX3N1YnN0cigkYiwwLDUwMCk7CiAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9nby52ZW5pcGFrLmx0L3dzL2dldF9waWNrdXBfcG9pbnRzP2NvdW50cnk9TFQmdHlwZT0zJyxhcnJheSgndGltZW91dCc9PjMwKSk7ICRiPXdwX3JlbW90ZV9yZXRyaWV2ZV9ib2R5KCRyKTsgJGo9anNvbl9kZWNvZGUoJGIsdHJ1ZSk7ICRvWydwcF9hbGxfbiddPWlzX2FycmF5KCRqKT9jb3VudCgkaik6MDsgaWYoaXNfYXJyYXkoJGopKXsgZm9yZWFjaCgkaiBhcyAkcHApeyBpZihzdHJpcG9zKGpzb25fZW5jb2RlKCRwcCxKU09OX1VORVNDQVBFRF9VTklDT0RFKSwnTmVtZW4nKSE9PWZhbHNlfHwoJHBwWydpZCddPz8wKT09MzY0OCkgJG9bJ3BwX21hdGNoJ11bXT0kcHA7IH0gfQogIC8vIGthaXAgdmVuaXBhayBwbHVnaW5hcyByYXNobyBjb25zaWduZWUgcGFzdG9tYXR1aQogIGZvcmVhY2goZ2xvYihXUF9QTFVHSU5fRElSLicvKnZlbmlwYWsqL2luY2x1ZGVzLyoucGhwJykgYXMgJGYpeyAkYz1maWxlX2dldF9jb250ZW50cygkZik7IGlmKHByZWdfbWF0Y2goJy9jb25zaWduZWUuezAsMTUwMH0/KGNvbXBhbnlfY29kZXxwaWNrdXApW15cbl17MCwyMDB9L3MnLCRjLCRtKSkgJG9bJ3BsdWdpbl9jb25zaWduZWUnXVtiYXNlbmFtZSgkZildPW1iX3N1YnN0cigkbVswXSwwLDE0MDApOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9KTsK';
const VER='dep-170241';
const GKEY='ps_k1';
const PHASES=["R"];
const OUT='analize/k_r.json';
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
