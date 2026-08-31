process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIG1lbml1IHJlY29uMiAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX21uJ10pfHwkX0dFVFsncHNfbW4nXSE9PSdSMicpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgpOwogIGZvcmVhY2goYXJyYXlfbWVyZ2UoZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpLGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtY29yZS9pbmNsdWRlcy8qLnBocCcpKSBhcyAkZil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmKTsgaWYoc3RycG9zKCRjLCdQZXRzaG9wX0thbXBhbmlqdV9MYW5nYXMnKSE9PWZhbHNlICYmIGJhc2VuYW1lKCRmKSE9PSdwZXRzaG9wLWthbXBhbmlqdS1sYW5nYXMucGhwJyl7IHByZWdfbWF0Y2hfYWxsKCcvUGV0c2hvcF9LYW1wYW5panVfTGFuZ2FzOjpbYS16X10rLycsJGMsJG0pOyAkb1tiYXNlbmFtZSgkZildPWFycmF5X3ZhbHVlcyhhcnJheV91bmlxdWUoJG1bMF0pKTsgfSB9CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1rYW1wYW5panUtbGFuZ2FzLnBocCcpOyBwcmVnX21hdGNoX2FsbCgnL3B1YmxpYyBzdGF0aWMgZnVuY3Rpb24gKFthLXpfXSspLycsJGMsJG0pOyAkb1sna2FtcF9tZXRvZGFpJ109JG1bMV07IHByZWdfbWF0Y2goJy9QbHVnaW4gTmFtZTouKlxuLipEZXNjcmlwdGlvbjpbXlxuXSovJywkYywkbSk7ICRvWydrYW1wX2hkciddPSRtPyRtWzBdOm51bGw7CiAgJGM9ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sYW5nYWkucGhwJyk7IHByZWdfbWF0Y2hfYWxsKCIvKGFkZF9tZW51X3BhZ2V8YWRkX3N1Ym1lbnVfcGFnZSlcKChbXjtdezAsMjAwfSkvcyIsJGMsJG0pOyAkb1snbGFuZ2FpX21lbnUnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHgpO30sJG1bMl0pOyBwcmVnX21hdGNoX2FsbCgiL1snXCJddGFiWydcIl1ccyo9Pj9ccypbJ1wiXT8oW2Etel9dKyl8XD90YWI9KFthLXpfXSspfFxcXCRfR0VUXFsndGFiJ1xdW147XXswLDgwfS8iLCRjLCRtKTsgJG9bJ2xhbmdhaV90YWJzJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZShhcnJheV9maWx0ZXIoYXJyYXlfbWVyZ2UoJG1bMV0sJG1bMl0pKSkpOwogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSk7IGV4aXQ7Cn0pOwo=';
const VER='dep-164438';
const GKEY='ps_mn';
const PHASES=["R2"];
const OUT='analize/mn_recon2.json';
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
