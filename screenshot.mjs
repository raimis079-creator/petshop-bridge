process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzI0YiBkcm9wc2hpcF9zbGEgc2thaWNpYXZpbW8gcmVjb24gKHBldHNob3Atcnl0YXMgKyBrdXIgZGFyIGthbGVuZG9yaW5lcyBkaWVub3MpIHJlYWQtb25seSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3MjRiJ10pKSByZXR1cm47CiAgJGY9JF9HRVRbJ3BzX3MxNzI0YiddOyBAc2V0X3RpbWVfbGltaXQoMTIwKTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3MjRiJywnZmF6ZSc9PiRmXTsgJHR6PW5ldyBEYXRlVGltZVpvbmUoJ0V1cm9wZS9WaWxuaXVzJyk7CiAgdHJ5ewogIGlmKCRmPT09JzEnKXsKICAgICRwPVdQTVVfUExVR0lOX0RJUi4nL3BldHNob3Atcnl0YXMucGhwJzsgJHM9ZmlsZV9nZXRfY29udGVudHMoJHApOyAkclsnbWQ1J109bWQ1KCRzKTsgJHJbJ2VpbCddPXN1YnN0cl9jb3VudCgkcywiXG4iKTsKICAgIC8vIGlzdHJhdWt0aSBkcm9wc2hpcF9zbGEgYmxva2Egc3Uga29udGVrc3R1CiAgICAkbGluZXM9ZXhwbG9kZSgiXG4iLCRzKTsgJG91dD1bXTsKICAgIGZvcmVhY2goJGxpbmVzIGFzICRpPT4kbCl7IGlmKHN0cmlwb3MoJGwsJ2Ryb3BzaGlwX3NsYScpIT09ZmFsc2V8fHN0cmlwb3MoJGwsJ2Ryb3BzaGlwJykhPT1mYWxzZXx8cHJlZ19tYXRjaCgnLzI0XHMqXCp8SE9VUnxEQVl8dmFsYW5kfGRpZW4vaScsJGwpJiZzdHJpcG9zKCRsLCdzbGEnKSE9PWZhbHNlKXsgJG91dFtdPSRpKzE7IH0gfQogICAgJHJbJ2VpbHV0ZXNfc3VfZHJvcHNoaXAnXT0kb3V0OwogICAgLy8gcGlsbmFzIGJsb2thczogbnVvIHBpcm1vIGlraSBwYXNrdXRpbmlvICsyNSBlaWx1Y2l1CiAgICBpZigkb3V0KXsgJGE9bWF4KDAsbWluKCRvdXQpLTE1KTsgJGI9bWluKGNvdW50KCRsaW5lcyksbWF4KCRvdXQpKzMwKTsgJHJbJ2Jsb2thcyddPWltcGxvZGUoIlxuIixhcnJheV9tYXAoZnVuY3Rpb24oJGkpIHVzZSgkbGluZXMpeyByZXR1cm4gKCRpKzEpLic6ICcuJGxpbmVzWyRpXTsgfSxyYW5nZSgkYSwkYi0xKSkpOyB9CiAgICAvLyBmdW5rY2lqb3MsIGt1cmlvcyB0dXJpICdkYXJibycgKGRhcmJvIGRpZW5vcykg4oCTIGFyIHlyYSBoZWxwZXJpcwogICAgcHJlZ19tYXRjaF9hbGwoJy9mdW5jdGlvblxzKyhcdyooZGFyYm98d29ya3xidXNpbmVzc3xzYXZhaXRnfHdlZWtlbmQpXHcqKVxzKlwoL2knLCRzLCRtKTsgJHJbJ2RhcmJvX2RpZW51X2Zfcnl0YXMnXT0kbVsxXTsKICAgIC8vIGtpdHVvc2UgbXUtcGx1Z2ludW9zZSDigJMgZGFyYm8gZGllbnUgaGVscGVyaWFpCiAgICAkclsnZGFyYm9faGVscGVyaWFpJ109W107IGZvcmVhY2goZ2xvYihXUE1VX1BMVUdJTl9ESVIuJy8qLnBocCcpIGFzICRmeCl7ICRjPWZpbGVfZ2V0X2NvbnRlbnRzKCRmeCk7IGlmKHByZWdfbWF0Y2hfYWxsKCcvZnVuY3Rpb25ccysoXHcqKGRhcmJvX2RpZW58d29ya2RheXM/fGJ1c2luZXNzX2RheXM/fHNhdmFpdGdhbClcdyopXHMqXCgvaScsJGMsJG1tKSl7ICRyWydkYXJib19oZWxwZXJpYWknXVtiYXNlbmFtZSgkZngpXT0kbW1bMV07IH0gfQogICAgLy8gcHJpc3RhdHltbyBwYXphZGFzIOKAkyBrYWlwIHNrYWljaXVvamEgZGllbmFzICh0dXJpIHNhdmFpdGdhbGl1IGxvZ2lrYT8pCiAgICAkcHA9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1wcmlzdGF0eW1vLXBhemFkYXMucGhwJzsgaWYoaXNfZmlsZSgkcHApKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJHBwKTsgcHJlZ19tYXRjaF9hbGwoJy9eLiooc2F2YWl0Z3x3ZWVrZW5kfFxiTlxifGlzRGF5T2ZXZWVrfGZvcm1hdFwoXCdOXCdcKXxkYXRlXChcJ05cJ3wtPmZvcm1hdFwoIk4iXCkpLiokL21pJywkYywkbW0pOyAkclsncGF6YWRhc19zYXZhaXRnYWxpcyddPWFycmF5X3NsaWNlKGFycmF5X21hcCgndHJpbScsJG1tWzBdKSwwLDEyKTsgfQogICAgLy8gZGFyYmFsYXVraXMg4oCTIGFyIFNMQS92ZWxhdmltbyB6ZW5rbGFpCiAgICAkZGw9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnOyBpZihpc19maWxlKCRkbCkpeyAkYz1maWxlX2dldF9jb250ZW50cygkZGwpOyBwcmVnX21hdGNoX2FsbCgnL14uKih2ZWx1b2p8U0xBfD5ccyoyNHwyNFxzKlwqXHMqMzYwMHxEQVlfSU5fU0VDT05EUykuKiQvbWknLCRjLCRtbSk7ICRyWydkYXJiYWxhdWtpc192ZWxhdmltYXMnXT1hcnJheV9zbGljZShhcnJheV9tYXAoZnVuY3Rpb24oJHgpe3JldHVybiBtYl9zdWJzdHIodHJpbSgkeCksMCwyMDApO30sJG1tWzBdKSwwLDE1KTsgfQogICAgJGRlc2s9V1BNVV9QTFVHSU5fRElSLicvcGV0c2hvcC1kZXNrLnBocCc7IGlmKGlzX2ZpbGUoJGRlc2spKXsgJGM9ZmlsZV9nZXRfY29udGVudHMoJGRlc2spOyBwcmVnX21hdGNoX2FsbCgnL14uKih2ZWx1b2p8U0xBfD5ccyoyNHxEQVlfSU5fU0VDT05EUykuKiQvbWknLCRjLCRtbSk7ICRyWydkZXNrX3ZlbGF2aW1hcyddPWFycmF5X3NsaWNlKGFycmF5X21hcChmdW5jdGlvbigkeCl7cmV0dXJuIG1iX3N1YnN0cih0cmltKCR4KSwwLDIwMCk7fSwkbW1bMF0pLDAsMTUpOyB9CiAgICAvLyBzYXJnbyBwYXNrdXRpbmlzIHJlenVsdGF0YXMg4oCTIGRldGFsdXMgKGt1cmllIHV6c2FreW1haSkKICAgICRycD1nZXRfb3B0aW9uKCdwc19yeXRhc19zYXJnYXNfcGFzaycpOyAkclsncnl0YXNfcGFza19yYXcnXT1pc19hcnJheSgkcnApP2pzb25fZW5jb2RlKCRycCxKU09OX1VORVNDQVBFRF9VTklDT0RFKTokcnA7CiAgfQogIGlmKCRmPT09JzInKXsKICAgIC8vIGt1cmllIDMgdXpzYWt5bWFpOiBwcm9jZXNzaW5nLCBkcm9wc2hpcCBkYWxpcyBuZXBlcmR1b3RhL25laXNzaXVzdGEgPiAyNCB2YWwuCiAgICAkb3Jkcz13Y19nZXRfb3JkZXJzKFsnbGltaXQnPT42MCwndHlwZSc9PidzaG9wX29yZGVyJywnc3RhdHVzJz0+Wydwcm9jZXNzaW5nJ10sJ29yZGVyYnknPT4nZGF0ZScsJ29yZGVyJz0+J0FTQyddKTsKICAgIGZvcmVhY2goJG9yZHMgYXMgJG8peyAkZD0kby0+Z2V0X2RhdGVfY3JlYXRlZCgpOyAkcGFpZD0kby0+Z2V0X2RhdGVfcGFpZCgpOyAkbWV0YT1bXTsgZm9yZWFjaChbJ19wc19rZWxpYXMnLCdfcHNfZGFseXMnLCdfcHNfZGFseXNfaXNzaXVzdGEnLCdfcHNfdGlla2ltYXMnLCdfcHNfZHJvcHNoaXAnLCdfcHNfc291cmNlJywnX3BzX2RhbGlzX3ZmJywnX3BzX2RhbGlzX3piJ10gYXMgJGspeyAkdj0kby0+Z2V0X21ldGEoJGspOyBpZigkdiE9PScnICYmICR2IT09bnVsbCkgJG1ldGFbJGtdPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCwxMjApOm1iX3N1YnN0cihqc29uX2VuY29kZSgkdixKU09OX1VORVNDQVBFRF9VTklDT0RFKSwwLDMwMCk7IH0KICAgICAgJGtleXM9W107IGZvcmVhY2goJG8tPmdldF9tZXRhX2RhdGEoKSBhcyAkbWQpeyAkaz0kbWQtPmdldF9kYXRhKClbJ2tleSddOyBpZihzdHJwb3MoJGssJ19wc18nKT09PTApICRrZXlzW109JGs7IH0KICAgICAgJHJbJ3V6cyddW109Wyducic9PiRvLT5nZXRfb3JkZXJfbnVtYmVyKCksJ3N1a3VydGEnPT4kZD8kZC0+c2V0VGltZXpvbmUoJHR6KS0+Zm9ybWF0KCdtLWQgSDppIEQnKTonJywnYXBtb2tldGEnPT4kcGFpZD8kcGFpZC0+c2V0VGltZXpvbmUoJHR6KS0+Zm9ybWF0KCdtLWQgSDppIEQnKTonJywnbWV0YSc9PiRtZXRhLCdwc19rZXlzJz0+YXJyYXlfdmFsdWVzKGFycmF5X3VuaXF1ZSgka2V5cykpXTsgfQogICAgJHJbJ2xhaWthcyddPShuZXcgRGF0ZVRpbWUoJ25vdycsJHR6KSktPmZvcm1hdCgnWS1tLWQgSDppIEQnKTsKICB9CiAgfWNhdGNoKFRocm93YWJsZSAkZSl7ICRyWydGQVRBTCddPSRlLT5nZXRNZXNzYWdlKCkuJyBAJy4kZS0+Z2V0TGluZSgpOyB9CiAgaGVhZGVyKCdDb250ZW50LVR5cGU6IGFwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnKTsgZWNobyBqc29uX2VuY29kZSgkcixKU09OX1VORVNDQVBFRF9VTklDT0RFfEpTT05fSU5WQUxJRF9VVEY4X1NVQlNUSVRVVEV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sIDEpOwo=';
const VER='dep-081254';
const GKEY='ps_s1724b';
const PHASES=["1", "2"];
const OUT='analize/s1724_b.json';
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
