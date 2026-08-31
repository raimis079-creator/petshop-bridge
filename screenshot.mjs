process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTQ3IHJlY29uMiAoZGltIGJ1aWxkZXIgKyBoYXNoKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICAkZj0oaXNzZXQoJF9HRVRbJ3BzX3IyJ10pPyRfR0VUWydwc19yMiddOicnKTsgaWYoJGYhPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAkbz1hcnJheSgndic9PidTMTU0N3IyJyk7CiAgdHJ5ewogICAgJGRpcnM9YXJyYXkoV1BNVV9QTFVHSU5fRElSLCBXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWNvcmUvaW5jbHVkZXMnKTsKICAgIGZvcmVhY2goJGRpcnMgYXMgJGQpewogICAgICBmb3JlYWNoKGdsb2IoJGQuJy8qLnBocCcpIGFzICRwKXsKICAgICAgICAkYz1maWxlX2dldF9jb250ZW50cygkcCk7CiAgICAgICAgJGhpdHM9YXJyYXkoKTsKICAgICAgICBpZihzdHJwb3MoJGMsJ3BzX2RpbV9rbGllbnRhaScpIT09ZmFsc2UpICRoaXRzW109J2RpbSc7CiAgICAgICAgaWYocHJlZ19tYXRjaCgnL2tsaWVudGFzX2VtYWlsX2hhc2h8ZW1haWxfaGFzaC8nLCRjKSAmJiBwcmVnX21hdGNoKCcvaGFzaFwofHNoYTI1NnxTSEEyL2knLCRjKSkgJGhpdHNbXT0naGFzaCc7CiAgICAgICAgaWYoJGhpdHMpICRvWydyYWRpbmlhaSddW2Jhc2VuYW1lKCRwKV09YXJyYXkoJ2thcyc9PiRoaXRzLCdkeWRpcyc9PnN0cmxlbigkYykpOwogICAgICB9CiAgICB9CiAgICAvLyBpc3RyYXVrYTogaGFzaCBza2FpY2lhdmltYXMKICAgIGZvcmVhY2goJG9bJ3JhZGluaWFpJ10gYXMgJGZuPT4keCl7CiAgICAgIGZvcmVhY2goJGRpcnMgYXMgJGQpeyAkcD0kZC4nLycuJGZuOyBpZihmaWxlX2V4aXN0cygkcCkpIGJyZWFrOyB9CiAgICAgICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRwKTsKICAgICAgaWYocHJlZ19tYXRjaF9hbGwoJy8uezAsMTIwfShoYXNoXHMqXChccyouc2hhMjU2fFNIQTJccypcKCkuezAsMTYwfS9pJywkYywkbSkpICRvWydoYXNoX2tvZGFzJ11bJGZuXT1hcnJheV9zbGljZSgkbVswXSwwLDQpOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-191304';
const GKEY='ps_r2';
const PHASES=["GO"];
const OUT='analize/s1547_recon2.json';
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
