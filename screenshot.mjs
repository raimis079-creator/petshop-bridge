process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NTAnXSkpIHJldHVybjsKICAgICRvPVsnVkVSU0lKQSc9PidTMTU5OC1EMSddOyAkZj0kX0dFVFsncHNfZXg1MCddOyAkdGd0PVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGF1a2FpLnBocCc7CiAgICBpZiAoJGY9PT0nRCcpIHsgJGI9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9yYXcuZ2l0aHVidXNlcmNvbnRlbnQuY29tL3JhaW1pczA3OS1jcmVhdG9yL3BldHNob3AtYnJpZGdlLzgzNDEzMTg4YTFjMTUxMjYyOGJlYmY5YTk5NjFkZDljNDIxYWM2Y2MvZGVwbG95L3BldHNob3AtbGF1a2FpLnBocC5iNjQnLFsndGltZW91dCc9PjYwXSkpOyAkbmV3PWJhc2U2NF9kZWNvZGUodHJpbSgkYikpOyAkb1snbWQ1J109bWQ1KCRuZXcpOyBpZiAobWQ1KCRuZXcpIT09JzIwMWNlZmZjZjNiOGFiMTZjMDhlYjEyMzcxMTJiMTA3JykgeyAkb1sna2xhaWRhJ109J21kNSc7IGdvdG8gb3V0OyB9ICRvWyd0b2tlbnMnXT1jb3VudCh0b2tlbl9nZXRfYWxsKCRuZXcpKTsgJG9bJ3dyaXRlJ109ZmlsZV9wdXRfY29udGVudHMoJHRndCwkbmV3KTsgJG9bJ2Rpc2tfbWQ1J109bWQ1X2ZpbGUoJHRndCk7IGlmKGZ1bmN0aW9uX2V4aXN0cygnb3BjYWNoZV9pbnZhbGlkYXRlJykpIG9wY2FjaGVfaW52YWxpZGF0ZSgkdGd0LHRydWUpOyBpZiAoZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9jbGVhcl9jYWNoZScpKSB3cF9jYWNoZV9jbGVhcl9jYWNoZSgpOyB9CiAgICBpZiAoJGY9PT0nVicpIHsKICAgICAgICAkb1sndmVyc2lqYSddPVBldHNob3BfTGF1a2FpOjpWRVJTSUpBOwogICAgICAgIGZvcmVhY2ggKFsnL2thdGVnb3JpamEvcmlua2luaWFpLycsJy9rYXRlZ29yaWphL3JpbmtpbmlhaS9rb25zZXJ2dS1yaW5raW5pYWkvJywnL2thdGVnb3JpamEvc3VuaW1zL2tvbnNlcnZhaS1zdW5pbXMvJ10gYXMgJHUpIHsgJGg9d3BfcmVtb3RlX3JldHJpZXZlX2JvZHkod3BfcmVtb3RlX2dldCgnaHR0cHM6Ly9kZXYuYXZlc2EubHQnLiR1Lic/bm9jYWNoZT0nLnRpbWUoKSxbJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2VdKSk7IHByZWdfbWF0Y2goJy9Sb2RvbVtePF0qL3UnLCRoLCRtKTsgcHJlZ19tYXRjaF9hbGwoJy9jbGFzcz0icHJvZHVjdC10aXRsZVtePl0qPjxhW14+XSo+KFtePF0rKTwvdScsJGgsJHR0KTsgJG9bJ2Zyb250J11bJHVdPVsncmV6dWx0YXRhaSc9PiRtWzBdPz9udWxsLCduJz0+Y291bnQoJHR0WzFdKSwnZGV6ZXMnPT5hcnJheV92YWx1ZXMoYXJyYXlfZmlsdGVyKCR0dFsxXSxmbigkeCk9PnByZWdfbWF0Y2goJy9kW8SXZV3Fvi9pdScsJHgpKSksJ3B2eic9PmFycmF5X3NsaWNlKCR0dFsxXSwwLDYpXTsgfQogICAgfQogICAgb3V0OgogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-123354';
const GKEY='ps_ex50';
const PHASES=["D", "V"];
const OUT='analize/s1598_deploy.json';
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
