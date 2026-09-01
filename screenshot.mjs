process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTU1YyBTdXBlciBDYWNoZSBkZWJ1ZyBsb2cgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnT04nLCdSRUFEJyksdHJ1ZSkpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyAkbz1hcnJheSgndic9PidTMTU1NWMnLCdmYXplJz0+JGYpOyBAc2V0X3RpbWVfbGltaXQoMjUwKTsKICB0cnl7CiAgICBpZighZnVuY3Rpb25fZXhpc3RzKCd3cF9jYWNoZV9zZXR0aW5nJykpIHJlcXVpcmVfb25jZSBXUF9QTFVHSU5fRElSLicvd3Atc3VwZXItY2FjaGUvd3AtY2FjaGUucGhwJzsKICAgIGlmKCRmPT09J09OJyl7CiAgICAgIGlmKGZ1bmN0aW9uX2V4aXN0cygnd3BzY19jcmVhdGVfZGVidWdfbG9nJykpeyAkb1snbG9nJ109d3BzY19jcmVhdGVfZGVidWdfbG9nKCdwc19zMTU1NWNfZGVidWcucGhwJywncHMxNTU1Jyk7IH0gZWxzZSB7IGZvcmVhY2goYXJyYXkoJ3dwX3N1cGVyX2NhY2hlX2RlYnVnJz0+MSwnd3BfY2FjaGVfZGVidWdfbGV2ZWwnPT41LCd3cF9jYWNoZV9kZWJ1Z19pcCc9PicnLCd3cF9jYWNoZV9kZWJ1Z19sb2cnPT4ncHNfczE1NTVjX2RlYnVnLnBocCcsJ3dwX2NhY2hlX2RlYnVnX3VzZXJuYW1lJz0+J3BzMTU1NScpIGFzICRrPT4kdikgd3BfY2FjaGVfc2V0dGluZygkaywkdik7IH0KICAgICAgd3BfY2FjaGVfc2V0dGluZygnd3Bfc3VwZXJfY2FjaGVfZGVidWcnLDEpOyB3cF9jYWNoZV9zZXR0aW5nKCd3cF9jYWNoZV9kZWJ1Z19sZXZlbCcsNSk7IHdwX2NhY2hlX3NldHRpbmcoJ3dwX2NhY2hlX2RlYnVnX2lwJywnJyk7CiAgICAgICRvWydkZXZfcm91dGVyJ109c3Vic3RyKChzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKEFCU1BBVEguJ2Rldi1yb3V0ZXIucGhwJyksMCwxMjAwKTsKICAgICAgJGh0PShzdHJpbmcpQGZpbGVfZ2V0X2NvbnRlbnRzKEFCU1BBVEguJy5odGFjY2VzcycpOyAkb1snaHRhY2Nlc3MnXT1zdWJzdHIoJGh0LDAsMTUwMCk7CiAgICAgICRvWydhZHYnXT1zdWJzdHIoKHN0cmluZylmaWxlX2dldF9jb250ZW50cyhXUF9DT05URU5UX0RJUi4nL2FkdmFuY2VkLWNhY2hlLnBocCcpLDAsNjAwKTsKICAgIH0gZWxzZSB7CiAgICAgICR1cmxzPWFycmF5KGhvbWVfdXJsKCcvdGFrc2FzLycpLGhvbWVfdXJsKCcvdGFrc2FzLycpLGhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvc2F1c2FzLW1haXN0YXMtc3VuaW1zLycpLGhvbWVfdXJsKCcva2F0ZWdvcmlqYS9zdW5pbXMvbWFpc3Rhcy1zdW5pbXMvc2F1c2FzLW1haXN0YXMtc3VuaW1zLycpKTsKICAgICAgZm9yZWFjaCgkdXJscyBhcyAkdSl7ICR0MD1taWNyb3RpbWUodHJ1ZSk7ICRnPXdwX3JlbW90ZV9nZXQoJHUsYXJyYXkoJ3RpbWVvdXQnPT40MCwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3VzZXItYWdlbnQnPT4nTW96aWxsYS81LjAgZGJnJykpOyAkb1snbXMnXVtdPShpbnQpcm91bmQoKG1pY3JvdGltZSh0cnVlKS0kdDApKjEwMDApOyB9CiAgICAgIGdsb2JhbCAkY2FjaGVfcGF0aDsgJGxvZ3M9Z2xvYigkY2FjaGVfcGF0aC4nKmRlYnVnKicpOyAkb1snbG9ncyddPWFycmF5X21hcCgnYmFzZW5hbWUnLCRsb2dzKTsKICAgICAgZm9yZWFjaCgkbG9ncyBhcyAkbCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRsKTsgJGxpbmVzPWFycmF5X2ZpbHRlcihleHBsb2RlKCJcbiIsJGMpLGZuKCR4KT0+dHJpbSgkeCkhPT0nJyAmJiBzdHJwb3MoJHgsJzw/cGhwJyk9PT1mYWxzZSAmJiBzdHJwb3MoJHgsJz8+Jyk9PT1mYWxzZSk7CiAgICAgICAgJG9bJ2xvZ190YWlsJ109YXJyYXlfc2xpY2UoYXJyYXlfdmFsdWVzKGFycmF5X21hcChmbigkeCk9PnN1YnN0cihzdHJpcF90YWdzKCR4KSwwLDIyMCksJGxpbmVzKSksLTcwKTsgfQogICAgICAkb1snZmlsZXNfbm93J109YXJyYXlfbWFwKGZuKCR4KT0+c3RyX3JlcGxhY2UoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlLycsJycsJHgpLGFycmF5X21lcmdlKGdsb2IoV1BfQ09OVEVOVF9ESVIuJy9jYWNoZS9zdXBlcmNhY2hlLyovKi9pbmRleConKSxnbG9iKFdQX0NPTlRFTlRfRElSLicvY2FjaGUvc3VwZXJjYWNoZS8qLyovKi8qLyovaW5kZXgqJykpKTsKICAgICAgd3BfY2FjaGVfc2V0dGluZygnd3Bfc3VwZXJfY2FjaGVfZGVidWcnLDApOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-095236';
const GKEY='ps_seo';
const PHASES=["ON", "READ"];
const OUT='analize/s1555c.json';
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
