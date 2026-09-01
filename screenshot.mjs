process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTc0IHJlY29uICgzMDEg4oaSIHdwLWFkbWluIHByaWV6YXN0aXMpICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogICRmPWlzc2V0KCRfR0VUWydwc19yNzQnXSk/JF9HRVRbJ3BzX3I3NCddOicnOyBpZigkZiE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOwogIGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NzQnKTsKICB0cnl7CiAgICAkb1snbGVnYWN5X2tvZGFzJ109ZmlsZV9nZXRfY29udGVudHMoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1sZWdhY3ktMzAxLnBocCcpOwogICAgJG9bJ3Rlcm1fbGlua185NiddPWdldF90ZXJtX2xpbmsoOTYsJ3Byb2R1Y3RfY2F0Jyk7CiAgICAkaG9tZT1ob21lX3VybCgpOyAkaD1mdW5jdGlvbigkdSkgdXNlKCRob21lKXsgJHI9d3BfcmVtb3RlX2hlYWQoJHUsYXJyYXkoJ3JlZGlyZWN0Jz0+MCwndGltZW91dCc9PjIwLCdzc2x2ZXJpZnknPT5mYWxzZSwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCcpKTsgcmV0dXJuIGFycmF5KHdwX3JlbW90ZV9yZXRyaWV2ZV9yZXNwb25zZV9jb2RlKCRyKSx3cF9yZW1vdGVfcmV0cmlldmVfaGVhZGVyKCRyLCdsb2NhdGlvbicpKTsgfTsKICAgICRvWydrYXRfdGllc2lhaSddPSRoKCRob21lLicva2F0ZWdvcmlqYS9rYXRlbXMvc2thbmVzdGFpLWthdGVtcy8nKTsKICAgICRvWydrYXRfdGllc2lhaV9iZV9zbGFzaCddPSRoKCRob21lLicva2F0ZWdvcmlqYS9rYXRlbXMvc2thbmVzdGFpLWthdGVtcycpOwogICAgJG9bJ2tpdGFfa2F0J109JGgoJGhvbWUuJy9rYXRlZ29yaWphL2thdGVtcy8nKTsKICAgICRvWydraXRhc19tYXBfa2VsaWFzJ109JGgoJGhvbWUuJy9rYXRlbXMnKTsKICAgICRvWydraXRhc19tYXBfa2VsaWFzMiddPSRoKCRob21lLicvc3VuaW1zL3NrYW5lc3RhaS1zdW5pbXMnKTsKICAgICRvWydhdHNpdGlrdGluaXNfNDA0J109JGgoJGhvbWUuJy9uZXNhbWFzLWtlbGlhcy1zMTU3NCcpOwogICAgLy8gZ3JlcCBtdS1wbHVnaW5zIGlyIGFrdHl2aXVzIHNuaXBwZXR1czogd3BfcmVkaXJlY3QgKyBhZG1pbgogICAgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJHApeyAkYz1maWxlX2dldF9jb250ZW50cygkcCk7IGlmKHByZWdfbWF0Y2goJy93cF8oc2FmZV8pP3JlZGlyZWN0XHMqXChccyooYWRtaW5fdXJsfGdldF9hZG1pbl91cmx8W14pXSp3cC1hZG1pbikvaScsJGMpKSAkb1snbXVfYWRtaW5fcmVkaXJlY3QnXVtdPWJhc2VuYW1lKCRwKTsgaWYocHJlZ19tYXRjaCgnL3NrYW5lc3RhaS9pJywkYykpICRvWydtdV9za2FuZXN0YWknXVtdPWJhc2VuYW1lKCRwKTsgfQogICAgJHNuPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGFjdGl2ZT0xIixBUlJBWV9BKTsKICAgIGZvcmVhY2goJHNuIGFzICRzKXsgaWYocHJlZ19tYXRjaCgnL3dwXyhzYWZlXyk/cmVkaXJlY3RccypcKFxzKihhZG1pbl91cmx8Z2V0X2FkbWluX3VybHxbXildKndwLWFkbWluKS9pJywkc1snY29kZSddKSkgJG9bJ3NuaXBfYWRtaW5fcmVkaXJlY3QnXVtdPSRzWydpZCddLicgJy4kc1snbmFtZSddOyBpZihwcmVnX21hdGNoKCcvc2thbmVzdGFpL2knLCRzWydjb2RlJ10pKSAkb1snc25pcF9za2FuZXN0YWknXVtdPSRzWydpZCddLicgJy4kc1snbmFtZSddOyBpZihwcmVnX21hdGNoKCcvdGVtcGxhdGVfcmVkaXJlY3R8cGFyc2VfcmVxdWVzdC8nLCRzWydjb2RlJ10pJiZwcmVnX21hdGNoKCcvd3BfKHNhZmVfKT9yZWRpcmVjdC8nLCRzWydjb2RlJ10pKSAkb1snc25pcF9yZWRpcmVjdF9ob29rcyddW109JHNbJ2lkJ10uJyAnLiRzWyduYW1lJ107IH0KICAgIC8vIGF0dGFjaG1lbnQgMzUwMDUKICAgICRvWydhdHQzNTAwNSddPSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgSUQscG9zdF9wYXJlbnQscG9zdF90aXRsZSxndWlkLHBvc3RfZGF0ZSBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIElEPTM1MDA1IixBUlJBWV9BKTsKICAgICRvWydhdHRfbWV0YSddPWdldF9wb3N0X21ldGEoMzUwMDUsJ193cF9hdHRhY2hlZF9maWxlJyx0cnVlKTsKICAgIC8vIFJhbmsgTWF0aCByZWRpcmVjdGlvbnM/CiAgICAkb1sncm1fcmVkaXJlY3RzX3RhYmxlJ109JHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skd3BkYi0+cHJlZml4fXJhbmtfbWF0aF9yZWRpcmVjdGlvbnMnIik7CiAgICBpZigkb1sncm1fcmVkaXJlY3RzX3RhYmxlJ10pICRvWydybV9yZWRpcmVjdHMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzb3VyY2VzLHVybF90byxoZWFkZXJfY29kZSxzdGF0dXMgRlJPTSB7JHdwZGItPnByZWZpeH1yYW5rX21hdGhfcmVkaXJlY3Rpb25zIExJTUlUIDIwIixBUlJBWV9BKTsKICAgICRybT1nZXRfb3B0aW9uKCdyYW5rX21hdGhfbW9kdWxlcycpOyAkb1sncm1fbW9kdWxlcyddPSRybTsKICAgICRvWydybV9hdHRhY2htZW50J109Z2V0X29wdGlvbigncmFuay1tYXRoLW9wdGlvbnMtZ2VuZXJhbCcpOyBpZihpc19hcnJheSgkb1sncm1fYXR0YWNobWVudCddKSkgJG9bJ3JtX2F0dGFjaG1lbnQnXT1hcnJheV9pbnRlcnNlY3Rfa2V5KCRvWydybV9hdHRhY2htZW50J10sYXJyYXlfZmxpcChhcnJheSgnYXR0YWNobWVudF9yZWRpcmVjdF91cmxzJywnYXR0YWNobWVudF9yZWRpcmVjdF9kZWZhdWx0JywncmVkaXJlY3Rpb25zX2hlYWRlcl9jb2RlJywncmVkaXJlY3Rpb25zX2ZhbGxiYWNrJywncmVkaXJlY3Rpb25zX2N1c3RvbV91cmwnKSkpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldEZpbGUoKS4nOicuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-155002';
const GKEY='ps_r74';
const PHASES=["GO"];
const OUT='analize/s1574.json';
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
