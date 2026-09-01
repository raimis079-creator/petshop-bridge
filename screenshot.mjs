process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTYwIFBTSSBkZXRhbMSXcyAoTENQIGVsZW1lbnRhcywgYmxva3VvamFudHlzIHJlc3Vyc2FpKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj1pc3NldCgkX0dFVFsncHNfc2VvJ10pPyRfR0VUWydwc19zZW8nXTonJzsgaWYoJGYhPT0nUFNJJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7ICRvPWFycmF5KCd2Jz0+J1MxNTYwJyk7IEBzZXRfdGltZV9saW1pdCgyODApOwogIHRyeXsKICAgICRrZXk9Z2V0X29wdGlvbigncHNfcHNpX2tleScpOyAkdT1ob21lX3VybCgnLycpOwogICAgJHI9d3BfcmVtb3RlX2dldCgnaHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vcGFnZXNwZWVkb25saW5lL3Y1L3J1blBhZ2VzcGVlZD9zdHJhdGVneT1tb2JpbGUmY2F0ZWdvcnk9cGVyZm9ybWFuY2Uma2V5PScucmF3dXJsZW5jb2RlKCRrZXkpLicmdXJsPScucmF3dXJsZW5jb2RlKCR1KSxhcnJheSgndGltZW91dCc9PjEyMCkpOwogICAgJGo9anNvbl9kZWNvZGUod3BfcmVtb3RlX3JldHJpZXZlX2JvZHkoJHIpLHRydWUpOyAkYT0kalsnbGlnaHRob3VzZVJlc3VsdCddWydhdWRpdHMnXT8/YXJyYXkoKTsgaWYoISRhKSB0aHJvdyBuZXcgRXhjZXB0aW9uKHN1YnN0cih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkciksMCwzMDApKTsKICAgICRvWydzY29yZSddPXJvdW5kKDEwMCokalsnbGlnaHRob3VzZVJlc3VsdCddWydjYXRlZ29yaWVzJ11bJ3BlcmZvcm1hbmNlJ11bJ3Njb3JlJ10pOwogICAgZm9yZWFjaChhcnJheSgnc2VydmVyLXJlc3BvbnNlLXRpbWUnLCdmaXJzdC1jb250ZW50ZnVsLXBhaW50JywnbGFyZ2VzdC1jb250ZW50ZnVsLXBhaW50JywndG90YWwtYmxvY2tpbmctdGltZScsJ3NwZWVkLWluZGV4JywnaW50ZXJhY3RpdmUnKSBhcyAkaykgJG9bJ20nXVska109aXNzZXQoJGFbJGtdWydudW1lcmljVmFsdWUnXSk/cm91bmQoJGFbJGtdWydudW1lcmljVmFsdWUnXSk6bnVsbDsKICAgICRvWydsY3BfZWwnXT1hcnJheV9tYXAoZm4oJHgpPT5hcnJheV9pbnRlcnNlY3Rfa2V5KCR4LGFycmF5X2ZsaXAoYXJyYXkoJ25vZGUnLCdwaGFzZScsJ3RpbWluZycsJ3BlcmNlbnQnKSkpLGFycmF5X3NsaWNlKCRhWydsYXJnZXN0LWNvbnRlbnRmdWwtcGFpbnQtZWxlbWVudCddWydkZXRhaWxzJ11bJ2l0ZW1zJ11bMF1bJ2l0ZW1zJ10/P2FycmF5KCksMCwzKSk7CiAgICAkb1snbGNwX2VsX3NuaXBwZXQnXT1zdWJzdHIoJGFbJ2xhcmdlc3QtY29udGVudGZ1bC1wYWludC1lbGVtZW50J11bJ2RldGFpbHMnXVsnaXRlbXMnXVswXVsnaXRlbXMnXVswXVsnbm9kZSddWydzbmlwcGV0J10/PycnLDAsMzAwKTsKICAgICRvWydsY3BfcGhhc2VzJ109YXJyYXlfbWFwKGZuKCR4KT0+YXJyYXkoJHhbJ3BoYXNlJ10/PycnLHJvdW5kKCR4Wyd0aW1pbmcnXT8/MCkpLCRhWydsYXJnZXN0LWNvbnRlbnRmdWwtcGFpbnQtZWxlbWVudCddWydkZXRhaWxzJ11bJ2l0ZW1zJ11bMV1bJ2l0ZW1zJ10/P2FycmF5KCkpOwogICAgJG9bJ3JlbmRlcl9ibG9ja2luZyddPWFycmF5X21hcChmbigkeCk9PmFycmF5KHN1YnN0cihwcmVnX3JlcGxhY2UoJ35eaHR0cHM/Oi8vW14vXSt+JywnJywkeFsndXJsJ10pLDAsOTApLHJvdW5kKCR4Wyd0b3RhbEJ5dGVzJ10vMTAyNCksJHhbJ3dhc3RlZE1zJ10pLGFycmF5X3NsaWNlKCRhWydyZW5kZXItYmxvY2tpbmctcmVzb3VyY2VzJ11bJ2RldGFpbHMnXVsnaXRlbXMnXT8/YXJyYXkoKSwwLDE1KSk7CiAgICAkb1sncmVuZGVyX2Jsb2NraW5nX21zJ109JGFbJ3JlbmRlci1ibG9ja2luZy1yZXNvdXJjZXMnXVsnbnVtZXJpY1ZhbHVlJ10/P251bGw7CiAgICAkb1snYm9vdHVwJ109YXJyYXlfbWFwKGZuKCR4KT0+YXJyYXkoc3Vic3RyKHByZWdfcmVwbGFjZSgnfl5odHRwcz86Ly9bXi9dK34nLCcnLCR4Wyd1cmwnXSksMCw4MCkscm91bmQoJHhbJ3RvdGFsJ10pKSxhcnJheV9zbGljZSgkYVsnYm9vdHVwLXRpbWUnXVsnZGV0YWlscyddWydpdGVtcyddPz9hcnJheSgpLDAsMTApKTsKICAgICRvWyd1bnVzZWRfanNfa2InXT1yb3VuZCgoJGFbJ3VudXNlZC1qYXZhc2NyaXB0J11bJ251bWVyaWNWYWx1ZSddPz8wKSk7ICRvWyd1bnVzZWRfanMnXT1hcnJheV9tYXAoZm4oJHgpPT5hcnJheShzdWJzdHIocHJlZ19yZXBsYWNlKCd+Xmh0dHBzPzovL1teL10rficsJycsJHhbJ3VybCddKSwwLDgwKSxyb3VuZCgkeFsnd2FzdGVkQnl0ZXMnXS8xMDI0KSksYXJyYXlfc2xpY2UoJGFbJ3VudXNlZC1qYXZhc2NyaXB0J11bJ2RldGFpbHMnXVsnaXRlbXMnXT8/YXJyYXkoKSwwLDgpKTsKICAgICRvWyd1bnVzZWRfY3NzJ109YXJyYXlfbWFwKGZuKCR4KT0+YXJyYXkoc3Vic3RyKHByZWdfcmVwbGFjZSgnfl5odHRwcz86Ly9bXi9dK34nLCcnLCR4Wyd1cmwnXSksMCw4MCkscm91bmQoJHhbJ3dhc3RlZEJ5dGVzJ10vMTAyNCkpLGFycmF5X3NsaWNlKCRhWyd1bnVzZWQtY3NzLXJ1bGVzJ11bJ2RldGFpbHMnXVsnaXRlbXMnXT8/YXJyYXkoKSwwLDgpKTsKICAgICRvWyd0aGlyZF9wYXJ0eSddPWFycmF5X21hcChmbigkeCk9PmFycmF5KCR4WydlbnRpdHknXT8/Jycscm91bmQoJHhbJ3RyYW5zZmVyU2l6ZSddLzEwMjQpLHJvdW5kKCR4WydibG9ja2luZ1RpbWUnXSkpLGFycmF5X3NsaWNlKCRhWyd0aGlyZC1wYXJ0eS1zdW1tYXJ5J11bJ2RldGFpbHMnXVsnaXRlbXMnXT8/YXJyYXkoKSwwLDgpKTsKICAgICRvWyd0b3RhbF9rYiddPXJvdW5kKCgkYVsndG90YWwtYnl0ZS13ZWlnaHQnXVsnbnVtZXJpY1ZhbHVlJ10/PzApLzEwMjQpOyAkb1sncmVxdWVzdHMnXT1jb3VudCgkYVsnbmV0d29yay1yZXF1ZXN0cyddWydkZXRhaWxzJ11bJ2l0ZW1zJ10/P2FycmF5KCkpOwogICAgJGJ5VHlwZT1hcnJheSgpOyBmb3JlYWNoKCRhWyduZXR3b3JrLXJlcXVlc3RzJ11bJ2RldGFpbHMnXVsnaXRlbXMnXT8/YXJyYXkoKSBhcyAkaXQpeyAkdD0kaXRbJ3Jlc291cmNlVHlwZSddPz8nPyc7ICRieVR5cGVbJHRdPSgkYnlUeXBlWyR0XT8/MCkrcm91bmQoKCRpdFsndHJhbnNmZXJTaXplJ10/PzApLzEwMjQpOyB9ICRvWydrYl9ieV90eXBlJ109JGJ5VHlwZTsKICAgICRvWydmb250X2Rpc3BsYXknXT1jb3VudCgkYVsnZm9udC1kaXNwbGF5J11bJ2RldGFpbHMnXVsnaXRlbXMnXT8/YXJyYXkoKSk7ICRvWydsY3BfbGF6eSddPSRhWydsY3AtbGF6eS1sb2FkZWQnXVsnc2NvcmUnXT8/bnVsbDsgJG9bJ3ByaW9yaXRpemVfbGNwJ109c3Vic3RyKGpzb25fZW5jb2RlKCRhWydwcmlvcml0aXplLWxjcC1pbWFnZSddWydkZXRhaWxzJ11bJ2l0ZW1zJ11bMF0/P251bGwpLDAsMzAwKTsKICAgICRvWydkaWFnJ109YXJyYXlfaW50ZXJzZWN0X2tleSgkYVsnZGlhZ25vc3RpY3MnXVsnZGV0YWlscyddWydpdGVtcyddWzBdPz9hcnJheSgpLGFycmF5X2ZsaXAoYXJyYXkoJ251bVJlcXVlc3RzJywnbnVtU2NyaXB0cycsJ251bVN0eWxlc2hlZXRzJywnbnVtRm9udHMnLCd0b3RhbEJ5dGVXZWlnaHQnLCdtYWluRG9jdW1lbnRUcmFuc2ZlclNpemUnLCdtYXhSdHQnLCd0aHJvdWdocHV0JykpKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-115514';
const GKEY='ps_seo';
const PHASES=["PSI"];
const OUT='analize/s1564b.json';
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
