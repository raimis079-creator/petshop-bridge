process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGtsaWVudGFpIGF1ZGl0b3JpamEgdGVzdCAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX2tsJ10pfHwkX0dFVFsncHNfa2wnXSE9PSdBVUQnKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoKTsKICB0cnl7ICRfUkVRVUVTVFsnc2VnbWVudGFzJ109J3JlZmlsbF9sYWlrYXMnOyAkX1JFUVVFU1RbJ3BpcmtvJ109JzEyJzsKICAgICRtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0tsaWVudGFpJywnc3VrdXJ0aV9hdWRpdG9yaWphJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkb1snbXNnJ109d3Bfc3RyaXBfYWxsX3RhZ3MoJG0tPmludm9rZShudWxsKSk7CiAgICAka2w9YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihnZXRfZGVjbGFyZWRfY2xhc3NlcygpLGZ1bmN0aW9uKCRjKXtyZXR1cm4gc3RyaXBvcygkYywna2FtcGFuJykhPT1mYWxzZTt9KSk7ICRvWydrYW1wX2tsYXNlcyddPSRrbDsKICAgIGZvcmVhY2goJGtsIGFzICRjKXsgaWYobWV0aG9kX2V4aXN0cygkYywnc2VnbWVudGFpJykpeyAkcz1jYWxsX3VzZXJfZnVuYyhhcnJheSgkYywnc2VnbWVudGFpJykpOyAkb1snY3N2X2ZhaWxhaSddPSRzWydjc3ZfZmFpbGFpJ10/P251bGw7IH0gfQogICAgJGQ9d3BfdXBsb2FkX2RpcigpWydiYXNlZGlyJ10uJy9wcy1pbXBvcnQnOyAkZj1nbG9iKCRkLicva2xpZW50YWlfKi5jc3YnKTsgJG9bJ2ZhaWxhcyddPSRmP2FycmF5KGJhc2VuYW1lKGVuZCgkZikpLGNvdW50KGZpbGUoZW5kKCRmKSkpLTEsZmlsZShlbmQoJGYpKVsxXT8/JycpOm51bGw7CiAgICAkb1sna2FtcF91cmxfbSddPShuZXcgUmVmbGVjdGlvbk1ldGhvZCgnUGV0c2hvcF9LbGllbnRhaScsJ2thbXBhbmlqdV91cmwnKSktPmdldE5hbWUoKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ0ZBVEFMJ109JGUtPmdldE1lc3NhZ2UoKS4nIEAnLiRlLT5nZXRMaW5lKCk7IH0KICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-162600';
const GKEY='ps_kl';
const PHASES=["AUD"];
const OUT='analize/kl_aud.json';
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
