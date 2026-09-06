process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjEgcnVuIGUycCDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiB0aWVraW1vIHZhcmlrbGlvIHZlaWtzbWFzKCkgKG5hdWphX3NrdSksIGxhaXNrb19kYWxpcywgZHJvcHNoaXAgc2VuZCBzdV9wYXJ0aWphLCAjMzU4MDcgcHJpc3RhdHltbyBlaWx1dMSXLCA1Nzg3IGtsaWVudGFzLCBQZXRzaG9wX1NpdW50b3M6OnByaWRldGlfaXNfcGx1Z2lubyBwYXJhxaFhcy4gKi8KYWRkX2FjdGlvbignaW5pdCcsIGZ1bmN0aW9uKCl7CiAgaWYgKCFpc3NldCgkX0dFVFsncHNfZTJwJ10pKSByZXR1cm47CiAgJGY9c3RydG91cHBlcihzYW5pdGl6ZV9rZXkoJF9HRVRbJ3BzX2UycCddKSk7ICRvPWFycmF5KCd2Jz0+J1MxNjIxIGUycCcsJ2YnPT4kZik7IGdsb2JhbCAkd3BkYjsgJHA9JHdwZGItPnByZWZpeDsgc2V0X3RpbWVfbGltaXQoMjUwKTsKICAkb1sndGVtcF9pc3RyaW50YSddPShpbnQpJHdwZGItPnF1ZXJ5KCJERUxFVEUgRlJPTSB7JHB9c25pcHBldHMgV0hFUkUgbmFtZSBMSUtFICdURU1QJScgQU5EIGFjdGl2ZT0wIik7CiAgJEo9ZnVuY3Rpb24oJG8peyBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7IH07CiAgJGxpbmVzPWZ1bmN0aW9uKCRmaWxlLCRhLCRiKXsgJEw9ZXhwbG9kZSgiXG4iLChzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGZpbGUpKTsgJHI9YXJyYXkoKTsgZm9yKCRpPSRhLTE7JGk8bWluKCRiLGNvdW50KCRMKSk7JGkrKyl7ICRyW109KCRpKzEpLic6ICcubWJfc3Vic3RyKHJ0cmltKCRMWyRpXSksMCwyMjApOyB9IHJldHVybiAkcjsgfTsKICB0cnl7CiAgaWYoJGY9PT0nUCcpewogICAgJHRmPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtdGlla2ltYXMucGhwJzsgJG9bJ3RpZWtfdmVpa3NtYXMnXT0kbGluZXMoJHRmLDgwNiw4ODApOyAkb1sndGlla19sYWlza2FzJ109JGxpbmVzKCR0ZiwxMDk5LDExMzUpOyAkb1sndGlla19pZGV0aSddPSRsaW5lcygkdGYsMjkwLDMzMCk7CiAgICAkZGY9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnOyAkb1snZHNfeXJhJ109ZmlsZV9leGlzdHMoJGRmKTsgaWYoJG9bJ2RzX3lyYSddKXsgJEw9ZXhwbG9kZSgiXG4iLChzdHJpbmcpZmlsZV9nZXRfY29udGVudHMoJGRmKSk7ICRnPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJGs9PiRsKXsgaWYocHJlZ19tYXRjaCgnL3N1X3BhcnRpamF8cHNfZGxfa2FydHV8bGFpc2tvX2RhbGlzfHN1X2xpcGR1a2Fpc3xiZV9saXBkdWt1fGZ1bmN0aW9uIHNlbmR8ZnVuY3Rpb24gc2l1c3RpfGFkbWluX3Bvc3RfcHNfZHJvcHNoaXBfc2VuZHx1enNha3ltYWl8d3BfbWFpbFwofHN1YmplY3R8dGVtYS9pJywkbCkpeyAkZ1tdPSgkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDIwMCk7IH0gaWYoY291bnQoJGcpPjkwKSBicmVhazsgfSAkb1snZHNfZ3JlcCddPSRnOyB9CiAgICAkeD13Y19nZXRfb3JkZXIoMzU4MDcpOyBpZigkeCl7IGZvcmVhY2goJHgtPmdldF9zaGlwcGluZ19tZXRob2RzKCkgYXMgJHNpZD0+JHNoKXsgJG9bJ3NoMzU4MDcnXT1hcnJheSgnbWV0aG9kX2lkJz0+JHNoLT5nZXRfbWV0aG9kX2lkKCksJ2luc3QnPT4kc2gtPmdldF9pbnN0YW5jZV9pZCgpLCd0aXRsZSc9PiRzaC0+Z2V0X21ldGhvZF90aXRsZSgpLCd0b3RhbCc9PiRzaC0+Z2V0X3RvdGFsKCksJ3RheCc9PiRzaC0+Z2V0X3RvdGFsX3RheCgpLCdtZXRhJz0+JHNoLT5nZXRfbWV0YV9kYXRhKCk/YXJyYXlfbWFwKGZ1bmN0aW9uKCRtKXtyZXR1cm4gJG0tPmtleS4nPScubWJfc3Vic3RyKGlzX3NjYWxhcigkbS0+dmFsdWUpPyRtLT52YWx1ZTpqc29uX2VuY29kZSgkbS0+dmFsdWUpLDAsNjApO30sJHNoLT5nZXRfbWV0YV9kYXRhKCkpOm51bGwpOyB9ICRvWydwbTM1ODA3J109YXJyYXkoJHgtPmdldF9wYXltZW50X21ldGhvZCgpLCR4LT5nZXRfcGF5bWVudF9tZXRob2RfdGl0bGUoKSwkeC0+Z2V0X2NyZWF0ZWRfdmlhKCkpOyB9CiAgICAkdT1nZXRfdXNlcmRhdGEoNTc4Nyk7ICRvWydrbDU3ODcnXT0kdT9hcnJheSgkdS0+dXNlcl9lbWFpbCwkdS0+ZGlzcGxheV9uYW1lLGdldF91c2VyX21ldGEoNTc4NywnYmlsbGluZ19maXJzdF9uYW1lJyx0cnVlKSxnZXRfdXNlcl9tZXRhKDU3ODcsJ2JpbGxpbmdfbGFzdF9uYW1lJyx0cnVlKSxnZXRfdXNlcl9tZXRhKDU3ODcsJ2JpbGxpbmdfYWRkcmVzc18xJyx0cnVlKSxnZXRfdXNlcl9tZXRhKDU3ODcsJ2JpbGxpbmdfY2l0eScsdHJ1ZSksZ2V0X3VzZXJfbWV0YSg1Nzg3LCdiaWxsaW5nX3Bvc3Rjb2RlJyx0cnVlKSxnZXRfdXNlcl9tZXRhKDU3ODcsJ2JpbGxpbmdfcGhvbmUnLHRydWUpKTpudWxsOwogICAgZm9yZWFjaChhcnJheSgnUGV0c2hvcF9TaXVudG9zJz0+YXJyYXkoJ3ByaWRldGlfaXNfcGx1Z2lubycsJ3NhcmFzYXMnKSwnUGV0c2hvcF9BVl9UaWVraW1hcyc9PmFycmF5KCdpZGV0aV9laWx1dGUnLCdhdHZpcmFfcGFydGlqYScsJ2xhaXNrb19kYWxpcycsJ3V6ZGFyeXRpX3BvX2xhaXNrbycpLCdQZXRzaG9wX0FWX0Ryb3BzaGlwJz0+YXJyYXkoJ2xhdWtpYW50eXNfcGVyZGF2aW1vJykpIGFzICRjPT4kbXMpeyBmb3JlYWNoKCRtcyBhcyAkbSl7IHRyeXsgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCRjLCRtKTsgJG9bJ3NpZyddWyRjLic6OicuJG1dPWltcGxvZGUoJywnLGFycmF5X21hcChmdW5jdGlvbigkcHApe3JldHVybiAoJHBwLT5pc09wdGlvbmFsKCk/Jz8nOicnKS4nJCcuJHBwLT5nZXROYW1lKCk7fSwkcm0tPmdldFBhcmFtZXRlcnMoKSkpOyB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJG9bJ3NpZyddWyRjLic6OicuJG1dPSdOxJZSQSc7IH0gfSB9CiAgICAkb1snenVybmFsYXNfa2FibGlhaSddPWFycmF5X2tleXMoKGFycmF5KSgkR0xPQkFMU1snd3BfZmlsdGVyJ11bJ2FkbWluX3Bvc3RfcHNfdGlla2ltYXMnXS0+Y2FsbGJhY2tzPz9hcnJheSgpKSk7CiAgICAkb1sndGVtcF9saWtvJ109KGludCkkd3BkYi0+Z2V0X3ZhcigiU0VMRUNUIENPVU5UKCopIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIik7ICRKKCRvKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRvWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy5iYXNlbmFtZSgkZS0+Z2V0RmlsZSgpKS4nOicuJGUtPmdldExpbmUoKTsgfQogICRKKCRvKTsKfSw5OSk7Cg==';
const VER='dep-110719';
const GKEY='ps_e2p';
const PHASES=["P"];
const OUT='analize/s1621_e2p.json';
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
