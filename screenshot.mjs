process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTkwYiBzaGlwcGluZyBrYWlub3MgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zaDInXSkgfHwgJF9HRVRbJ3BzX3NoMiddIT09J0dPJykgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG89YXJyYXkoJ3YnPT4nUzE1OTBiJyk7CiAgdHJ5ewogICAgJHpvbmVzPVdDX1NoaXBwaW5nX1pvbmVzOjpnZXRfem9uZXMoKTsgJG91dD1hcnJheSgpOwogICAgZm9yZWFjaCgkem9uZXMgYXMgJHopeyBpZigkelsnem9uZV9uYW1lJ10hPT0nTGlldHV2YScpIGNvbnRpbnVlOwogICAgICBmb3JlYWNoKCR6WydzaGlwcGluZ19tZXRob2RzJ10gYXMgJG0peyAkb3V0W109YXJyYXkoJ2luc3QnPT4kbS0+Z2V0X2luc3RhbmNlX2lkKCksJ2lkJz0+JG0tPmlkLCdwYXYnPT4kbS0+Z2V0X3RpdGxlKCksJ2VuYWJsZWQnPT4kbS0+aXNfZW5hYmxlZCgpLCdzZXR0aW5ncyc9PiRtLT5pbnN0YW5jZV9zZXR0aW5ncyk7IH0gfQogICAgJG9bJ2xpZXR1dmFfbWV0b2RhaSddPSRvdXQ7CiAgICAvLyBWZW5pcGFrIHBsdWdpbiBnbG9iYWzFq3MgbnVzdGF0eW1haQogICAgJG9wcz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJWxwZXhwcmVzcyUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVsaXRodWFuaWFwb3N0JSciLEFSUkFZX0EpOwogICAgJG9bJ29wdF92YXJkYWknXT1hcnJheV9jb2x1bW4oJG9wcywnb3B0aW9uX25hbWUnKTsKICAgIGZvcmVhY2goYXJyYXkoJ3dvb2NvbW1lcmNlX3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX3BpY2t1cF9tZXRob2Rfc2V0dGluZ3MnLCd3b29jb21tZXJjZV9zaG9wdXBfdmVuaXBha19zaGlwcGluZ19jb3VyaWVyX21ldGhvZF9zZXR0aW5ncycpIGFzICRrKXsgJHY9Z2V0X29wdGlvbigkayk7IGlmKCR2KSAkb1ska109JHY7IH0KICAgIC8vIHJlYWxpYWkgcGFpbXRhIGnFoSBwaXJrxJdqxbMgKG5hdWppIFdvbyB0ZXN0ICsgZVNob3ByZW50IGlzdG9yaWphKQogICAgJG9bJ3dvb19zaGlwcGluZ19pdGVtcyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9pLm9yZGVyX2lkLCBvaS5vcmRlcl9pdGVtX25hbWUsIG0xLm1ldGFfdmFsdWUgY29zdCBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBvaSBMRUZUIEpPSU4geyRwfXdvb2NvbW1lcmNlX29yZGVyX2l0ZW1tZXRhIG0xIE9OIG0xLm9yZGVyX2l0ZW1faWQ9b2kub3JkZXJfaXRlbV9pZCBBTkQgbTEubWV0YV9rZXk9J2Nvc3QnIFdIRVJFIG9pLm9yZGVyX2l0ZW1fdHlwZT0nc2hpcHBpbmcnIE9SREVSIEJZIG9pLm9yZGVyX2lkIERFU0MgTElNSVQgMTIiLEFSUkFZX0EpOwogICAgJG9bJ2lzdF9zaXVudGltYXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzaXVudGltYXMsIENPVU5UKCopIG4sIFJPVU5EKEFWRyhzdW1hKSwxKSB2aWRfdXpzIEZST00geyRwfXBzX2lzdF91enNha3ltYWkgV0hFUkUgZGF0YT49JzIwMjYtMDYtMDEnIEdST1VQIEJZIHNpdW50aW1hcyBPUkRFUiBCWSBuIERFU0MgTElNSVQgMTUiLEFSUkFZX0EpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-204845';
const GKEY='ps_sh2';
const PHASES=["GO"];
const OUT='analize/s1590b_ship.json';
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
