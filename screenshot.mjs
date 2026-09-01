process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNTgyIHJlY29uIChkYXVnaWF1LXBpZ2lhdToga2F0ZWdvcmlqYSB2cyBwdXNsYXBpcykgKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19yODInXSl8fCRfR0VUWydwc19yODInXSE9PSdHTycpIHJldHVybjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBnbG9iYWwgJHdwZGI7ICRvPWFycmF5KCd2Jz0+J1MxNTgyJyk7CiAgJHQ9Z2V0X3Rlcm1fYnkoJ3NsdWcnLCdkYXVnaWF1LXBpZ2lhdScsJ3Byb2R1Y3RfY2F0Jyk7ICRvWydrYXRlZ29yaWphJ109JHQ/YXJyYXkoJ2lkJz0+JHQtPnRlcm1faWQsJ25hbWUnPT4kdC0+bmFtZSwnY291bnQnPT4kdC0+Y291bnQsJ3BhcmVudCc9PiR0LT5wYXJlbnQsJ2xpbmsnPT5nZXRfdGVybV9saW5rKCR0KSwnZGVzYyc9Pm1iX3N1YnN0cigkdC0+ZGVzY3JpcHRpb24sMCwxNTApKTonTkVSQSc7CiAgaWYoJHQpeyAkb1sna2F0X3ByZWtlc19wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKERJU1RJTkNUIHAuSUQpIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+dGVybV9yZWxhdGlvbnNoaXBzfSB0ciBPTiB0ci5vYmplY3RfaWQ9cC5JRCBKT0lOIHskd3BkYi0+dGVybV90YXhvbm9teX0gdHQgT04gdHQudGVybV90YXhvbm9teV9pZD10ci50ZXJtX3RheG9ub215X2lkIFdIRVJFIHR0LnRlcm1faWQ9JWQgQU5EIHAucG9zdF90eXBlPSdwcm9kdWN0JyBBTkQgcC5wb3N0X3N0YXR1cz0ncHVibGlzaCciLCR0LT50ZXJtX2lkKSk7IH0KICAkcD1nZXRfcG9zdCgzNDQ3Nik7ICRvWydwdXNsYXBpcyddPSRwP2FycmF5KCd0aXRsZSc9PiRwLT5wb3N0X3RpdGxlLCdzdGF0dXMnPT4kcC0+cG9zdF9zdGF0dXMsJ3R5cGUnPT4kcC0+cG9zdF90eXBlLCdkYXRlJz0+JHAtPnBvc3RfZGF0ZSwnbW9kaWZpZWQnPT4kcC0+cG9zdF9tb2RpZmllZCwnbGluayc9PmdldF9wZXJtYWxpbmsoJHApLCd0ZW1wbGF0ZSc9PmdldF9wYWdlX3RlbXBsYXRlX3NsdWcoJHApLCdsZW4nPT5zdHJsZW4oJHAtPnBvc3RfY29udGVudCksJ2V4Y2VycHQnPT5tYl9zdWJzdHIod3Bfc3RyaXBfYWxsX3RhZ3MoJHAtPnBvc3RfY29udGVudCksMCwzMDApLCdzaG9ydGNvZGVzJz0+YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZShwcmVnX21hdGNoX2FsbCgnL1xbKFthLXpfXSspLycsJHAtPnBvc3RfY29udGVudCwkbSk/JG1bMV06YXJyYXkoKSkpKTonTkVSQSc7CiAgJG9bJ3B1c2xhcGlzX21ldGEnXT1hcnJheV9pbnRlcnNlY3Rfa2V5KGdldF9wb3N0X21ldGEoMzQ0NzYpLGFycmF5X2ZsaXAoYXJyYXkoJ193cF9wYWdlX3RlbXBsYXRlJywncmFua19tYXRoX3RpdGxlJywncmFua19tYXRoX3JvYm90cycsJ19wc19yaW5raW55cycsJ19wZXRzaG9wX3JpbmtpbmlhaScpKSk7CiAgJG1hcD1qc29uX2RlY29kZShmaWxlX2dldF9jb250ZW50cyhXUE1VX1BMVUdJTl9ESVIuJy9wZXRzaG9wLWxlZ2FjeS0zMDEtbWFwLmpzb24nKSx0cnVlKTsKICBmb3JlYWNoKCRtYXAgYXMgJGs9PiR2KSBpZihzdHJwb3MoJGssJ2RhdWdpYXUtcGlnaWF1JykhPT1mYWxzZXx8c3RycG9zKCR2LCdkYXVnaWF1LXBpZ2lhdScpIT09ZmFsc2UpICRvWydtYXAnXVska109JHY7CiAgJG9bJ21lbml1X251b3JvZG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwbS5tZXRhX3ZhbHVlIHVybCBGUk9NIHskd3BkYi0+cG9zdHN9IHAgSk9JTiB7JHdwZGItPnBvc3RtZXRhfSBwbSBPTiBwbS5wb3N0X2lkPXAuSUQgQU5EIHBtLm1ldGFfa2V5PSdfbWVudV9pdGVtX3VybCcgV0hFUkUgcC5wb3N0X3R5cGU9J25hdl9tZW51X2l0ZW0nIEFORCBwbS5tZXRhX3ZhbHVlIExJS0UgJyVkYXVnaWF1LXBpZ2lhdSUnIixBUlJBWV9BKTsKICAkb1snbWVuaXVfb2JqJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgcC5JRCxwbTEubWV0YV92YWx1ZSBvYmoscG0yLm1ldGFfdmFsdWUgb2lkIEZST00geyR3cGRiLT5wb3N0c30gcCBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtMSBPTiBwbTEucG9zdF9pZD1wLklEIEFORCBwbTEubWV0YV9rZXk9J19tZW51X2l0ZW1fb2JqZWN0JyBKT0lOIHskd3BkYi0+cG9zdG1ldGF9IHBtMiBPTiBwbTIucG9zdF9pZD1wLklEIEFORCBwbTIubWV0YV9rZXk9J19tZW51X2l0ZW1fb2JqZWN0X2lkJyBXSEVSRSBwLnBvc3RfdHlwZT0nbmF2X21lbnVfaXRlbScgQU5EICgocG0xLm1ldGFfdmFsdWU9J3BhZ2UnIEFORCBwbTIubWV0YV92YWx1ZT0nMzQ0NzYnKSBPUiAocG0xLm1ldGFfdmFsdWU9J3Byb2R1Y3RfY2F0JyBBTkQgcG0yLm1ldGFfdmFsdWU9Ii4oJHQ/KGludCkkdC0+dGVybV9pZDowKS4iKSkiLEFSUkFZX0EpOwogICRvWydzdm9yaXMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCB1cmwsY2xpY2tzIEZST00geyR3cGRiLT5wcmVmaXh9cHNfc2VvX3VybF9zdm9yaXMgV0hFUkUgdXJsIExJS0UgJyVkYXVnaWF1LXBpZ2lhdSUnIE9SREVSIEJZIGNsaWNrcyBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogICRob21lPWhvbWVfdXJsKCk7IGZvcmVhY2goYXJyYXkoJ2RhdWdpYXUtcGlnaWF1Jywna2F0ZWdvcmlqYS9kYXVnaWF1LXBpZ2lhdS8nKSBhcyAkayl7ICRyPXdwX3JlbW90ZV9oZWFkKCRob21lLicvJy4kayxhcnJheSgncmVkaXJlY3QnPT4wLCd0aW1lb3V0Jz0+MjAsJ3NzbHZlcmlmeSc9PmZhbHNlKSk7ICRvWydob3AnXVska109YXJyYXkod3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHIpLHdwX3JlbW90ZV9yZXRyaWV2ZV9oZWFkZXIoJHIsJ2xvY2F0aW9uJykpOyB9CiAgJHdwZGItPnF1ZXJ5KCJVUERBVEUgeyR3cGRiLT5wcmVmaXh9c25pcHBldHMgU0VUIGFjdGl2ZT0wIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7ICR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyR3cGRiLT5wcmVmaXh9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJSciKTsKICBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7Cn0pOwo=';
const VER='dep-164408';
const GKEY='ps_r82';
const PHASES=["GO"];
const OUT='analize/s1582.json';
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
