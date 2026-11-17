process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODc0dHMgdGVzdGluZSBwcmVudW1lcmF0YSArIGxhaXNrdSBudW90cmF1a29zICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoaXNzZXQoJF9HRVRbJ3BzX3MxODc0ZTknXSkpeyAkc2lkPShpbnQpZ2V0X29wdGlvbigncHNfcHJlbl90ZXN0YXNfc2lkJyk7ICRzPVBldHNob3BfUHJlbnVtZXJhdGE6OmdhdXRpKCRzaWQpOyBpZighJHMpeyBlY2hvICduZXJhJzsgZXhpdDsgfQogICAgJG09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfUHJlbnVtZXJhdGEnLCd0NV9wYXlsb2FkJyk7ICRtLT5zZXRBY2Nlc3NpYmxlKHRydWUpOyAkcD0kbS0+aW52b2tlKG51bGwsJHMpOwogICAgJGZsb3c9JF9HRVRbJ3BzX3MxODc0ZTknXT09PSd0OSc/J3N1YnNjcmlwdGlvbl9zdGFydGVkJzonc3Vic2NyaXB0aW9uX3Q1X25vdGljZSc7CiAgICBpZigkZmxvdz09PSdzdWJzY3JpcHRpb25fc3RhcnRlZCcpICRwWydkZWxpdmVyeV9kYXRlJ109UGV0c2hvcF9QcmVudW1lcmF0YTo6c2l1bnRvc19kYXRhKCRzWyduZXh0X2N5Y2xlX2RhdGUnXSk7CiAgICBlbHNlIHsgJHQ9UGV0c2hvcF9QcmVudW1lcmF0YTo6dGVybWluYWkoJHNbJ25leHRfY3ljbGVfZGF0ZSddKTsgfQogICAgJHg9UGV0c2hvcF9FbWFpbF9EaXNwYXRjaDo6cmVuZGVyKCRmbG93LCRwLFsncmVjaXBpZW50X2VtYWlsJz0+JHNbJ2VtYWlsJ10sJ2Zsb3dfY2xhc3MnPT4ndHJhbnNhY3Rpb25hbCddKTsKICAgIGhlYWRlcignQ29udGVudC1UeXBlOiB0ZXh0L2h0bWw7IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyAnPCEtLSB0ZW1hOiAnLmVzY19odG1sKCR4WydzdWJqZWN0J10pLicgLS0+Jy4keFsnaHRtbCddOyBleGl0OyB9CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTg3NHRzJ10pKSByZXR1cm47ICRyPVsndic9Pid0cycsJ3Nob3RzJz0+W11dOwogIHRyeXsKICAkdWlkPTQ0OyAkc2lkPShpbnQpZ2V0X29wdGlvbigncHNfcHJlbl90ZXN0YXNfc2lkJyk7ICRzPSRzaWQ/UGV0c2hvcF9QcmVudW1lcmF0YTo6Z2F1dGkoJHNpZCk6bnVsbDsKICBpZighJHMgfHwgJHNbJ3N0YXR1cyddIT09J2FjdGl2ZScpewogICAgJGl0ZW1zPVtdOyBmb3JlYWNoKFtbMTk0OTYsNl0sWzE2OTUwLDFdXSBhcyAkaXQpeyAkcHA9d2NfZ2V0X3Byb2R1Y3QoJGl0WzBdKTsgaWYoJHBwICYmICRwcC0+aXNfcHVyY2hhc2FibGUoKSkgJGl0ZW1zW109Wydwcm9kdWN0X2lkJz0+JGl0WzBdLCdxdHknPT4kaXRbMV1dOyB9CiAgICAkc2lkPVBldHNob3BfUHJlbnVtZXJhdGE6OnN1a3VydGkoWydlbWFpbCc9Pid0ZXJyYUBneXZ1bmFpLmx0JywndXNlcl9pZCc9PiR1aWQsJ2l0ZW1zJz0+JGl0ZW1zLCdpbnRlcnZhbF9kYXlzJz0+MzAsCiAgICAgICduZXh0X2N5Y2xlX2RhdGUnPT5nbWRhdGUoJ1ktbS1kJyx0aW1lKCkrNjAqREFZX0lOX1NFQ09ORFMpLCdwYXltZW50X21ldGhvZCc9PidtYW51YWwnLCdtb2RlJz0+J2NvbmZpcm1fcmVxdWlyZWQnLAogICAgICAnZGVsaXZlcnknPT5bJ2ZpcnN0X25hbWUnPT4nVGVzdGFzJywnbGFzdF9uYW1lJz0+J1ByZW51bWVyYXRhJywndGlwYXMnPT4na3VyamVyaXMnLCdhZHJlc2FzJz0+J1Rlc3RvIGcuIDEnLCdhZGRyZXNzXzEnPT4nVGVzdG8gZy4gMScsJ2NpdHknPT4nVmlsbml1cycsJ3Bvc3Rjb2RlJz0+JzAxMTAwJywncGhvbmUnPT4nKzM3MDY4MTg3Nzg3J11dKTsKICAgIGlmKGlzX3dwX2Vycm9yKCRzaWQpKXsgJHJbJ2tsYWlkYSddPSRzaWQtPmdldF9lcnJvcl9tZXNzYWdlKCk7IGdvdG8gb3V0OyB9CiAgICB1cGRhdGVfb3B0aW9uKCdwc19wcmVuX3Rlc3Rhc19zaWQnLChpbnQpJHNpZCxmYWxzZSk7IFBldHNob3BfUHJlbnVtZXJhdGE6Oml2eWtpcygkc2lkLCd0ZXN0YXMnLFsncGFzdGFiYSc9PidTMTg3NCB0ZXN0aW7ElyBwcmVudW1lcmF0YSBQYXlzZXJhIHBhdGlrcmFpOyBpxaF0cmludGkgaWtpIHNpdW50b3MgZGF0b3MnXSk7CiAgICAkclsnc3VrdXJ0YSddPShpbnQpJHNpZDsKICAgIFBldHNob3BfUHJlbnVtZXJhdGE6OnNpdXN0aV9wYXR2aXJ0aW5pbWEoJHNpZCk7ICRyWyd0OV9laWxlamUnXT0xOwogIH0KICAkclsnc2lkJ109JHNpZDsgJHJbJ3MnXT1QZXRzaG9wX1ByZW51bWVyYXRhOjpnYXV0aSgkc2lkKTsgJHJbJ3RlciddPVBldHNob3BfUHJlbnVtZXJhdGE6OnRlcm1pbmFpKCRyWydzJ11bJ25leHRfY3ljbGVfZGF0ZSddKTsKICAkZXhwPXRpbWUoKSszKkhPVVJfSU5fU0VDT05EUzsgJHRvaz1XUF9TZXNzaW9uX1Rva2Vuczo6Z2V0X2luc3RhbmNlKCR1aWQpLT5jcmVhdGUoJGV4cCk7CiAgJHJbJ2Nvb2tpZXMnXT1bWyduYW1lJz0+TE9HR0VEX0lOX0NPT0tJRSwndmFsdWUnPT53cF9nZW5lcmF0ZV9hdXRoX2Nvb2tpZSgkdWlkLCRleHAsJ2xvZ2dlZF9pbicsJHRvayksJ2RvbWFpbic9PidwZXRzaG9wLmx0J10sWyduYW1lJz0+J3BzX2pzJywndmFsdWUnPT4nMScsJ2RvbWFpbic9PidwZXRzaG9wLmx0J11dOwogICRyWydzaG90cyddW109WyduJz0+J3MxODc0X3BfcGFza3lyYScsJ3UnPT53Y19nZXRfYWNjb3VudF9lbmRwb2ludF91cmwoJ3ByZW51bWVyYXRvcycpLic/bmM9Jy50aW1lKCksJ3cnPT4zOTAsJ2gnPT4yNjAwLCdmdWxsJz0+MV07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfcF90OScsJ3UnPT5ob21lX3VybCgnLz9wc19zMTg3NGU5PXQ5JyksJ3cnPT42NDAsJ2gnPT4xNDAwLCdmdWxsJz0+MV07CiAgJHJbJ3Nob3RzJ11bXT1bJ24nPT4nczE4NzRfcF90MTAnLCd1Jz0+aG9tZV91cmwoJy8/cHNfczE4NzRlOT10MTAnKSwndyc9PjY0MCwnaCc9PjE0MDAsJ2Z1bGwnPT4xXTsKICAkclsnc2hvdHMnXVtdPVsnbic9PidzMTg3NF9wX3Q5X3RlbCcsJ3UnPT5ob21lX3VybCgnLz9wc19zMTg3NGU5PXQ5JyksJ3cnPT4zOTAsJ2gnPT4xNjAwLCdmdWxsJz0+MV07CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydrbGFpZGEnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuJGUtPmdldExpbmUoKTsgfQogIG91dDogaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFKTsgZXhpdDsKfSwxKTsK';
const VER='dep-131522';
const GKEY='ps_s1874ts';
const PHASES=["GO"];
const OUT='analize/s1874_ts.json';
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
      if(SH.cookies){ await ctx.addCookies(SH.cookies.map(c=>({name:c.name,value:c.value,domain:(c.domain||new URL(WP).hostname),path:'/',secure:true}))); }
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
