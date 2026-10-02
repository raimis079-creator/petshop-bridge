process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ3bi1iIGxhdWtpYW1vcyBwcmVrZXMgZGV0YWxlcyByZWFkLW9ubHkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzQ3bmInXSkpIHJldHVybjsKICBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTc0N25iJ107ICR0PSRQLidwc19zdG9ja193YXRjaCc7CiAgdHJ5ewogICRyb3dzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLCBwcm9kdWN0X2lkLCBlbWFpbCwgdXNlcl9pZCwgc3RhdHVzLCBzb3VyY2UsIGNyZWF0ZWRfYXQsIG5vdGlmaWVkX2F0IEZST00gJHQgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogIGZvcmVhY2goJHJvd3MgYXMgJiR4KXsgJGU9JHhbJ2VtYWlsJ107ICR4WydlbWFpbCddPXN1YnN0cigkZSwwLDMpLifigKZAJy5zdWJzdHIoc3RycmNocigkZSwnQCcpLDEpOyAkeFsndGVzdCddPShzdHJpcG9zKCRlLCdneXZ1bmFpLmx0JykhPT1mYWxzZXx8c3RyaXBvcygkZSwnYXZlc2EnKSE9PWZhbHNlfHxzdHJpcG9zKCRlLCdwZXRzaG9wJykhPT1mYWxzZXx8c3RyaXBvcygkZSwncmFpbWlzJykhPT1mYWxzZSk/MTowOyAkcD13Y19nZXRfcHJvZHVjdCgoaW50KSR4Wydwcm9kdWN0X2lkJ10pOyAkeFsncHJla2UnXT0kcD9tYl9zdWJzdHIoaHRtbF9lbnRpdHlfZGVjb2RlKCRwLT5nZXRfbmFtZSgpKSwwLDUwKS4nIFsnLiRwLT5nZXRfc3RvY2tfc3RhdHVzKCkuJ10nOictJzsKICAgICR4WydwaXJrb19wbyddPTA7IGlmKCR4Wydub3RpZmllZF9hdCddKXsgJHhbJ3BpcmtvX3BvJ109KGludCkkd3BkYi0+Z2V0X3Zhcigkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXdjX29yZGVyX3Byb2R1Y3RfbG9va3VwIGwgSk9JTiB7JFB9d2Nfb3JkZXJfc3RhdHMgcyBPTiBzLm9yZGVyX2lkPWwub3JkZXJfaWQgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1sLm9yZGVyX2lkIFdIRVJFIGwucHJvZHVjdF9pZD0lZCBBTkQgby5iaWxsaW5nX2VtYWlsPSVzIEFORCBzLmRhdGVfY3JlYXRlZD49JXMgQU5EIHMuc3RhdHVzIElOKCd3Yy1jb21wbGV0ZWQnLCd3Yy1wcm9jZXNzaW5nJywnd2Mtb24taG9sZCcpIiwoaW50KSR4Wydwcm9kdWN0X2lkJ10sJGUsJHhbJ25vdGlmaWVkX2F0J10pKTsgfSB9CiAgdW5zZXQoJHgpOyAkclsnZWlsdXRlcyddPSRyb3dzOwogICRyWydwbHVnaW4nXT1jbGFzc19leGlzdHMoJ1BldHNob3BfQXRzYXJndV9MYXVraW1hcycpPydrbGFzZSB5cmEnOidrbGFzZXMgbmVyYSc7CiAgJHJbJ211X2ZhaWxhcyddPWlzX2ZpbGUoV1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdHNhcmd1LWxhdWtpbWFzLnBocCcpOwogICRyWydoaWRlX29vcyddPWdldF9vcHRpb24oJ3dvb2NvbW1lcmNlX2hpZGVfb3V0X29mX3N0b2NrX2l0ZW1zJyk7CiAgJHJbJ29vc19wdWJsaXNoJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRQfXBvc3RzIHAgSk9JTiB7JFB9cG9zdG1ldGEgbSBPTiBtLnBvc3RfaWQ9cC5JRCBBTkQgbS5tZXRhX2tleT0nX3N0b2NrX3N0YXR1cycgV0hFUkUgcC5wb3N0X3R5cGU9J3Byb2R1Y3QnIEFORCBwLnBvc3Rfc3RhdHVzPSdwdWJsaXNoJyBBTkQgbS5tZXRhX3ZhbHVlPSdvdXRvZnN0b2NrJyIpOwogICRyWydpbnN0b2NrX3B1Ymxpc2gnXT0oaW50KSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgQ09VTlQoKikgRlJPTSB7JFB9cG9zdHMgcCBKT0lOIHskUH1wb3N0bWV0YSBtIE9OIG0ucG9zdF9pZD1wLklEIEFORCBtLm1ldGFfa2V5PSdfc3RvY2tfc3RhdHVzJyBXSEVSRSBwLnBvc3RfdHlwZT0ncHJvZHVjdCcgQU5EIHAucG9zdF9zdGF0dXM9J3B1Ymxpc2gnIEFORCBtLm1ldGFfdmFsdWU9J2luc3RvY2snIik7CiAgJGVjPSR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSB7JFB9cHNfZW1haWxfam9icyIpOyAkclsnZW1haWxfY29scyddPSRlYzsKICAkclsnam9icyddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUICogRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBqb2Jfa2V5IExJS0UgJyVzdG9jayUnIE9SIGpvYl9rZXkgTElLRSAnYmFjayUnIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMTAiLEFSUkFZX0EpOwogIGlmKCR3cGRiLT5sYXN0X2Vycm9yKSAkclsnU1FMX0VSUiddW109JHdwZGItPmxhc3RfZXJyb3I7CiAgaWYoJHJbJ2pvYnMnXSkgZm9yZWFjaCgkclsnam9icyddIGFzICYkail7IGZvcmVhY2goJGogYXMgJGs9PiR2KXsgaWYoaXNfc3RyaW5nKCR2KSYmc3RybGVuKCR2KT44MCkgJGpbJGtdPXN1YnN0cigkdiwwLDgwKS4n4oCmJzsgfSBpZihpc3NldCgkalsncmVjaXBpZW50J10pKSAkalsncmVjaXBpZW50J109c3Vic3RyKCRqWydyZWNpcGllbnQnXSwwLDMpLifigKYnOyB9IHVuc2V0KCRqKTsKICB9Y2F0Y2goXFRocm93YWJsZSAkZSl7ICRyWydLTEFJREEnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIHdwX3NlbmRfanNvbigkcik7Cn0pOwo=';
const VER='dep-140334';
const GKEY='ps_s1747nb';
const PHASES=["1"];
const OUT='analize/s1747n_b.json';
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
