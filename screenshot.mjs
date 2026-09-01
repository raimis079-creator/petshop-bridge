process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgzYyByZWNvbiAocGV0c2hvcF9wb3B1bGFyX3Byb2R1Y3RzIHNhbHRpbmlzKSAqLwphZGRfYWN0aW9uKCdpbml0JywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3I4M2MnXSl8fCRfR0VUWydwc19yODNjJ10hPT0nR08nKSByZXR1cm47CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZ2xvYmFsICR3cGRiLCRzaG9ydGNvZGVfdGFnczsgJG89YXJyYXkoJ3YnPT4nUzE1ODNjJyk7CiAgJGNiPWlzc2V0KCRzaG9ydGNvZGVfdGFnc1sncGV0c2hvcF9wb3B1bGFyX3Byb2R1Y3RzJ10pPyRzaG9ydGNvZGVfdGFnc1sncGV0c2hvcF9wb3B1bGFyX3Byb2R1Y3RzJ106bnVsbDsKICBpZigkY2IpeyB0cnl7ICRyZj1pc19hcnJheSgkY2IpP25ldyBSZWZsZWN0aW9uTWV0aG9kKCRjYlswXSwkY2JbMV0pOm5ldyBSZWZsZWN0aW9uRnVuY3Rpb24oJGNiKTsgJG9bJ2NiJ109YXJyYXkoJ2ZpbGUnPT4kcmYtPmdldEZpbGVOYW1lKCksJ3N0YXJ0Jz0+JHJmLT5nZXRTdGFydExpbmUoKSwnZW5kJz0+JHJmLT5nZXRFbmRMaW5lKCksJ25hbWUnPT5pc19hcnJheSgkY2IpPyhpc19vYmplY3QoJGNiWzBdKT9nZXRfY2xhc3MoJGNiWzBdKTokY2JbMF0pLic6OicuJGNiWzFdOidjbG9zdXJlJyk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snY2JfZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfSB9CiAgJG9bJ3NuaXBzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsbmFtZSxhY3RpdmUsTEVOR1RIKGNvZGUpIGxlbiBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIGNvZGUgTElLRSAnJXBldHNob3BfcG9wdWxhcl9wcm9kdWN0cyUnIEFORCBuYW1lIE5PVCBMSUtFICdURU1QJSciLEFSUkFZX0EpOwogIGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRwKXsgaWYoc3RycG9zKGZpbGVfZ2V0X2NvbnRlbnRzKCRwKSwncGV0c2hvcF9wb3B1bGFyX3Byb2R1Y3RzJykhPT1mYWxzZSkgJG9bJ211J11bXT1iYXNlbmFtZSgkcCk7IH0KICBmb3JlYWNoKGdsb2IoV1BfUExVR0lOX0RJUi4nL3BldHNob3AtKi97KiwqLyp9LnBocCcsR0xPQl9CUkFDRSkgYXMgJHApeyBpZihzdHJwb3MoZmlsZV9nZXRfY29udGVudHMoJHApLCdwZXRzaG9wX3BvcHVsYXJfcHJvZHVjdHMnKSE9PWZhbHNlKSAkb1sncGwnXVtdPXN0cl9yZXBsYWNlKFdQX1BMVUdJTl9ESVIsJycsJHApOyB9CiAgZm9yZWFjaChnbG9iKGdldF9zdHlsZXNoZWV0X2RpcmVjdG9yeSgpLicvKi5waHAnKSBhcyAkcCl7IGlmKHN0cnBvcyhmaWxlX2dldF9jb250ZW50cygkcCksJ3BldHNob3BfcG9wdWxhcl9wcm9kdWN0cycpIT09ZmFsc2UpICRvWyd0aGVtZSddW109YmFzZW5hbWUoJHApOyB9CiAgaWYoIWVtcHR5KCRvWydzbmlwcyddKSl7ICRzcmM9JHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBjb2RlIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgaWQ9JWQiLCRvWydzbmlwcyddWzBdWydpZCddKSk7ICRvWydzcmMnXT0kc3JjOyB9CiAgZWxzZWlmKCFlbXB0eSgkb1snY2InXVsnZmlsZSddKSl7ICRvWydzcmMnXT1maWxlX2dldF9jb250ZW50cygkb1snY2InXVsnZmlsZSddKTsgJG9bJ3NyY19tZDUnXT1tZDUoJG9bJ3NyYyddKTsgfQogICR3cGRiLT5xdWVyeSgiVVBEQVRFIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFNFVCBhY3RpdmU9MCBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOyAkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskd3BkYi0+cHJlZml4fXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7CiAgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fVU5FU0NBUEVEX1NMQVNIRVMpOyBleGl0Owp9KTsK';
const VER='dep-170759';
const GKEY='ps_r83c';
const PHASES=["GO"];
const OUT='analize/s1583c.json';
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
