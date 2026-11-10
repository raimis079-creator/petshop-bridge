process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODQzaSBMUCBwYXN0byBrb2RvIHN0YXRpc3Rpa2EgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxODQzaSddKSkgcmV0dXJuOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg0M2knXTsKICAkclsncGFnYWxfYnVkYSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGkub3JkZXJfaXRlbV9uYW1lIGIsIENPVU5UKCopIG4sIFNVTShDT0FMRVNDRShhLnBvc3Rjb2RlLCcnKT0nJykgYmVfcGssIFNVTShDT0FMRVNDRShhLmFkZHJlc3NfMSwnJyk9JycpIGJlX2FkciwgU1VNKENPQUxFU0NFKGEucG9zdGNvZGUsJycpIFJFR0VYUCAnXlswLTldezV9JCcpIHBrNSBGUk9NIHskUH13Y19vcmRlcnMgbyBKT0lOIHskUH13b29jb21tZXJjZV9vcmRlcl9pdGVtcyBpIE9OIGkub3JkZXJfaWQ9by5pZCBBTkQgaS5vcmRlcl9pdGVtX3R5cGU9J3NoaXBwaW5nJyBMRUZUIEpPSU4geyRQfXdjX29yZGVyX2FkZHJlc3NlcyBhIE9OIGEub3JkZXJfaWQ9by5pZCBBTkQgYS5hZGRyZXNzX3R5cGU9J2JpbGxpbmcnIFdIRVJFIG8udHlwZT0nc2hvcF9vcmRlcicgQU5EIG8uZGF0ZV9jcmVhdGVkX2dtdD49JzIwMjYtMDktMDEnIEFORCBvLnN0YXR1cyBJTignd2MtcHJvY2Vzc2luZycsJ3djLWNvbXBsZXRlZCcpIEdST1VQIEJZIDEiLEFSUkFZX0EpOwogICRyWydscF91enMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvLmlkLCBvLmRhdGVfY3JlYXRlZF9nbXQgZCwgKENPQUxFU0NFKGEucG9zdGNvZGUsJycpPD4nJykgcGssIChDT0FMRVNDRShhLmFkZHJlc3NfMSwnJyk8PicnKSBhZHIsIChDT0FMRVNDRShzLnBvc3Rjb2RlLCcnKTw+JycpIHNfcGsgRlJPTSB7JFB9d2Nfb3JkZXJzIG8gSk9JTiB7JFB9d29vY29tbWVyY2Vfb3JkZXJfaXRlbXMgaSBPTiBpLm9yZGVyX2lkPW8uaWQgQU5EIGkub3JkZXJfaXRlbV90eXBlPSdzaGlwcGluZycgQU5EIGkub3JkZXJfaXRlbV9uYW1lIExJS0UgJyVMUCUnIExFRlQgSk9JTiB7JFB9d2Nfb3JkZXJfYWRkcmVzc2VzIGEgT04gYS5vcmRlcl9pZD1vLmlkIEFORCBhLmFkZHJlc3NfdHlwZT0nYmlsbGluZycgTEVGVCBKT0lOIHskUH13Y19vcmRlcl9hZGRyZXNzZXMgcyBPTiBzLm9yZGVyX2lkPW8uaWQgQU5EIHMuYWRkcmVzc190eXBlPSdzaGlwcGluZycgV0hFUkUgby50eXBlPSdzaG9wX29yZGVyJyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj0nMjAyNi0xMC0wMScgT1JERVIgQlkgby5pZCIsQVJSQVlfQSk7CiAgLy8ga2Fzb3MgbGF1a3UgbnVzdGF0eW1haSAoYmUgc2VzaWpvcykKICAkZj1bJ2JpbGxpbmdfcG9zdGNvZGUnLCdiaWxsaW5nX2FkZHJlc3NfMScsJ2JpbGxpbmdfY2l0eSddOyAkbz1bXTsKICBpZihmdW5jdGlvbl9leGlzdHMoJ1dDJykpeyB0cnl7IGlmKCFXQygpLT5zZXNzaW9uKXsgV0MoKS0+aW5pdGlhbGl6ZV9zZXNzaW9uKCk7IH0gaWYoIVdDKCktPmNhcnQpeyB3Y19sb2FkX2NhcnQoKTsgfSAkY2Y9V0MoKS0+Y2hlY2tvdXQoKS0+Z2V0X2NoZWNrb3V0X2ZpZWxkcygnYmlsbGluZycpOyBmb3JlYWNoKCRmIGFzICRrKXsgJG9bJGtdPWlzc2V0KCRjZlska10pP1sncmVxdWlyZWQnPT4hZW1wdHkoJGNmWyRrXVsncmVxdWlyZWQnXSksJ2NsYXNzJz0+aW1wbG9kZSgnICcsKGFycmF5KSgkY2ZbJGtdWydjbGFzcyddPz9bXSkpLCdsYWJlbCc9PiRjZlska11bJ2xhYmVsJ10/PycnXTonTkVSQSc7IH0gfWNhdGNoKFxUaHJvd2FibGUgJGUpeyAkb1snZXJyJ109JGUtPmdldE1lc3NhZ2UoKTsgfSB9CiAgJHJbJ2xhdWthaSddPSRvOwogIC8vIG11LXBsdWdpbnMvc25pcHBldHMsIGt1cmllIHNsZXBpYSBhZHJlc28gbGF1a3VzCiAgJGhpdHM9W107IGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICR4KXsgZm9yZWFjaChmaWxlKCR4KSBhcyAkaT0+JGxuKXsgaWYocHJlZ19tYXRjaCgiL2JpbGxpbmdfcG9zdGNvZGV8J3Bvc3Rjb2RlJ3xhZGRyZXNzXzEuKnJlcXVpcmVkfHJlcXVpcmVkLiphZGRyZXNzXzEvIiwkbG4pKSAkaGl0c1tdPWJhc2VuYW1lKCR4KS4nOicuKCRpKzEpLic6ICcudHJpbShtYl9zdWJzdHIoJGxuLDAsMTcwKSk7IH0gfSAkclsnbXVfaGl0cyddPWFycmF5X3NsaWNlKCRoaXRzLDAsNDApOwogICRzbj0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxuYW1lLGFjdGl2ZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBjb2RlIExJS0UgJyViaWxsaW5nX3Bvc3Rjb2RlJScgT1IgY29kZSBMSUtFICclbHBleHByZXNzJScgT1IgY29kZSBMSUtFICclbGl0aHVhbmlhcG9zdCUnIixBUlJBWV9BKTsgJHJbJ3NuaXBwZXRzJ109JHNuOwogICRyWydscF9zZXR0aW5ncyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIG9wdGlvbl9uYW1lLCBMRUZUKG9wdGlvbl92YWx1ZSwxMjApIHYgRlJPTSB7JFB9b3B0aW9ucyBXSEVSRSBvcHRpb25fbmFtZSBMSUtFICd3b29fbGl0aHVhbmlhcG9zdCV2YWxpZGF0ZSUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJ2xwc2V0dGluZ3MldmFsaWRhdGUlJyBPUiBvcHRpb25fbmFtZSBMSUtFICclbGl0aHVhbmlhcG9zdCVzZXR0aW5ncyUnIExJTUlUIDEwIixBUlJBWV9BKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-080807';
const GKEY='ps_s1843i';
const PHASES=["1"];
const OUT='analize/s1843_i.json';
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
