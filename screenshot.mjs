process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTY5YyBzZXJ2ZXJpbyBwZXRzaG9wLXdlYnAucGhwIGFudHJhxaF0xJcgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCRmIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoJ3YnPT4nUzE1NjljJyk7CiAgdHJ5eyAkcD1XUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXdlYnAucGhwJzsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHApOyAkb1snbWQ1J109bWQ1KCRjKTsgJG9bJ0InXT1zdHJsZW4oJGMpOyAkb1snbXRpbWUnXT1kYXRlKCdZLW0tZCBIOmk6cycsZmlsZW10aW1lKCRwKSk7ICRvWydoZWFkJ109c3Vic3RyKCRjLDAsMjIwMCk7CiAgICAkb1snaG9tZV9pc19wZXRzaG9wJ109bWQ1KGdldF9vcHRpb24oJ2hvbWUnKSk9PT1tZDUoJ2h0dHBzOi8vcGV0c2hvcC5sdCcpOyAkb1snc2l0ZXVybF9pc19wZXRzaG9wJ109bWQ1KGdldF9vcHRpb24oJ3NpdGV1cmwnKSk9PT1tZDUoJ2h0dHBzOi8vcGV0c2hvcC5sdCcpOwogICAgJG9bJ211X3JlY2VudCddPWFycmF5X21hcChmbigkeCk9PmJhc2VuYW1lKCR4KS4nICcuZGF0ZSgnSDppJyxmaWxlbXRpbWUoJHgpKSxhcnJheV9maWx0ZXIoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGZuKCR4KT0+ZmlsZW10aW1lKCR4KT5zdHJ0b3RpbWUoJzIwMjYtMDktMDEgMTI6MzA6MDAgVVRDJykpKTsKICAgICRvWydzbmlwcGV0c19yZWNlbnQnXT0kR0xPQkFMU1snd3BkYiddLT5nZXRfY29sKCJTRUxFQ1QgQ09OQ0FUKGlkLCcgJyxuYW1lLCcgYT0nLGFjdGl2ZSkgRlJPTSB7JEdMT0JBTFNbJ3dwZGInXS0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkPjQzOTUgT1JERVIgQlkgaWQiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-145949';
const GKEY='ps_seo';
const PHASES=["R"];
const OUT='analize/s1569c.json';
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
