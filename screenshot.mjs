process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIGtsaWVudGFpIHJlY29uICovCmFkZF9hY3Rpb24oJ2FkbWluX21lbnUnLCBmdW5jdGlvbigpeyBpZighaXNzZXQoJF9HRVRbJ3BzX2tsJ10pKSByZXR1cm47IH0sIDk5OSk7CmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfa2wnXSl8fCRfR0VUWydwc19rbCddIT09J1InKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgJG89YXJyYXkoKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLSpsYW5nYXMqLnBocCcpIGFzICRmKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGYpOyBwcmVnX21hdGNoX2FsbCgiL2FkZF8oPzptZW51fHN1Ym1lbnUpX3BhZ2VccypcKChbXjtdezAsMzAwfSkvcyIsJGMsJG0pOyAkb1snbWVudSddW2Jhc2VuYW1lKCRmKV09YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gcHJlZ19yZXBsYWNlKCcvXHMrLycsJyAnLCR4KTt9LCRtWzFdKTsgfQogIGZvcmVhY2goYXJyYXkoJ3BldHNob3Ata2FtcGFuaWp1LWxhbmdhcy5waHAnLCdwZXRzaG9wLXJlenVsdGF0YWkucGhwJywncGV0c2hvcC1wcmVudW1lcmF0dS1wcm9nbm96ZS5waHAnKSBhcyAkbil7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nLycuJG4pOyBwcmVnX21hdGNoX2FsbCgiL2FkZF8oPzptZW51fHN1Ym1lbnUpX3BhZ2VccypcKChbXjtdezAsMzAwfSkvcyIsJGMsJG0pOyAkb1snbWVudSddWyRuXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsJHgpO30sJG1bMV0pOyBpZigkbj09PSdwZXRzaG9wLWthbXBhbmlqdS1sYW5nYXMucGhwJyl7IHByZWdfbWF0Y2hfYWxsKCIvXFxcJF8oR0VUfFBPU1R8UkVRVUVTVClcW1snXCJdKFthLXpfXSspWydcIl1cXS8iLCRjLCRnKTsgJG9bJ2thbXBfcGFyYW1zJ109YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgkZ1syXSkpOyBwcmVnX21hdGNoKCcvZnVuY3Rpb24gc2VnbWVudGFpW157XSpcey57MCwxNTAwfS9zJywkYywkcyk7ICRvWydrYW1wX3NlZ21lbnRhaSddPSRzPyRzWzBdOm51bGw7IH0gfQogIC8vIHByb2dub3rEl3MgbW9kdWxpbyBwYXJlbnQgcmFkaW1vIGtvZGFzICsgc3RpbGlhdXMgcGF2eXpkeXMKICAkYz1maWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXByZW51bWVyYXR1LXByb2dub3plLnBocCcpOyBwcmVnX21hdGNoKCcvLnswLDIwMH1cJHN1Ym1lbnUuezAsNjAwfS9zJywkYywkcyk7ICRvWydwcm9nbm96ZV9wYXJlbnQnXT0kcz8kc1swXTpudWxsOyBwcmVnX21hdGNoKCcvPHN0eWxlPi57MCw5MDB9L3MnLCRjLCRzKTsgJG9bJ3Byb2dub3plX3N0eWxlJ109JHM/JHNbMF06bnVsbDsKICAvLyBhdWdpbnRpbmlvIHNhdWd5a2xhCiAgJG9bJ3BldF90YWJsZXMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRwfXBzX3BldCUnIik7ICRvWydwZXRfY3B0J109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcG9zdF90eXBlLENPVU5UKCopIG4gRlJPTSB7JHB9cG9zdHMgV0hFUkUgcG9zdF90eXBlIExJS0UgJyVwZXQlJyBPUiBwb3N0X3R5cGUgTElLRSAnJWF1Z2ludCUnIEdST1VQIEJZIHBvc3RfdHlwZSIsQVJSQVlfQSk7CiAgJG9bJ2hwb3MnXT1jbGFzc19leGlzdHMoJ0F1dG9tYXR0aWNcV29vQ29tbWVyY2VcVXRpbGl0aWVzXE9yZGVyVXRpbCcpJiZBdXRvbWF0dGljXFdvb0NvbW1lcmNlXFV0aWxpdGllc1xPcmRlclV0aWw6OmN1c3RvbV9vcmRlcnNfdGFibGVfdXNhZ2VfaXNfZW5hYmxlZCgpOwogICRvWydjYXRfYW5pbWFscyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHQudGVybV9pZCx0Lm5hbWUsdC5zbHVnLHR0LnBhcmVudCBGUk9NIHskcH10ZXJtcyB0IEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV9pZD10LnRlcm1faWQgV0hFUkUgdHQudGF4b25vbXk9J3Byb2R1Y3RfY2F0JyBBTkQgdHQucGFyZW50PTAiLEFSUkFZX0EpOwogICRvWydhZG1pbl91aWQxJ109Z2V0X3VzZXJfYnkoJ2lkJywxKS0+dXNlcl9sb2dpbjsKICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9KTsK';
const VER='dep-161414';
const GKEY='ps_kl';
const PHASES=["R"];
const OUT='analize/kl_recon.json';
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
