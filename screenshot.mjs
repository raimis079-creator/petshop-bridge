process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTUwIDMwMSDFvmVtxJdsYXBpbyB2YWx5bWFzIChuZXNhbW9zIHByZWvEl3MvdGVybWluYWkpICsgVEVNUCBzbmlwcGV0xbMgdHJ5bmltYXMgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgJGY9aXNzZXQoJF9HRVRbJ3BzX3NlbyddKT8kX0dFVFsncHNfc2VvJ106Jyc7IGlmKCFpbl9hcnJheSgkZixhcnJheSgnRFJZJywnQVBQTFknKSx0cnVlKSkgcmV0dXJuOwogIGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7IGdsb2JhbCAkd3BkYjsgJG89YXJyYXkoJ3YnPT4nUzE1NTAnLCdmYXplJz0+JGYpOwogIHRyeXsKICAgICRwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbic7ICRyYXc9ZmlsZV9nZXRfY29udGVudHMoJHApOyAkb1snbWQ1X3ByaWVzJ109bWQ1KCRyYXcpOyAkbWFwPWpzb25fZGVjb2RlKCRyYXcsdHJ1ZSk7CiAgICBpZighaXNfYXJyYXkoJG1hcCkpIHRocm93IG5ldyBFeGNlcHRpb24oJ21hcCBuZSBtYXN5dmFzJyk7ICRvWyduX3ByaWVzJ109Y291bnQoJG1hcCk7CiAgICAkc2FsaW50aT1hcnJheSgpOyAkZHJhZnQ9YXJyYXkoKTsKICAgIGZvcmVhY2goJG1hcCBhcyAkaz0+JHQpewogICAgICBpZihzdHJwb3MoJHQsJ19fVEVSTV9fJyk9PT0wKXsgJHRlcm09Z2V0X3Rlcm0oKGludClzdWJzdHIoJHQsOCksJ3Byb2R1Y3RfY2F0Jyk7IGlmKCEkdGVybXx8aXNfd3BfZXJyb3IoJHRlcm0pKSAkc2FsaW50aVska109YXJyYXkoJ3QnPT4kdCwncCc9Pid0ZXJtaW5vIG7El3JhJyk7IGNvbnRpbnVlOyB9CiAgICAgIGlmKHByZWdfbWF0Y2goJ35eLz9wcm9kdWN0LyhbXi9dKykvPyR+JywkdCwkbSkpewogICAgICAgICRyb3c9JHdwZGItPmdldF9yb3coJHdwZGItPnByZXBhcmUoIlNFTEVDVCBJRCxwb3N0X3N0YXR1cyBGUk9NIHskd3BkYi0+cG9zdHN9IFdIRVJFIHBvc3RfbmFtZT0lcyBBTkQgcG9zdF90eXBlPSdwcm9kdWN0JyBMSU1JVCAxIiwkbVsxXSksQVJSQVlfQSk7CiAgICAgICAgaWYoISRyb3cpeyAkc2FsaW50aVska109YXJyYXkoJ3QnPT4kdCwncCc9PidwcmVrxJdzIG7El3JhJyk7IH0KICAgICAgICBlbHNlaWYoJHJvd1sncG9zdF9zdGF0dXMnXSE9PSdwdWJsaXNoJyl7ICRzYWxpbnRpWyRrXT1hcnJheSgndCc9PiR0LCdwJz0+JHJvd1sncG9zdF9zdGF0dXMnXS4nICMnLiRyb3dbJ0lEJ10pOyAkZHJhZnRbXT0kazsgfQogICAgICB9CiAgICB9CiAgICAkb1snc2FsaW50aV9uJ109Y291bnQoJHNhbGludGkpOyAkb1snc2FsaW50aSddPSRzYWxpbnRpOyAkb1snZHJhZnRfbiddPWNvdW50KCRkcmFmdCk7CiAgICAvLyBzdm9yaXMgxaFhbGluYW1pZW1zCiAgICAkc3Y9MDsgZm9yZWFjaChhcnJheV9rZXlzKCRzYWxpbnRpKSBhcyAkayl7ICRzdis9KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGNsaWNrcyBGUk9NIHskd3BkYi0+cHJlZml4fXBzX3Nlb191cmxfc3ZvcmlzIFdIRVJFIGtlbGlhcz0lcyIsJGspKTsgfSAkb1snc2FsaW5hbXVfZ3NjX2NsaWNrc18xNm0nXT0kc3Y7CiAgICAvLyBURU1QIHNuaXBwZXRhaQogICAgJG9bJ3RlbXBfbmVha3R5dnVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICAkb1sndGVtcF9ha3R5dnVzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgICBpZigkZj09PSdBUFBMWScpewogICAgICBpZihtZDVfZmlsZSgkcCkhPT0kb1snbWQ1X3ByaWVzJ10pIHRocm93IG5ldyBFeGNlcHRpb24oJ1NUT1AgbWQ1Jyk7CiAgICAgIGNvcHkoJHAsIFdQX0NPTlRFTlRfRElSLicvdXBsb2Fkcy9wcy1iYWNrdXBzL3BldHNob3AtbGVnYWN5LTMwMS1tYXAuanNvbi5iYWtfUzE1NTAnKTsKICAgICAgZm9yZWFjaChhcnJheV9rZXlzKCRzYWxpbnRpKSBhcyAkaykgdW5zZXQoJG1hcFska10pOwogICAgICAkbmV3PWpzb25fZW5jb2RlKCRtYXAsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTfEpTT05fUFJFVFRZX1BSSU5UKTsKICAgICAgaWYoIWlzX2FycmF5KGpzb25fZGVjb2RlKCRuZXcsdHJ1ZSkpfHxjb3VudChqc29uX2RlY29kZSgkbmV3LHRydWUpKSE9PSRvWyduX3ByaXMnXT0kb1snbl9wcmllcyddLWNvdW50KCRzYWxpbnRpKSkgdGhyb3cgbmV3IEV4Y2VwdGlvbignbmF1amFzIEpTT04gYmxvZ2FzJyk7CiAgICAgIGZpbGVfcHV0X2NvbnRlbnRzKCRwLCRuZXcpOyBpZihmdW5jdGlvbl9leGlzdHMoJ29wY2FjaGVfaW52YWxpZGF0ZScpKSBvcGNhY2hlX2ludmFsaWRhdGUoJHAsdHJ1ZSk7CiAgICAgICRvWyduX3BvJ109Y291bnQoanNvbl9kZWNvZGUoZmlsZV9nZXRfY29udGVudHMoJHApLHRydWUpKTsgJG9bJ21kNV9wbyddPW1kNV9maWxlKCRwKTsgJG9bJ0JfcG8nXT1maWxlc2l6ZSgkcCk7CiAgICAgIC8vIDQwNCBnYW1pbnRpIMWhaWVtcyBrZWxpYW1zIG5lYmVyZWlraWEgxb5lbcSXbGFwaW87IHBhdGlrcmEgdmllbmFtCiAgICAgICRrMD1hcnJheV9rZXlfZmlyc3QoJHNhbGludGkpOyBpZigkazApeyAkcj13cF9yZW1vdGVfaGVhZChob21lX3VybCgnLycuJGswKSxhcnJheSgndGltZW91dCc9PjEwLCdyZWRpcmVjdGlvbic9PjAsJ3NzbHZlcmlmeSc9PmZhbHNlLCd1c2VyLWFnZW50Jz0+J1BldHNob3BTRU8tUUEnKSk7ICRvWydwYXRpa3JhJ109YXJyYXkoJGswPT53cF9yZW1vdGVfcmV0cmlldmVfcmVzcG9uc2VfY29kZSgkcikpOyB9CiAgICAgIC8vIFRFTVAgc25pcHBldGFpOiB0cmludGkgbmVha3R5dml1cyAoUkVTVCBERUxFVEUgNTAwIOKAlCB0aWVzaWFpIERCKSwgYWt0eXZpdXMgcGFsaWt0aSAoxaFpcyBwYXRzIHJ1bmFzKQogICAgICAkaWRzPWFycmF5X21hcChmbigkcik9PihpbnQpJHJbJ2lkJ10sJG9bJ3RlbXBfbmVha3R5dnVzJ10pOwogICAgICBpZigkaWRzKXsgJG9bJ3RlbXBfaXN0cmludGEnXT0kd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGlkIElOICgiLmltcGxvZGUoJywnLCRpZHMpLiIpIEFORCBhY3RpdmU9MCBBTkQgbmFtZSBMSUtFICdURU1QJSciKTsgfQogICAgICAkb1sndGVtcF9saWtvJ109JHdwZGItPmdldF9jb2woIlNFTEVDVCBDT05DQVQoaWQsJyAnLG5hbWUsJyBhPScsYWN0aXZlKSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIE9SREVSIEJZIGlkIik7CiAgICAgICRvWydzbmlwcGV0c192aXNvJ109JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIik7CiAgICAgIHVuc2V0KCRvWydzYWxpbnRpJ10sJG9bJ3RlbXBfbmVha3R5dnVzJ10pOwogICAgfQogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1VORVNDQVBFRF9TTEFTSEVTKTsgZXhpdDsKfSk7Cg==';
const VER='dep-085732';
const GKEY='ps_seo';
const PHASES=["DRY", "APPLY"];
const OUT='analize/s1550.json';
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
