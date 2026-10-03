process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ5eCBhdGlkYXJ5dGkgcGFrYXJ0b2ppbW8gbGFpc2t1cyArIGdyYXppbnRpIDE0IGRpbmd1c2l1IHBvMTRkICgxIHBlcnppdXJhIC8gMiB2eWtkeXRpIC8gOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0OXgnXSkpIHJldHVybjsgZ2xvYmFsICR3cGRiOyAkVD0kd3BkYi0+cHJlZml4Lidwc19lbWFpbF9qb2JzJzsgJHBoPShzdHJpbmcpJF9HRVRbJ3BzX3MxNzQ5eCddOyAkcj1bJ3YnPT4nUzE3NDl4JywnZmF6ZSc9PiRwaCwndXRjJz0+Z21kYXRlKCdZLW0tZCBIOmk6cycpXTsKICAkSURTPVs2NDYsNjQ5LDY1Miw2NTUsNjU4LDY2MSw2NjQsNjY3LDY3MCw2ODgsNjk3LDcwMCw3MDMsNzUxXTsgJGluPWltcGxvZGUoJywnLCRJRFMpOyAkS0FEQT0nMjAyNi0xMC0wNCAwNzowMDowMCc7CiAgJG1hc2s9ZnVuY3Rpb24oJGUpeyByZXR1cm4gc3Vic3RyKCRlLDAsNikuJ+KApic7IH07CiAgJGphdXRydXM9WydnaW50YXJhc2QxOTcxQGdtYWlsLmNvbScsJ2p1cmdpdGEudGFtYXNhdXNraWVuZUB5YWhvby5jb20nXTsKICBpZigkcGg9PT0nMSd8fCRwaD09PScyJyl7CiAgICAkclsndmFydGFpX3ByaWVzJ109Z2V0X29wdGlvbigncHNfbGlmZWN5Y2xlX3ZhcnRhaScsJyhuZXJhPWF0aWRhcnl0YSknKTsKICAgICRyWydncmF6aW5hbWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpIHVzZSgkbWFzayl7ICR4WydlJ109JG1hc2soJHhbJ2UnXSk7IHJldHVybiAkeDsgfSwgJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIHN0YXR1cywgc2tpcF9yZWFzb24sIExFRlQoc2NoZWR1bGVkX2F0LDE2KSBzY2hlZCwgcmVjaXBpZW50X2VtYWlsIGUgRlJPTSAkVCBXSEVSRSBpZCBJTiAoJGluKSIsQVJSQVlfQSkpOwogICAgJHJbJ2F0aWRldGlfa2FzX2lzaXMnXT1hcnJheV9tYXAoZnVuY3Rpb24oJHgpIHVzZSgkbWFzayl7ICR4WydlJ109JG1hc2soJHhbJ2UnXSk7IHJldHVybiAkeDsgfSwgJHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIExFRlQobmV4dF9hdHRlbXB0X2F0LDE2KSBrYWRhX3V0YywgcmVjaXBpZW50X2VtYWlsIGUgRlJPTSAkVCBXSEVSRSBzdGF0dXM9J2RlZmVycmVkJyBPUkRFUiBCWSBuZXh0X2F0dGVtcHRfYXQiLEFSUkFZX0EpKTsKICAgICRyWydqYXV0cmllbXNfZWlsZWplJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIHN0YXR1cywgTEVGVChDT0FMRVNDRShuZXh0X2F0dGVtcHRfYXQsc2NoZWR1bGVkX2F0KSwxNikga2FkYSBGUk9NICRUIFdIRVJFIHJlY2lwaWVudF9lbWFpbCBJTiAoJyIuaW1wbG9kZSgiJywnIiwkamF1dHJ1cykuIicpIEFORCBzdGF0dXMgSU4gKCdwZW5kaW5nJywnZGVmZXJyZWQnKSBPUkRFUiBCWSBpZCIsQVJSQVlfQSk7CiAgfQogIGlmKCRwaD09PScyJyl7CiAgICAkYmFrPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHN0YXR1cyxza2lwX3JlYXNvbixibG9ja19yZWFzb24sc2NoZWR1bGVkX2F0LGRlY2lzaW9uX2F0LG5leHRfYXR0ZW1wdF9hdCBGUk9NICRUIFdIRVJFIGlkIElOICgkaW4pIixBUlJBWV9BKTsKICAgIGlmKCFnZXRfb3B0aW9uKCdwc19zMTc0OXhfYmFrJykpIHVwZGF0ZV9vcHRpb24oJ3BzX3MxNzQ5eF9iYWsnLGFycmF5KCd2YXJ0YWknPT5nZXRfb3B0aW9uKCdwc19saWZlY3ljbGVfdmFydGFpJyxudWxsKSwnZWlsdXRlcyc9PiRiYWspLGZhbHNlKTsKICAgICRuPSR3cGRiLT5xdWVyeSgkd3BkYi0+cHJlcGFyZSgiVVBEQVRFICRUIFNFVCBzdGF0dXM9J3BlbmRpbmcnLCBza2lwX3JlYXNvbj1OVUxMLCBibG9ja19yZWFzb249TlVMTCwgZGVjaXNpb25fYXQ9TlVMTCwgbmV4dF9hdHRlbXB0X2F0PU5VTEwsIHNjaGVkdWxlZF9hdD0lcywgdXBkYXRlZF9hdD1VVENfVElNRVNUQU1QKCkgV0hFUkUgaWQgSU4gKCRpbikgQU5EIHN0YXR1cz0nc2tpcHBlZCcgQU5EIHNraXBfcmVhc29uPSdkZWZlcnJhbF9leHBpcmVkJyIsJEtBREEpKTsKICAgICRyWydncmF6aW50YSddPSRuOwogICAgZGVsZXRlX29wdGlvbigncHNfbGlmZWN5Y2xlX3ZhcnRhaScpOwogICAgJHJbJ3ZhcnRhaV9wbyddPWdldF9vcHRpb24oJ3BzX2xpZmVjeWNsZV92YXJ0YWknLCcobmVyYT1hdGlkYXJ5dGEpJyk7CiAgICAkclsncG8nXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIExFRlQoc2NoZWR1bGVkX2F0LDE2KSBzY2hlZCwgQ09VTlQoKikgbiBGUk9NICRUIFdIRVJFIGlkIElOICgkaW4pIEdST1VQIEJZIHN0YXR1cywgc2NoZWQiLEFSUkFZX0EpOwogIH0KICBpZigkcGg9PT0nOScpewogICAgJGI9Z2V0X29wdGlvbigncHNfczE3NDl4X2JhaycpOyBpZihpc19hcnJheSgkYikpeyBmb3JlYWNoKCRiWydlaWx1dGVzJ10gYXMgJHgpeyAkaWQ9KGludCkkeFsnaWQnXTsgdW5zZXQoJHhbJ2lkJ10pOyAkd3BkYi0+dXBkYXRlKCRULCR4LGFycmF5KCdpZCc9PiRpZCkpOyB9IHVwZGF0ZV9vcHRpb24oJ3BzX2xpZmVjeWNsZV92YXJ0YWknLCd1emRhcnl0YScsZmFsc2UpOyAkclsnYXRzdGF0eXRhJ109Y291bnQoJGJbJ2VpbHV0ZXMnXSk7IH0KICAgICRyWyd2YXJ0YWknXT1nZXRfb3B0aW9uKCdwc19saWZlY3ljbGVfdmFydGFpJyk7CiAgfQogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-202648';
const GKEY='ps_s1749x';
const PHASES=["1"];
const OUT='s1749x.json';
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
