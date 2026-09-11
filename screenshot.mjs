process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2NzUgcnVuIHAg4oCUIGRpbmfEmSBJRCAzNTg2OS03MCwgMzU4NzctNzksIDM1ODk1LTM1OTAwOiBwxJdkc2FrYWkuIFJFQUQtT05MWS4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfcDUnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyAkd3BkYi0+c3VwcHJlc3NfZXJyb3JzKHRydWUpOyAkbz1hcnJheSgndic9PidTMTY3NSBwJyk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRpZHM9JzM1ODY5LDM1ODcwLDM1ODc3LDM1ODc4LDM1ODc5LDM1ODk1LDM1ODk2LDM1ODk3LDM1ODk4LDM1ODk5LDM1OTAwJzsKICAkb1snaXZ5a2lhaSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHV6c2FreW1hcyxsYWlrYXMsc3JpdGlzLHZlaWtzbWFzLHJlenVsdGF0YXMsa2FzX3ZhcmRhcyxMRUZUKHBhc3RhYmEsNzApIHBhc3RhYmEgRlJPTSB7JHB9cHNfdXpzYWt5bXVfaXZ5a2lhaSBXSEVSRSB1enNha3ltYXMgSU4gKCRpZHMpIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAkb1snZmFrdCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JHB9cHNfZmFrdF91enNha3ltYWkgV0hFUkUgb3JkZXJfaWQgSU4gKCRpZHMpIE9SIHV6c2FreW1hcyBJTiAoJGlkcykgTElNSVQgNSIsQVJSQVlfQSk7CiAgJG9bJ2Zha3Rfc3R1bHAnXT1hcnJheV9zbGljZSgkd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX2Zha3RfdXpzYWt5bWFpIiwwKSwwLDgpOwogICRvWydjYXJ0cyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGNvbnZlcnRlZF9vcmRlcl9pZCxzdGF0dXMsdXBkYXRlZF9hdCBGUk9NIHskcH1wc19jYXJ0cyBXSEVSRSBjb252ZXJ0ZWRfb3JkZXJfaWQgSU4gKCRpZHMpIixBUlJBWV9BKTsKICAkb1snbWV0YV9saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3JkZXJfaWQsQ09VTlQoKikgYyBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBvcmRlcl9pZCBJTiAoJGlkcykgR1JPVVAgQlkgb3JkZXJfaWQiLEFSUkFZX0EpOwogICRvWydpdGVtc19saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3JkZXJfaWQsQ09VTlQoKikgYyBGUk9NIHskcH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBXSEVSRSBvcmRlcl9pZCBJTiAoJGlkcykgR1JPVVAgQlkgb3JkZXJfaWQiLEFSUkFZX0EpOwogICRvWydwb3N0c19saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgSUQscG9zdF90eXBlLHBvc3Rfc3RhdHVzLHBvc3RfZGF0ZSBGUk9NIHskcH1wb3N0cyBXSEVSRSBJRCBJTiAoJGlkcykiLEFSUkFZX0EpOwogICRvWydub3Rlc19saWtvJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgY29tbWVudF9wb3N0X0lEIGlkLGNvbW1lbnRfZGF0ZSBkLExFRlQoY29tbWVudF9jb250ZW50LDkwKSB0IEZST00geyRwfWNvbW1lbnRzIFdIRVJFIGNvbW1lbnRfcG9zdF9JRCBJTiAoJGlkcykgT1JERVIgQlkgY29tbWVudF9JRCIsQVJSQVlfQSk7CiAgJG9bJ3dlYl8wOTExX3J5dGFzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLHRpcGFzLExFRlQodXJsX2tlbGlhcyw0MCkgdSxMRUZUKHJlaWtzbWUsNDApIHIgRlJPTSB7JHB9cHNfd2ViX2l2eWtpYWkgV0hFUkUgbGFpa2FzIEJFVFdFRU4gJzIwMjYtMDktMTEgMDU6MDAnIEFORCAnMjAyNi0wOS0xMSAwOTozMCcgQU5EIHRpcGFzIElOICgnYmVnaW5fY2hlY2tvdXQnLCdwdXJjaGFzZScsJ2FkZF9wYXltZW50X2luZm8nLCdhZGRfc2hpcHBpbmdfaW5mbycpIE9SREVSIEJZIGxhaWthcyIsQVJSQVlfQSk7CiAgJG9bJ2FzX2RyYWZ0X2NsZWFudXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBob29rLHN0YXR1cyxsYXN0X2F0dGVtcHRfZ210IEZST00geyRwfWFjdGlvbnNjaGVkdWxlcl9hY3Rpb25zIFdIRVJFIGhvb2sgTElLRSAnJWRyYWZ0JScgT1IgaG9vayBMSUtFICclY2xlYW51cF9kcmFmdCUnIE9SREVSIEJZIGFjdGlvbl9pZCBERVNDIExJTUlUIDQiLEFSUkFZX0EpOwogICRvWydhc18wOTExJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaG9vayxDT1VOVCgqKSBjIEZST00geyRwfWFjdGlvbnNjaGVkdWxlcl9hY3Rpb25zIFdIRVJFIGxhc3RfYXR0ZW1wdF9nbXQgQkVUV0VFTiAnMjAyNi0wOS0xMSAwMzowMCcgQU5EICcyMDI2LTA5LTExIDA5OjMwJyBBTkQgc3RhdHVzPSdjb21wbGV0ZScgR1JPVVAgQlkgaG9vayIsQVJSQVlfQSk7CiAgJG9bJ2l2eWtpYWlfdmlzaV8wOTExJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgdXpzYWt5bWFzLGxhaWthcyxzcml0aXMsdmVpa3NtYXMsa2FzX3ZhcmRhcyBGUk9NIHskcH1wc191enNha3ltdV9pdnlraWFpIFdIRVJFIGxhaWthcyBCRVRXRUVOICcyMDI2LTA5LTExIDA1OjAwJyBBTkQgJzIwMjYtMDktMTEgMDk6MzAnIE9SREVSIEJZIGlkIixBUlJBWV9BKTsKICAkb1snZGInXT0kd3BkYi0+bGFzdF9lcnJvcjsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREUpOyBleGl0Owp9LDk5KTsK';
const VER='dep-224613';
const GKEY='ps_p5';
const PHASES=["GO"];
const OUT='analize/s1675_p.json';
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
  // EKRANO NUOTRAUKOS (browser=1): fazė grąžina shots:[{n,u,w}], cookies:[{name,value}]
  const SH=(()=>{ for(const f of PHASES){ if(out[f]&&out[f].shots) return out[f]; } return null; })();
  if(SH){ try{ const {chromium}=await import('playwright'); const br=await chromium.launch(); const ctx=await br.newContext({viewport:{width:1440,height:900},ignoreHTTPSErrors:true});
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:new URL(WP).hostname,path:'/',secure:true}))); }
      out.shots={};
      for(const s of SH.shots){ try{ const pg=await ctx.newPage(); const errs=[]; pg.on('pageerror',e=>errs.push('pageerror: '+String(e).slice(0,300))); pg.on('console',m=>{ if(m.type()==='error'||m.type()==='warning') errs.push(m.type()+': '+m.text().slice(0,300)); }); pg.on('response',r=>{ if(r.status()>=400) errs.push('http '+r.status()+' '+r.url().slice(0,120)); });
          if(s.w) await pg.setViewportSize({width:s.w,height:s.h||900}); await pg.goto(s.u,{waitUntil:'networkidle',timeout:60000}); await pg.waitForTimeout(800);
          const res={}; if(s.click){ try{ await pg.click(s.click,{timeout:5000}); await pg.waitForTimeout(600); res.clicked=s.click; }catch(e){ res.click_err=String(e).slice(0,200); } }
          if(s.eval){ try{ res.eval=await pg.evaluate(s.eval); }catch(e){ res.eval_err=String(e).slice(0,200); } }
          const buf=await pg.screenshot({fullPage:!!s.full}); const st=await put('screenshots/'+s.n+'.png',buf,VER+' '+s.n); out.shots[s.n]=Object.assign({status:st,url:pg.url(),title:await pg.title(),errors:errs.slice(0,12)},res); await pg.close(); }catch(e){ out.shots[s.n]=String(e).slice(0,200); } }
      await br.close(); }catch(e){ out.shots_klaida=String(e).slice(0,300); } }
}catch(e){ out.klaida=String(e).slice(0,500); }
try{ if(sid) await fetch(SNIP+'/'+sid,{method:'POST',headers:A,body:JSON.stringify({id:sid,active:false})}); }catch(e){}
await put(OUT, Buffer.from(JSON.stringify(out,null,1)), VER);
console.log('ok');
