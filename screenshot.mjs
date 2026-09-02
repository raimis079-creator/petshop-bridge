process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgU05BUFNIT1QgcHJpZXMganVvc3RhICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3NuMSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCk7IHNldF90aW1lX2xpbWl0KDI4MCk7CiAgJGRpcj13cF91cGxvYWRfZGlyKClbJ2Jhc2VkaXInXS4nL3BzLWJhY2t1cHMnOyBpZighaXNfZGlyKCRkaXIpKSB3cF9ta2Rpcl9wKCRkaXIpOwogICR6aXBmPSRkaXIuJy9TTkFQU0hPVC0yMDI2LTA5LTAyLXByaWVzLWp1b3N0YS56aXAnOwogICR6PW5ldyBaaXBBcmNoaXZlKCk7IGlmKCR6LT5vcGVuKCR6aXBmLFppcEFyY2hpdmU6OkNSRUFURXxaaXBBcmNoaXZlOjpPVkVSV1JJVEUpIT09dHJ1ZSl7IGVjaG8ganNvbl9lbmNvZGUoYXJyYXkoJ2tsYWlkYSc9Pid6aXAnKSk7IGV4aXQ7IH0KICAkbj0wOyAkYWRkPWZ1bmN0aW9uKCRiYXNlLCRwcmVmaXgpIHVzZSgmJHosJiRuKXsgJGl0PW5ldyBSZWN1cnNpdmVJdGVyYXRvckl0ZXJhdG9yKG5ldyBSZWN1cnNpdmVEaXJlY3RvcnlJdGVyYXRvcigkYmFzZSxGaWxlc3lzdGVtSXRlcmF0b3I6OlNLSVBfRE9UUykpOyBmb3JlYWNoKCRpdCBhcyAkZil7ICRyZWw9JHByZWZpeC4nLycubHRyaW0oc3RyX3JlcGxhY2UoJGJhc2UsJycsJGYtPmdldFBhdGhuYW1lKCkpLCcvJyk7ICR6LT5hZGRGaWxlKCRmLT5nZXRQYXRobmFtZSgpLCRyZWwpOyAkbisrOyB9IH07CiAgJGFkZChXUE1VX1BMVUdJTl9ESVIsJ211LXBsdWdpbnMnKTsKICBmb3JlYWNoKGFycmF5KCdwZXRzaG9wLWNvcmUnLCdwZXRzaG9wLXhtbCcpIGFzICRwbCl7IGlmKGlzX2RpcihXUF9QTFVHSU5fRElSLicvJy4kcGwpKSAkYWRkKFdQX1BMVUdJTl9ESVIuJy8nLiRwbCwncGx1Z2lucy8nLiRwbCk7IH0KICAkdGg9Z2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCk7ICRhZGQoJHRoLCd0aGVtZS1jaGlsZCcpOwogIC8vIHNuaXBwZXRhaSBpcyBEQiAoYWt0eXZ1cyArIG5lYWt0eXZ1cywgYmUgVEVNUCkKICAkc249JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxjb2RlLGFjdGl2ZSxzY29wZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTk9UIExJS0UgJ1RFTVAlJyBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgJGlkeD1hcnJheSgpOyBmb3JlYWNoKCRzbiBhcyAkcyl7ICR6LT5hZGRGcm9tU3RyaW5nKCdzbmlwcGV0cy8nLiRzWydpZCddLicucGhwJywiPD9waHBcbi8qIFNOSVBQRVQgI3skc1snaWQnXX0g4oCUIHskc1snbmFtZSddfSDigJQgYWN0aXZlPXskc1snYWN0aXZlJ119IHNjb3BlPXskc1snc2NvcGUnXX0gKi9cbiIuJHNbJ2NvZGUnXSk7ICRpZHhbXT0kc1snaWQnXS4nIHwgJy4kc1snYWN0aXZlJ10uJyB8ICcuJHNbJ25hbWUnXTsgJG4rKzsgfQogICR6LT5hZGRGcm9tU3RyaW5nKCdzbmlwcGV0cy9JTkRFWC50eHQnLGltcGxvZGUoIlxuIiwkaWR4KSk7CiAgLy8gc3ZhcmJpb3Mgb3BjaWpvcwogICRvcHM9YXJyYXkoKTsgZm9yZWFjaCgkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxvcHRpb25fdmFsdWUgRlJPTSB7JHdwZGItPm9wdGlvbnN9IFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3BzXyUnIEFORCBvcHRpb25fbmFtZSBOT1QgTElLRSAnJXNlY3JldCUnIEFORCBvcHRpb25fbmFtZSBOT1QgTElLRSAnJXBhc3MlJyBBTkQgTEVOR1RIKG9wdGlvbl92YWx1ZSk8MjAwMDAwIixBUlJBWV9BKSBhcyAkcil7ICRvcHNbJHJbJ29wdGlvbl9uYW1lJ11dPSRyWydvcHRpb25fdmFsdWUnXTsgfQogICR6LT5hZGRGcm9tU3RyaW5nKCdvcHRpb25zLXBzLmpzb24nLGpzb25fZW5jb2RlKCRvcHMsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSkpOyAKICAkei0+YWRkRnJvbVN0cmluZygnUkVBRE1FLnR4dCcsIlNOQVBTSE9UIDIwMjYtMDktMDIgKFMxNjA0KSDigJQgdXpzYWt5bXUgc2lzdGVtYSBQUklFUyBqdW9zdG9zL1VJIGV0YXBhLlxuVHVyaW55czogbXUtcGx1Z2lucy8sIHBsdWdpbnMvcGV0c2hvcC1jb3JlLCBwbHVnaW5zL3BldHNob3AteG1sLCB0aGVtZS1jaGlsZC8sIHNuaXBwZXRzLyAoQ29kZSBTbmlwcGV0cyBpcyBEQiwgYmUgVEVNUCksIG9wdGlvbnMtcHMuanNvbi5cbkF0c3RhdHltYXM6IDEpIHVuemlwIG11LXBsdWdpbnMgLT4gd3AtY29udGVudC9tdS1wbHVnaW5zIChwZXJyYXN5dGkpOyAyKSBzbmlwcGV0cy8qLnBocCAtPiBwZXIgQ29kZSBTbmlwcGV0cyBpbXBvcnRhIGFyYmEgVVBEQVRFIGdhajZfc25pcHBldHMgY29kZSBwYWdhbCBpZDsgMykgb3B0aW9ucyB0aWsgamVpIHJlaWtpYS5cblZlcnNpam9zOiBkZXNrIHYzLjQ4LCB0aWVraW1hcyB2MS45LjMsIGRyb3BzaGlwIHYxLjE5LCBzaXVudHUtbGFpc2thaSB2MS4yLCBsYXBhaSAoYXYtc2hlZXRzKSwga2F0YWxvZ2FzLCB0ZWlzZXMuXG4iKTsKICAkei0+Y2xvc2UoKTsKICAkb1snemlwJ109YXJyYXkoJ2tlbGlhcyc9PiR6aXBmLCdieXRlcyc9PmZpbGVzaXplKCR6aXBmKSwnbWQ1Jz0+bWQ1X2ZpbGUoJHppcGYpLCdmYWlsdSc9PiRuKzIsJ3NuaXBwZXR1Jz0+Y291bnQoJHNuKSk7CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb24nKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-173100';
const GKEY='ps_sn1';
const PHASES=["S"];
const OUT='analize/snapshot.json';
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
