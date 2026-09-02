process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uICgpIHsKICAgIGlmICghaXNzZXQoJF9HRVRbJ3BzX2V4NTQnXSkpIHJldHVybjsKICAgIEBzZXRfdGltZV9saW1pdCgyODApOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7ICRvPVsnVkVSU0lKQSc9PidTMTU5OS1DMSddOwogICAgLy8gZXNhbWkgcmlua2luaWFpIHN1IHN1ZGV0aW1pCiAgICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgRElTVElOQ1QgdHIub2JqZWN0X2lkIEZST00geyRwfXRlcm1fcmVsYXRpb25zaGlwcyB0ciBKT0lOIHskcH10ZXJtX3RheG9ub215IHR0IE9OIHR0LnRlcm1fdGF4b25vbXlfaWQ9dHIudGVybV90YXhvbm9teV9pZCBKT0lOIHskcH1wb3N0cyBwbyBPTiBwby5JRD10ci5vYmplY3RfaWQgQU5EIHBvLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgcG8ucG9zdF90eXBlPSdwcm9kdWN0JyBXSEVSRSB0dC50YXhvbm9teT0ncHJvZHVjdF9jYXQnIEFORCB0dC50ZXJtX2lkIElOICg2NzksNjgyLDY4Myw2ODQpIik7CiAgICBmb3JlYWNoICgkaWRzIGFzICRpZCkgeyBpZiAoZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19sYXVrYXMnLHRydWUpPT09J3llcycpIGNvbnRpbnVlOyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgJGtvbXA9W107IGlmICgkcHIgJiYgbWV0aG9kX2V4aXN0cygkcHIsJ2dldF9jb250ZW50cycpKSB7IGZvcmVhY2ggKChhcnJheSkkcHItPmdldF9jb250ZW50cygpIGFzICRrPT4kYykgeyAkY2lkPWlzX2FycmF5KCRjKT8oJGNbJ3Byb2R1Y3RfaWQnXT8/JGspOiRrOyAka29tcFtdPW1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKChpbnQpJGNpZCksMCwzMCkuJ8OXJy4oaXNfYXJyYXkoJGMpPygkY1sncXVhbnRpdHknXT8/JGNbJ2RlZmF1bHRfcXVhbnRpdHknXT8/MSk6MSk7IH0gfSAkb1sncmlua2luaWFpJ11bXT1bJGlkLG1iX3N1YnN0cihnZXRfdGhlX3RpdGxlKCRpZCksMCw1MCksJHByPyRwci0+Z2V0X3ByaWNlKCk6JycsZ2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSksJGtvbXBdOyB9CiAgICAvLyBrYXRhbG9nYXM6IHNhbmRlbGlzIHgga2F0ZWdvcmlqYSAocHVibGlzaCwgaW5zdG9jayksIHZpZC4gYW50a2FpbmlzCiAgICAkcm93cz0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBwby5JRCBGUk9NIHskcH1wb3N0cyBwbyBXSEVSRSBwby5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCciLEFSUkFZX0EpOwogICAgJGFnZz1bXTsgJHRvcD1bXTsKICAgIGZvcmVhY2ggKCRyb3dzIGFzICRyKSB7ICRpZD0oaW50KSRyWydJRCddOyAkcHI9d2NfZ2V0X3Byb2R1Y3QoJGlkKTsgaWYoISRwcnx8ISRwci0+aXNfaW5fc3RvY2soKXx8JHByLT5nZXRfdHlwZSgpPT09J21peC1hbmQtbWF0Y2gnKSBjb250aW51ZTsgJHNhbmQ9Z2V0X3Bvc3RfbWV0YSgkaWQsJ19wc19zYW5kZWxpcycsdHJ1ZSk/Oic/JzsgJGNhdHM9d3BfZ2V0X3Bvc3RfdGVybXMoJGlkLCdwcm9kdWN0X2NhdCcsWydmaWVsZHMnPT4nc2x1Z3MnXSk7ICRrYXQ9Jyc7IGZvcmVhY2ggKCRjYXRzIGFzICRjKSBpZiAoIWluX2FycmF5KCRjLFsnc3VuaW1zJywna2F0ZW1zJywnZ3JhdXppa2FtcycsJ3BhdWtzY2lhbXMnLCd6dXZpbXMnLCdtYWlzdGFzLXN1bmltcycsJ21haXN0YXMta2F0ZW1zJywnZGF1Z2lhdS1waWdpYXUnLCdyaW5raW5pYWknXSkpIHsgJGthdD0kYzsgYnJlYWs7IH0KICAgICAgJGs9KGZsb2F0KSRwci0+Z2V0X3ByaWNlKCk7ICRjb3N0PShmbG9hdClnZXRfcG9zdF9tZXRhKCRpZCwnX2Nvc3RfcHJpY2UnLHRydWUpOyBmb3JlYWNoKFsnX3ZmX2Nvc3QnLCdfemJfY29zdCddIGFzICRtKXsgJHY9KGZsb2F0KWdldF9wb3N0X21ldGEoJGlkLCRtLHRydWUpOyBpZigkY29zdDw9MCYmJHY+MCkkY29zdD0kdjsgfSAkYW50PSgkY29zdD4wJiYkaz4wKT9yb3VuZCgoKCRrLzEuMjEpLSRjb3N0KS8kY29zdCoxMDApOm51bGw7CiAgICAgICRrZXk9IiRzYW5kfCRrYXQiOyAkYWdnWyRrZXldWyduJ109KCRhZ2dbJGtleV1bJ24nXT8/MCkrMTsgaWYoJGFudCE9PW51bGwpeyAkYWdnWyRrZXldWydhbnQnXVtdPSRhbnQ7IH0KICAgICAgaWYgKCRhbnQhPT1udWxsICYmICRhbnQ+PTU1ICYmICRrPj0yICYmICRrPD0yNSAmJiAkc2FuZCE9PSc/JykgJHRvcFtdPVskc2FuZCwka2F0LCRrLCRhbnQsKGludCkkcHItPmdldF9zdG9ja19xdWFudGl0eSgpLG1iX3N1YnN0cigkcHItPmdldF9uYW1lKCksMCw1NSldOwogICAgfQogICAgZm9yZWFjaCAoJGFnZyBhcyAkaz0+JHYpIHsgJGFnZ1ska109WyduJz0+JHZbJ24nXSwndmlkX2FudCc9Pmlzc2V0KCR2WydhbnQnXSk/cm91bmQoYXJyYXlfc3VtKCR2WydhbnQnXSkvY291bnQoJHZbJ2FudCddKSk6bnVsbF07IH0KICAgIHVhc29ydCgkYWdnLGZuKCRhLCRiKT0+JGJbJ24nXTw9PiRhWyduJ10pOyAkb1snYWdnJ109YXJyYXlfc2xpY2UoJGFnZywwLDYwLHRydWUpOwogICAgdXNvcnQoJHRvcCxmbigkYSwkYik9PiRiWzNdPD0+JGFbM10pOyAkb1sndG9wX21hcnphJ109YXJyYXlfc2xpY2UoJHRvcCwwLDEyMCk7CiAgICAkb1snYnJhbmRfdmZfc2F1c2FzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdC5uYW1lIGIsIENPVU5UKCopIG4gRlJPTSB7JHB9dGVybV9yZWxhdGlvbnNoaXBzIHRyIEpPSU4geyRwfXRlcm1fdGF4b25vbXkgdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIEFORCB0dC50YXhvbm9teT0ncHJvZHVjdF9icmFuZCcgSk9JTiB7JHB9dGVybXMgdCBPTiB0LnRlcm1faWQ9dHQudGVybV9pZCBKT0lOIHskcH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD10ci5vYmplY3RfaWQgQU5EIG0ubWV0YV9rZXk9J19wc19zYW5kZWxpcycgSk9JTiB7JHB9cG9zdHMgcG8gT04gcG8uSUQ9dHIub2JqZWN0X2lkIEFORCBwby5wb3N0X3N0YXR1cz0ncHVibGlzaCcgR1JPVVAgQlkgbS5tZXRhX3ZhbHVlLCB0Lm5hbWUgSEFWSU5HIG4+PTggT1JERVIgQlkgbS5tZXRhX3ZhbHVlLCBuIERFU0MiLEFSUkFZX04pOwogICAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkbyxKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEUpOyBleGl0Owp9KTsK';
const VER='dep-130426';
const GKEY='ps_ex54';
const PHASES=["R"];
const OUT='analize/s1599_c.json';
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
