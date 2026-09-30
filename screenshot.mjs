process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQxaiBkYXJiYWxhdWtpcyBwZXJ6aXVyb3MgcHJldl9wYXJ0ICgxIGRpZWd0aStoYiAvIDIgdGVzdGFzIC8gOSBhdHN0YXR5dGkpICovCmFkZF9hY3Rpb24oJ3dwX2xvYWRlZCcsIGZ1bmN0aW9uKCl7CiAgaWYoIWlzc2V0KCRfR0VUWydwc19zMTc0MWonXSkpIHJldHVybjsgJGY9JF9HRVRbJ3BzX3MxNzQxaiddOyBAc2V0X3RpbWVfbGltaXQoMTUwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDFqJywnZmF6ZSc9PiRmXTsKICAkRlA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnOyAkQkFLPWRpcm5hbWUoQUJTUEFUSCkuJy9wcy1hcmNoeXZhcy9wZXRzaG9wLWRhcmJhbGF1a2lzLnBocC5iYWtfczE3NDEnOyAkTUQwPSdiZmQ0MThmZDVkMDc5Y2FkZTNiNjY2MDdiMmM2Mzc0NSc7CiAgJE9MRD1iYXNlNjRfZGVjb2RlKCdKSEJ5WlhaZmNHRnlkQ0E5SUNodlltcGxZM1FwSUdGeWNtRjVLQ0FuY0hKcGMzUmhkSGx0WVhNbklEMCtJQ1JpZFdRc0lDZGtaWHBsY3ljZ1BUNGdLR2x1ZENrZ2JXRjRLQ0F4TENBb2FXNTBLU0FvSUNSd1lYSjBMVDVrWlhwbGN5QS9QeUF4SUNrZ0tTQXBPdz09Jyk7ICRORVc9YmFzZTY0X2RlY29kZSgnSkhCeVpYWmZjR0Z5ZENBOUlDaHZZbXBsWTNRcElHRnljbUY1S0NBbmFXUW5JRDArSUNSd1lYSjBJRDhnS0dsdWRDa2dKSEJoY25RdFBtbGtJRG9nTUN3Z0ozUnBaV3RsYW1Gekp5QTlQaUFvYzNSeWFXNW5LU0FrYzNKakxDQW5jSEpwYzNSaGRIbHRZWE1uSUQwK0lDUmlkV1FzSUNka1pYcGxjeWNnUFQ0Z0tHbHVkQ2tnYldGNEtDQXhMQ0FvYVc1MEtTQW9JQ1J3WVhKMExUNWtaWHBsY3lBL1B5QXhJQ2tnS1NBcE95QXZMeUJUTVRjME1Ub2dhV1FnS3lCMGFXVnJaV3BoY3lEaWdKUWdjR1Z5eGI1cHhhdHliMnBsSUZSSlJVc3RlM0JoY25ScGFtRjlJR2x5SUhScFpXdkVsMnB2SUd0dlpHRnBJR3RoYVhBZ2RHbHJjbUZ0WlNCc1lXbkZvV3RsJyk7CiAgJGhiPWZ1bmN0aW9uKCl7ICRvPVtdOyBmb3JlYWNoKFsnaG9tZSc9PmhvbWVfdXJsKCcvP3BzX2hiPScudGltZSgpKSwna2FzYSc9PmhvbWVfdXJsKCcva2FzYS8/cHNfaGI9Jy50aW1lKCkpLCdhZG1pbic9PmFkbWluX3VybCgnYWRtaW4ucGhwP3BhZ2U9cHMtZGFyYmFsYXVraXMmcHNfaGI9Jy50aW1lKCkpLCdhamF4Jz0+YWRtaW5fdXJsKCdhZG1pbi1hamF4LnBocD9hY3Rpb249cHNfaGJfbmVyYSZ0PScudGltZSgpKV0gYXMgJGs9PiR1KXsgJHg9d3BfcmVtb3RlX2dldCgkdSxbJ3RpbWVvdXQnPT4yNSwnc3NsdmVyaWZ5Jz0+ZmFsc2UsJ3JlZGlyZWN0aW9uJz0+MCwndXNlci1hZ2VudCc9PidNb3ppbGxhLzUuMCBwcy1zMTc0MSddKTsgJG9bJGtdPWlzX3dwX2Vycm9yKCR4KT8nRVJSICcuJHgtPmdldF9lcnJvcl9tZXNzYWdlKCk6d3BfcmVtb3RlX3JldHJpZXZlX3Jlc3BvbnNlX2NvZGUoJHgpOyB9IHJldHVybiAkbzsgfTsKICB0cnl7CiAgaWYoJGY9PT0nMScpewogICAgJHNyYz1maWxlX2dldF9jb250ZW50cygkRlApOyAkclsnbWQ1X3ByaWVzJ109bWQ1KCRzcmMpOyAkclsnc3V0YXBpbXUnXT1zdWJzdHJfY291bnQoJHNyYywkT0xEKTsKICAgIGlmKG1kNSgkc3JjKSE9PSRNRDApeyAkclsnU1RPUCddPSdtZDUgbmUgdGFzJzsgfQogICAgZWxzZWlmKCRyWydzdXRhcGltdSddIT09MSl7ICRyWydTVE9QJ109J3Nlbm9zIGVpbHV0ZXMgc3V0YXBpbXUgbmUgMSc7IH0KICAgIGVsc2UgewogICAgICAkbmV3PXN0cl9yZXBsYWNlKCRPTEQsJE5FVywkc3JjKTsKICAgICAgdHJ5eyB0b2tlbl9nZXRfYWxsKCRuZXcsVE9LRU5fUEFSU0UpOyAkclsndG9rZW5haSddPSdvayc7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAkclsnU1RPUCddPSdzaW50YWtzZTogJy4kZS0+Z2V0TWVzc2FnZSgpOyB9CiAgICAgIGlmKGVtcHR5KCRyWydTVE9QJ10pKXsKICAgICAgICAkclsnYmFrJ109ZmlsZV9wdXRfY29udGVudHMoJEJBSywkc3JjKT9iYXNlbmFtZSgkQkFLKTonTkVQQVZZS08nOwogICAgICAgIGlmKCRyWydiYWsnXT09PSdORVBBVllLTycpeyAkclsnU1RPUCddPSdiYWsgbmVwYXZ5a28nOyB9CiAgICAgICAgZWxzZSB7ICRyWydpcmFzeXRhJ109ZmlsZV9wdXRfY29udGVudHMoJEZQLCRuZXcpOyAkclsnbWQ1X3BvJ109bWQ1X2ZpbGUoJEZQKTsKICAgICAgICAgICRoPSRoYigpOyAkclsnaGInXT0kaDsgJGJsb2dhaT1mYWxzZTsgZm9yZWFjaCgkaCBhcyAkaz0+JGNjKXsgaWYoIWlzX2ludCgkY2MpfHwkY2M+PTUwMCkgJGJsb2dhaT10cnVlOyB9CiAgICAgICAgICBpZigkYmxvZ2FpKXsgZmlsZV9wdXRfY29udGVudHMoJEZQLCRzcmMpOyAkclsnQVRTVEFUWVRBJ109J2hiIGJsb2dhcyDigJQgZ3LEhcW+aW50YSc7ICRyWydoYl9wbyddPSRoYigpOyB9IH0KICAgICAgfQogICAgfQogIH0KICBpZigkZj09PScyJyl7CiAgICAkclsnbWQ1J109bWQ1X2ZpbGUoJEZQKTsgJHJbJ25hdWphX2VpbHV0ZV95cmEnXT1zdWJzdHJfY291bnQoZmlsZV9nZXRfY29udGVudHMoJEZQKSwkTkVXKTsKICAgICRwYXJ0PSR3cGRiLT5nZXRfcm93KCJTRUxFQ1QgKiBGUk9NIHskUH1wc190aWVraW1hcyBXSEVSRSBpZD0zNCIpOwogICAgJHJtPW5ldyBSZWZsZWN0aW9uTWV0aG9kKCdQZXRzaG9wX0FWX1RpZWtpbWFzJywncGFydGlqb3NfZWlsdXRlcycpOyAkcm0tPnNldEFjY2Vzc2libGUodHJ1ZSk7ICRlaWw9JHJtLT5pbnZva2UobnVsbCwzNCk7CiAgICAkaXNwZWppbWFpPVtdOyBzZXRfZXJyb3JfaGFuZGxlcihmdW5jdGlvbigkbm8sJHN0ciwkZmlsZSwkbGluZSkgdXNlICgmJGlzcGVqaW1haSl7ICRpc3BlamltYWlbXT0kc3RyLicgQCcuYmFzZW5hbWUoJGZpbGUpLic6Jy4kbGluZTsgcmV0dXJuIHRydWU7IH0pOwogICAgJGJ1ZD0oc3RyaW5nKSRwYXJ0LT5wcmlzdGF0eW1hczsgJHNyYz0ndmYnOwogICAgJHNlbmFzPShvYmplY3QpIGFycmF5KCAncHJpc3RhdHltYXMnID0+ICRidWQsICdkZXplcycgPT4gMSApOwogICAgJG5hdWphcz0ob2JqZWN0KSBhcnJheSggJ2lkJyA9PiAoaW50KSAkcGFydC0+aWQsICd0aWVrZWphcycgPT4gKHN0cmluZykgJHNyYywgJ3ByaXN0YXR5bWFzJyA9PiAkYnVkLCAnZGV6ZXMnID0+IDEgKTsKICAgICRoX3NlbmFzPVBldHNob3BfQVZfVGlla2ltYXM6OmxhaXNrb19kYWxpcygkc2VuYXMsJGVpbCwnJyk7ICRpc3Bfc2VuYXM9JGlzcGVqaW1haTsgJGlzcGVqaW1haT1bXTsKICAgICRoX25hdWphcz1QZXRzaG9wX0FWX1RpZWtpbWFzOjpsYWlza29fZGFsaXMoJG5hdWphcywkZWlsLCcnKTsgJGlzcF9uYXVqYXM9JGlzcGVqaW1haTsgJGlzcGVqaW1haT1bXTsKICAgICRoX3Rpa3Jhcz1QZXRzaG9wX0FWX1RpZWtpbWFzOjpsYWlza29fZGFsaXMoJHBhcnQsJGVpbCwnJyk7ICRpc3BfdGlrcmFzPSRpc3BlamltYWk7CiAgICByZXN0b3JlX2Vycm9yX2hhbmRsZXIoKTsKICAgICR0eHQ9ZnVuY3Rpb24oJGgpeyByZXR1cm4gdHJpbShwcmVnX3JlcGxhY2UoJy9ccysvJywnICcsc3RyaXBfdGFncyhzdHJfcmVwbGFjZShbJzwvdGQ+JywnPC90cj4nLCc8L3A+J10sWycgfCAnLCJcbiIsIlxuIl0sJGgpKSkpOyB9OwogICAgJHJbJ3NlbmFzJ109Wydpc3BlamltYWknPT5jb3VudCgkaXNwX3NlbmFzKSwndGVrc3Rhcyc9Pm1iX3N1YnN0cigkdHh0KCRoX3NlbmFzKSwwLDkwMCldOwogICAgJHJbJ25hdWphcyddPVsnaXNwZWppbWFpJz0+JGlzcF9uYXVqYXMsJ3Rla3N0YXMnPT5tYl9zdWJzdHIoJHR4dCgkaF9uYXVqYXMpLDAsOTAwKV07CiAgICAkclsnbmF1amFzX2x5Z3VfdGlrcmFtJ109KCRoX25hdWphcz09PSRoX3Rpa3Jhcyk7ICRyWyd0aWtyYXNfaXNwZWppbWFpJ109Y291bnQoJGlzcF90aWtyYXMpOwogICAgJHJbJ2hiJ109JGhiKCk7CiAgfQogIGlmKCRmPT09JzknKXsgaWYoaXNfZmlsZSgkQkFLKSl7IGZpbGVfcHV0X2NvbnRlbnRzKCRGUCxmaWxlX2dldF9jb250ZW50cygkQkFLKSk7ICRyWydhdHN0YXR5dGEnXT1tZDVfZmlsZSgkRlApOyB9IGVsc2UgJHJbJ2F0c3RhdHl0YSddPSdiYWsgbmVyYSc7ICRyWydoYiddPSRoYigpOyB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fUEFSVElBTF9PVVRQVVRfT05fRVJST1IpOyBleGl0Owp9LCAxKTsK';
const VER='dep-071646';
const GKEY='ps_s1741j';
const PHASES=["1", "2"];
const OUT='analize/s1741_j.json';
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
