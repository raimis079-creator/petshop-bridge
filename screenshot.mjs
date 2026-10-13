process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzgyZzIgR0E0IHB1cmNoYXNlIHBlciB0cmFuc2FjdGlvbl9pZCAoRGF0YSBBUEksIHRpayBza2FpdHltYXMpIMK3IDEgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzgyZzInXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzgyZzInXTsKICB0cnl7CiAgICAkYz1maWxlKCcvaG9tZS9neXZ1bmFpMi9kb21haW5zL3BldHNob3AubHQvcHVibGljX2h0bWwvd3AtY29udGVudC9tdS1wbHVnaW5zL3BldHNob3AtZ2E0LXNlcnZlcmlzLnBocCcpOyAkclsnaGRyJ109YXJyYXlfbWFwKCd0cmltJyxhcnJheV9zbGljZSgkYywyLDE4KSk7CiAgICBmb3JlYWNoKCRjIGFzICRpPT4kbCkgaWYocHJlZ19tYXRjaCgnL2NsaWVudF9pZHxjaWRfaXNfc2xhcHVrb3xfZ2E9fHNlc3Npb25faWR8Y29uc2VudHxub25fcGVyc29uYWxpemVkfHRpbWVzdGFtcF9taWNyb3MvJywkbCkpICRyWydjaWRfbGluZXMnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTYwKSk7CiAgICAkcz0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUIGlkLG5hbWUsY29kZSBGUk9NIHskUH1zbmlwcGV0cyBXSEVSRSBpZD02MTQiLEFSUkFZX0EpOyAkclsnczYxNCddPVsnbmFtZSc9PiRzWyduYW1lJ10/P251bGwsJ2xpbmVzJz0+W11dOyBpZigkcykgZm9yZWFjaChleHBsb2RlKCJcbiIsJHNbJ2NvZGUnXSkgYXMgJGk9PiRsKSBpZihwcmVnX21hdGNoKCcvcHVyY2hhc2V8dHJhbnNhY3Rpb25faWR8X3NlbnR8Y29uc2VudHxndGFnfGRhdGFMYXllci8nLCRsKSkgJHJbJ3M2MTQnXVsnbGluZXMnXVtdPSgkaSsxKS4nOiAnLnRyaW0obWJfc3Vic3RyKCRsLDAsMTUwKSk7CiAgICAkcmM9bmV3IFJlZmxlY3Rpb25DbGFzcygnUGV0c2hvcF9HQTRfU2VydmVyaXMnKTsgJHRtPSRyYy0+Z2V0TWV0aG9kKCd0b2tlbicpOyAkdG0tPnNldEFjY2Vzc2libGUodHJ1ZSk7ICR0b2s9JHRtLT5pbnZva2UobnVsbCk7IGlmKGlzX3dwX2Vycm9yKCR0b2spKSB0aHJvdyBuZXcgRXhjZXB0aW9uKCd0b2tlbjogJy4kdG9rLT5nZXRfZXJyb3JfbWVzc2FnZSgpKTsgaWYoaXNfYXJyYXkoJHRvaykpICR0b2s9JHRva1snYWNjZXNzX3Rva2VuJ10/P3Jlc2V0KCR0b2spOwogICAgJGJvZHk9WydkYXRlUmFuZ2VzJz0+W1snc3RhcnREYXRlJz0+JzE0ZGF5c0FnbycsJ2VuZERhdGUnPT4neWVzdGVyZGF5J11dLCdkaW1lbnNpb25zJz0+W1snbmFtZSc9Pid0cmFuc2FjdGlvbklkJ10sWyduYW1lJz0+J3Nlc3Npb25Tb3VyY2VNZWRpdW0nXV0sJ21ldHJpY3MnPT5bWyduYW1lJz0+J2V2ZW50Q291bnQnXSxbJ25hbWUnPT4ncHVyY2hhc2VSZXZlbnVlJ11dLCdkaW1lbnNpb25GaWx0ZXInPT5bJ2ZpbHRlcic9PlsnZmllbGROYW1lJz0+J2V2ZW50TmFtZScsJ3N0cmluZ0ZpbHRlcic9PlsndmFsdWUnPT4ncHVyY2hhc2UnXV1dLCdsaW1pdCc9PjEwMDBdOwogICAgJGg9d3BfcmVtb3RlX3Bvc3QoJ2h0dHBzOi8vYW5hbHl0aWNzZGF0YS5nb29nbGVhcGlzLmNvbS92MWJldGEvcHJvcGVydGllcy8zNDYwNTE1ODA6cnVuUmVwb3J0JyxbJ3RpbWVvdXQnPT40MCwnaGVhZGVycyc9PlsnQXV0aG9yaXphdGlvbic9PidCZWFyZXIgJy4kdG9rLCdDb250ZW50LVR5cGUnPT4nYXBwbGljYXRpb24vanNvbiddLCdib2R5Jz0+anNvbl9lbmNvZGUoJGJvZHkpXSk7CiAgICBpZihpc193cF9lcnJvcigkaCkpIHRocm93IG5ldyBFeGNlcHRpb24oJGgtPmdldF9lcnJvcl9tZXNzYWdlKCkpOyAkaj1qc29uX2RlY29kZSh3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCksdHJ1ZSk7IGlmKGVtcHR5KCRqWydyb3dzJ10pKXsgJHJbJ2FwaSddPW1iX3N1YnN0cih3cF9yZW1vdGVfcmV0cmlldmVfYm9keSgkaCksMCw0MDApOyB9CiAgICAkYWdnPVtdOyBmb3JlYWNoKCRqWydyb3dzJ10/P1tdIGFzICRyb3cpeyAkaz0oJHJvd1snZGltZW5zaW9uVmFsdWVzJ11bMF1bJ3ZhbHVlJ109PT0nKG5vdCBzZXQpJz8nTk9UU0VUJzonVElEJykuJyB8ICcuJHJvd1snZGltZW5zaW9uVmFsdWVzJ11bMV1bJ3ZhbHVlJ107ICRhZ2dbJGtdPVsoJGFnZ1ska11bMF0/PzApKyhpbnQpJHJvd1snbWV0cmljVmFsdWVzJ11bMF1bJ3ZhbHVlJ10scm91bmQoKCRhZ2dbJGtdWzFdPz8wKSsoZmxvYXQpJHJvd1snbWV0cmljVmFsdWVzJ11bMV1bJ3ZhbHVlJ10pXTsgfSBhcnNvcnQoJGFnZyk7ICRyWydhZ2cnXT1hcnJheV9zbGljZSgkYWdnLDAsMjAsdHJ1ZSk7ICRkaXN0PVtdOyAkZHVwPVtdOyAkbm90V29vPVtdOyAkdG90PTA7IGZvcmVhY2goJGpbJ3Jvd3MnXT8/W10gYXMgJHJvdyl7ICR0aWQ9JHJvd1snZGltZW5zaW9uVmFsdWVzJ11bMF1bJ3ZhbHVlJ107ICRuPShpbnQpJHJvd1snbWV0cmljVmFsdWVzJ11bMF1bJ3ZhbHVlJ107ICR0b3QrPSRuOyAkZGlzdFskbl09KCRkaXN0WyRuXT8/MCkrMTsgaWYoJG4+MSkgJGR1cFtdPSR0aWQuJ8OXJy4kbjsgaWYoIWN0eXBlX2RpZ2l0KCR0aWQpfHwhJHdwZGItPmdldF92YXIoJHdwZGItPnByZXBhcmUoIlNFTEVDVCBpZCBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgaWQ9JWQiLCR0aWQpKSkgJG5vdFdvb1tdPSR0aWQ7IH0KICAgICRyWydnYTQnXT1bJ3VuaXF1ZV90aWQnPT5jb3VudCgkalsncm93cyddPz9bXSksJ2V2ZW50cyc9PiR0b3QsJ2V2ZW50Q291bnRfZGlzdCc9PiRkaXN0LCdkdXBfdGlkcyc9PmFycmF5X3NsaWNlKCRkdXAsMCwxNSksJ3RpZF9ub3RfaW5fd29vJz0+YXJyYXlfc2xpY2UoJG5vdFdvbywwLDE1KSwnbm90X2luX3dvb19uJz0+Y291bnQoJG5vdFdvbyldOwogICAgJHJbJ3dvb19wYWlkXzE0ZCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13Y19vcmRlcnMgV0hFUkUgZGF0ZV9wYWlkX2dtdD49REFURV9TVUIoVVRDX0RBVEUoKSxJTlRFUlZBTCAxNCBEQVkpIEFORCBkYXRlX3BhaWRfZ210PFVUQ19EQVRFKCkgQU5EIHN0YXR1cyBJTiAoJ3djLXByb2Nlc3NpbmcnLCd3Yy1jb21wbGV0ZWQnKSIpOwogICAgJHJbJ21wXzE0ZCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX2dhNF9tcF9hdCcgQU5EIG1ldGFfdmFsdWU+PURBVEVfU1VCKFVUQ19EQVRFKCksSU5URVJWQUwgMTQgREFZKSIpOwogICAgJHJbJ2RsXzE0ZCddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskUH13Y19vcmRlcnNfbWV0YSBtIEpPSU4geyRQfXdjX29yZGVycyBvIE9OIG8uaWQ9bS5vcmRlcl9pZCBXSEVSRSBtLm1ldGFfa2V5PSdfcGV0c2hvcF9kbF9wdXJjaGFzZV9zZW50JyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210Pj1EQVRFX1NVQihVVENfREFURSgpLElOVEVSVkFMIDE0IERBWSkiKTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ2VyciddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSk7Cg==';
const VER='dep-160723';
const GKEY='ps_s1782g2';
const PHASES=["1"];
const OUT='analize/s1782_g2.json';
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
