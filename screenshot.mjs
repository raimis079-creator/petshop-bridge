process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MTkgcnVuIHIyIOKAlCBSRUNPTiBDICh0aWsgc2thaXR5bWFzKTogdmFyaWtsaW8gUGV0c2hvcF9EZXNrIOKAlCAna2l0YScgdmXFvsSXamFzLCBhdXRvIHLFq8WhaWF2aW1hcyAoa2FibHlzLCBwcmlvcml0ZXRhcywgYXIgZ2VyYmlhIGBfcHNfa2VsaWFzYCksIHZlaWtzbWFpIGxhcGFpL2lzc2l1c3RhL2FwbW9rZXRhLCBTVEFUVVNBSSwga2xhdXNpbWFzKCk7IHNpdW50dS1sYWlza2FpIGthYmxpYWk7IHRlbWEgY29tcGxldGVkIGthYmx5czsgQVZfUmVkdWNlIG1hemludGkgc8SFbHlnb3MuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3IyJ10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MTkgcjInKTsgZ2xvYmFsICR3cGRiOyAkcD0kd3BkYi0+cHJlZml4OyBzZXRfdGltZV9saW1pdCgyODApOwogICRvWyd0ZW1wX2lzdHJpbnRhJ109KGludCkkd3BkYi0+cXVlcnkoIkRFTEVURSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyBBTkQgYWN0aXZlPTAiKTsKICAkSj1mdW5jdGlvbigkbyl7IGhlYWRlcignQ29udGVudC1UeXBlOiBhcHBsaWNhdGlvbi9qc29uJyk7IGVjaG8ganNvbl9lbmNvZGUoJG8sSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BBUlRJQUxfT1VUUFVUX09OX0VSUk9SKTsgZXhpdDsgfTsKICAkZ3JlcD1mdW5jdGlvbigkZiwkcmUsJGN0eD0wLCRsaW09NDAsJHc9MjAwKXsgJG91dD1hcnJheSgpOyBpZighZmlsZV9leGlzdHMoJGYpKSByZXR1cm4gYXJyYXkoJ07EllJBICcuJGYpOyAkTD1maWxlKCRmKTsgZm9yZWFjaCgkTCBhcyAkaT0+JGwpeyBpZihwcmVnX21hdGNoKCRyZSwkbCkpeyBmb3IoJGo9bWF4KDAsJGktJGN0eCk7JGo8PW1pbihjb3VudCgkTCktMSwkaSskY3R4KTskaisrKXsgJG91dFtdPSgkaisxKS4nOiAnLm1iX3N1YnN0cihydHJpbSgkTFskal0pLDAsJHcpOyB9IGlmKCRjdHgpICRvdXRbXT0nLS0nOyBpZihjb3VudCgkb3V0KT49JGxpbSooJGN0eCoyKzIpKSBicmVhazsgfSB9IHJldHVybiAkb3V0OyB9OwogICRtZXRoPWZ1bmN0aW9uKCRjbHMsJG0sJG1heD02MCl7IHRyeXsgJHI9bmV3IFJlZmxlY3Rpb25NZXRob2QoJGNscywkbSk7ICRMPWZpbGUoJHItPmdldEZpbGVOYW1lKCkpOyAkbj1taW4oJG1heCwkci0+Z2V0RW5kTGluZSgpLSRyLT5nZXRTdGFydExpbmUoKSsxKTsgcmV0dXJuIGFycmF5KCdudW8nPT4kci0+Z2V0U3RhcnRMaW5lKCksJ2lraSc9PiRyLT5nZXRFbmRMaW5lKCksJ2tvZGFzJz0+YXJyYXlfbWFwKGZ1bmN0aW9uKCR4KXtyZXR1cm4gbWJfc3Vic3RyKHJ0cmltKCR4KSwwLDIyMCk7fSxhcnJheV9zbGljZSgkTCwkci0+Z2V0U3RhcnRMaW5lKCktMSwkbikpKTsgfWNhdGNoKFRocm93YWJsZSAkZSl7IHJldHVybiAkZS0+Z2V0TWVzc2FnZSgpOyB9IH07CiAgdHJ5ewogICRtdT1XUE1VX1BMVUdJTl9ESVI7ICRkZXNrPSRtdS4nL3BldHNob3AtZGVzay5waHAnOwogICRvWydkZXNrX21ldG9kYWknXT1hcnJheV9tYXAoZnVuY3Rpb24oJG0pe3JldHVybiAkbS0+bmFtZTt9LChuZXcgUmVmbGVjdGlvbkNsYXNzKCdQZXRzaG9wX0Rlc2snKSktPmdldE1ldGhvZHMoKSk7CiAgJG9bJ1NUQVRVU0FJJ109UGV0c2hvcF9EZXNrOjpTVEFUVVNBSTsKICAkb1sna2l0YSddPSRncmVwKCRkZXNrLCcvXCdraXRhXCd8dmV6ZWphc1woL3UnLDEsMzApOwogICRvWydhdXRvX3J1cyddPSRncmVwKCRkZXNrLCcvU3VyxavFoWl1b3RhIHBhdGl8ZnVuY3Rpb24gYXV0b3xfcHNfcnVzaXVvdGF8YWRkX2FjdGlvblwoIFwnd29vY29tbWVyY2Vfb3JkZXJfc3RhdHVzX3Byb2Nlc3Npbmd8YWRkX2FjdGlvblwoIFwnd29vY29tbWVyY2VfcGF5bWVudF9jb21wbGV0ZS91JywxLDMwKTsKICAkb1sncHNfa2VsaWFzJ109JGdyZXAoJGRlc2ssJy9fcHNfa2VsaWFzL3UnLDAsMzApOwogICRvWyd2ZWlrc21haSddPSRncmVwKCRkZXNrLCcvY2FzZSBcJyhsYXBhaXxpc3NpdXN0YXxhcG1va2V0YXxsaXBkdWthc3xtaXNydXN8a29ucylcJy91JywwLDIwKTsKICAkb1sna2xhdXNpbWFzJ109JG1ldGgoJ1BldHNob3BfRGVzaycsJ2tsYXVzaW1hcycsNzApOwogICRvWyd2ZWlrc21hc19hcG1va2V0YSddPSRncmVwKCRkZXNrLCcvZnVuY3Rpb24gKGFwbW9rZXRhfHp5bWV0aV9hcG1va2V0YXxwYXp5bWV0aV9hcG1va2V0YXx2ZWlrc21hc19hcG1va2V0YSkvdScsMCw1KTsKICAkb1snaXNzaXVzdGFfc3JjJ109JGdyZXAoJGRlc2ssJy9mdW5jdGlvbiBpc3NpdXN0YXxmdW5jdGlvbiBwYXp5bWV0aV9pc3NpdXN0YXxmdW5jdGlvbiB1emJhaWd0aXxmdW5jdGlvbiBiYWlndGkvdScsMCw4KTsKICAkb1snbmVhcG1va2V0aV9kYXJiYXMnXT0kZ3JlcCgkZGVzaywnL2lzX3BhaWRcKFwpL3UnLDAsNDAsMTYwKTsKICAkb1snbGFpc2thaV9ob29rcyddPSRncmVwKCRtdS4nL3BldHNob3Atc2l1bnR1LWxhaXNrYWkucGhwJywnL2FkZF9hY3Rpb258YWRkX2ZpbHRlcnxmdW5jdGlvbiAvdScsMCw0MCwxNzApOwogICRvWydzaXVudG9zX2hvb2tzJ109JGdyZXAoJG11LicvcGV0c2hvcC1zaXVudG9zLnBocCcsJy9hZGRfYWN0aW9ufGFkZF9maWx0ZXJ8X3BzX2RhbHlzX2lzc2l1c3RhL3UnLDAsMzAsMTcwKTsKICAkb1snYXZfcmVkdWNlX21hemludGknXT0kbWV0aCgnUGV0c2hvcF9BVl9SZWR1Y2UnLCdtYXppbnRpJyw0MCk7CiAgJG9bJ3RlbWFfY29tcGxldGVkJ109JGdyZXAoZ2V0X3N0eWxlc2hlZXRfZGlyZWN0b3J5KCkuJy9mdW5jdGlvbnMucGhwJywnL3dvb2NvbW1lcmNlX29yZGVyX3N0YXR1c19jb21wbGV0ZWR8X3BldHNob3BfY29tcGxldGVkX3BkZnxjdXN0b21lcl9jb21wbGV0ZWRfb3JkZXJ8d29vY29tbWVyY2VfZW1haWxfYXR0YWNobWVudHN8cGV0c2hvcF9nZXRfaW52b2ljZV9kb2N1bWVudF90eXBlL3UnLDEsMjAsMjAwKTsKICAkb1snZGxfbWF0eXRhJ109JGdyZXAoJG11LicvcGV0c2hvcC1kYXJiYWxhdWtpcy5waHAnLCcvX3BzX21hdHl0YXxfcHNfZGFseXNfaXNzaXVzdGFcJywgL3UnLDAsMTIsMTgwKTsKICAkb1snbG9jYWxfcGlja3VwX2tsYXNlJ109Y2xhc3NfZXhpc3RzKCdXQ19TaGlwcGluZ19Mb2NhbF9QaWNrdXAnKTsgJHo9bmV3IFdDX1NoaXBwaW5nX1pvbmUoMSk7ICRvWyd6b25hMSddPSR6LT5nZXRfem9uZV9uYW1lKCk7CiAgJG9bJ3RlbXBfbGlrbyddPShpbnQpJHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NIHskcH1zbmlwcGV0cyBXSEVSRSBuYW1lIExJS0UgJ1RFTVAlJyIpOwogIH1jYXRjaChUaHJvd2FibGUgJGUpeyAkb1snRkFUQUwnXT0kZS0+Z2V0TWVzc2FnZSgpLicgQCcuYmFzZW5hbWUoJGUtPmdldEZpbGUoKSkuJzonLiRlLT5nZXRMaW5lKCk7IH0KICAkSigkbyk7Cn0sOTkpOwo=';
const VER='dep-215007';
const GKEY='ps_r2';
const PHASES=["R"];
const OUT='analize/s1619_r2.json';
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
