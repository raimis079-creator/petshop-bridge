process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLy8gVEVNUCBQUyBTMTU5MSBBOiBkdW1wCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbiAoKSB7CiAgICBpZiAoIWlzc2V0KCRfR0VUWydwc19leDYnXSkpIHJldHVybjsKICAgIGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgJG8gPSBbJ1ZFUlNJSkEnID0+ICdTMTU5MS1BJ107CiAgICAkaW5jID0gV1BfUExVR0lOX0RJUi4nL3BldHNob3AteG1sL2luY2x1ZGVzLyc7CiAgICAkYyA9IGZpbGVfZ2V0X2NvbnRlbnRzKCRpbmMuJ2NsYXNzLWltcG9ydC1ydWxlcy12Zi5waHAnKTsgJG9bJ3J1bGVzX2I2NCddPWJhc2U2NF9lbmNvZGUoJGMpOyAkb1sncnVsZXNfbWQ1J109bWQ1KCRjKTsgJG9bJ3J1bGVzX2xlbiddPXN0cmxlbigkYyk7CiAgICAkaCA9IGZpbGVfZ2V0X2NvbnRlbnRzKFdQX1BMVUdJTl9ESVIuJy9wZXRzaG9wLXhtbC9wZXRzaG9wLXhtbC5waHAnKTsgcHJlZ19tYXRjaCgnL1ZlcnNpb246XHMqKFtcZC5dKykvJywkaCwkbSk7ICRvWydwbHVnaW5fdmVyJ109JG1bMV0/P251bGw7CiAgICAkdiA9IGZpbGUoJGluYy4nY2xhc3MtdmYtaW1wb3J0LnBocCcpOwogICAgJHM9bnVsbDsgZm9yZWFjaCAoJHYgYXMgJGk9PiRsKSBpZiAoc3RycG9zKCRsLCdmdW5jdGlvbiBwZXRzaG9wX3htbF92Zl9jcmVhdGVfbmV3KCcpIT09ZmFsc2UpeyRzPSRpO2JyZWFrO30KICAgIGlmICgkcyE9PW51bGwpICRvWydjcmVhdGVfbmV3J109YXJyYXlfdmFsdWVzKGFycmF5X2ZpbHRlcihhcnJheV9tYXAoJ3J0cmltJyxhcnJheV9zbGljZSgkdiwkcys0NSwxNDApKSwgZm4oJHgpPT50cmltKCR4KSE9PScnICYmICFwcmVnX21hdGNoKCcvXlxzKihcL1wvfFwqfFwvXCopLycsJHgpKSk7CiAgICBmb3JlYWNoICgkdiBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvZHJhZnR8cHVibGlzaHxwb3N0X3N0YXR1cy8nLCRsKSkgJG9bJ3N0YXR1c19yZWZzJ11bXT0oJGkrMSkuJzonLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7CiAgICAkb1snY3Jvbl9rZXknXSA9IFBNWElfUGx1Z2luOjpnZXRJbnN0YW5jZSgpLT5nZXRPcHRpb24oJ2Nyb25fam9iX2tleScpOwogICAgJG9bJ3BteGk1J10gPSAkd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLCBwcm9jZXNzaW5nLCBleGVjdXRpbmcsIHRyaWdnZXJlZCwgcXVldWVfY2h1bmtfbnVtYmVyLCBpbXBvcnRlZCwgY3JlYXRlZCwgdXBkYXRlZCwgc2tpcHBlZCwgZGVsZXRlZCwgY291bnQsIGxhc3RfYWN0aXZpdHkgRlJPTSB7JHB9cG14aV9pbXBvcnRzIFdIRVJFIGlkPTUiLCBBUlJBWV9BKTsKICAgICRvcCA9IG1heWJlX3Vuc2VyaWFsaXplKCR3cGRiLT5nZXRfdmFyKCJTRUxFQ1Qgb3B0aW9ucyBGUk9NIHskcH1wbXhpX2ltcG9ydHMgV0hFUkUgaWQ9NSIpKTsgJG9bJ3BteGk1X29wdHMnXT1bJ3JlY29yZHNfcGVyX3JlcXVlc3QnPT4kb3BbJ3JlY29yZHNfcGVyX3JlcXVlc3QnXT8/bnVsbCwnaXNfZmFzdF9tb2RlJz0+JG9wWydpc19mYXN0X21vZGUnXT8/bnVsbCwnY2h1bmNraW5nJz0+JG9wWydjaHVuY2tpbmcnXT8/bnVsbCwnc3RhdHVzJz0+JG9wWydzdGF0dXMnXT8/bnVsbF07CiAgICAvLyBTb3VyY2VzIHYyLjIgc25pcHBldDogc2FuZGVsaXMgbG9naWthCiAgICAkc24gPSAkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIGNvZGUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgaWQ9MjUxNSIpOwogICAgaWYgKCRzbikgeyBmb3JlYWNoIChleHBsb2RlKCJcbiIsJHNuKSBhcyAkaT0+JGwpIGlmIChwcmVnX21hdGNoKCcvX3BzX3NhbmRlbGlzfHNhbmRlbC9pJywkbCkpICRvWydzb3VyY2VzX3NhbmRlbGlzJ11bXT0oJGkrMSkuJzonLnRyaW0obWJfc3Vic3RyKCRsLDAsMTYwKSk7IH0KICAgICRvWyd2Zl9jcm9uJ10gPSAkd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVwbXhpJScgT1Igb3B0aW9uX25hbWUgTElLRSAnJXdwX2FsbF9pbXBvcnQlJyIsIEFSUkFZX04pOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsKICAgIGVjaG8ganNvbl9lbmNvZGUoJG8sIEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUnxKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-081250';
const GKEY='ps_ex6';
const PHASES=["R"];
const OUT='analize/s1591_a.json';
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
