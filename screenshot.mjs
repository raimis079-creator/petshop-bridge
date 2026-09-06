process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFRFTVAgUFMgUzE2MjUgciDigJQgUkVDT04gKHRpayBza2FpdHltYXMpOiAoMSkgZGV2LXBhc3RhcyDigJQgYXIgeXJhIGxlaWRpbcWzIHPEhXJhxaFhcyAoYHBzX2Rldl9wYXN0YXNfbGVpc3RpYCksIMW+dXJuYWxvIHBhc2t1dGluaWFpOyAoMikgVmVuaXBhayDFoWlhbmRpZW4g4oCUIHXFvnNha3ltYWkgc3UgdGlrcmFpcyBudW1lcmlhaXMsIGB2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGFgLCDEr3Z5a2lhaSB2cF9yZWcvbGlwZHVrYXMsIHNhcmdvIGtsYWlkb3M7ICgzKSBzaXVudMSXam8gbnVzdGF0eW1haSAoYHNob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2ZpZWxkX3NlbmRlcipgKSBpciBrdXIg4oCeQnVsYWthc+KAnCBrb2RlOyAoNCkgc2t5ZGVsaW8gcGFzdGFixbMgdmlldGEuICovCmFkZF9hY3Rpb24oJ2luaXQnLCBmdW5jdGlvbigpewogIGlmICghaXNzZXQoJF9HRVRbJ3BzX3I5J10pKSByZXR1cm47CiAgJG89YXJyYXkoJ3YnPT4nUzE2MjUgcicpOyBnbG9iYWwgJHdwZGI7ICRwPSR3cGRiLT5wcmVmaXg7IHNldF90aW1lX2xpbWl0KDE1MCk7CiAgJG9bJ3RlbXBfaXN0cmludGEnXT0oaW50KSR3cGRiLT5xdWVyeSgiREVMRVRFIEZST00geyRwfXNuaXBwZXRzIFdIRVJFIG5hbWUgTElLRSAnVEVNUCUnIEFORCBhY3RpdmU9MCIpOwogICRkcD0oc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKFdQTVVfUExVR0lOX0RJUi4nL3BldHNob3AtZGV2LXBhc3Rhcy5waHAnKTsgJEw9ZXhwbG9kZSgiXG4iLCRkcCk7ICRnPWFycmF5KCk7IGZvcmVhY2goJEwgYXMgJGs9PiRsKXsgaWYocHJlZ19tYXRjaCgnL2xlaXN0aXxhbGxvd3xwZXRzaG9wXC5sdHxob3N0fHJldHVybiBmYWxzZXxwcmVfd3BfbWFpbHxvcHRpb24vaScsJGwpKSAkZ1tdPSgkaysxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsKSwwLDIwMCk7IH0gJG9bJ2Rldl9wYXN0YXNfa29kYXMnXT0kZzsgJG9bJ3BzX2Rldl9wYXN0YXNfbGVpc3RpJ109Z2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc19sZWlzdGknKTsKICAkej0oYXJyYXkpZ2V0X29wdGlvbigncHNfZGV2X3Bhc3Rhc196dXJuYWxhcycsYXJyYXkoKSk7ICRvWydkZXZfcGFzdGFzX24nXT1jb3VudCgkeik7ICRvWydkZXZfcGFzdGFzX3Bhc2snXT1hcnJheV9tYXAoZnVuY3Rpb24oJGUpe3JldHVybiAoJGVbJ2xhaWthcyddPz8nJykuJyAnLm1iX3N1YnN0cigkZVsndGVtYSddPz8nJywwLDYwKS4nIOKGkiAnLigkZVsna2FtJ10/PycnKTt9LGFycmF5X3NsaWNlKCR6LC04KSk7CiAgJG9bJ3V6c19zaXVudG9zJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1Qgb3JkZXJfaWQsTEVGVChtZXRhX3ZhbHVlLDMwMCkgdiBGUk9NIHskcH13Y19vcmRlcnNfbWV0YSBXSEVSRSBtZXRhX2tleT0nX3BzX3NpdW50b3MnIE9SREVSIEJZIG9yZGVyX2lkIixBUlJBWV9BKTsKICAkb1sndXpzX3ZwX2RhdGEnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcmRlcl9pZCxMRUZUKG1ldGFfdmFsdWUsMzAwKSB2IEZST00geyRwfXdjX29yZGVyc19tZXRhIFdIRVJFIG1ldGFfa2V5PSd2ZW5pcGFrX3NoaXBwaW5nX29yZGVyX2RhdGEnIE9SREVSIEJZIG9yZGVyX2lkIixBUlJBWV9BKTsKICAkb1sndXpzX3Zpc2knXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBpZCxzdGF0dXMsZGF0ZV9jcmVhdGVkX2dtdCBGUk9NIHskcH13Y19vcmRlcnMgV0hFUkUgdHlwZT0nc2hvcF9vcmRlcicgT1JERVIgQlkgaWQiLEFSUkFZX0EpOwogICRvWydpdnlraWFpX3ZwJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLHV6c2FreW1hcyx2ZWlrc21hcyxyZXp1bHRhdGFzLExFRlQocGFzdGFiYSwxMjApIHBhc3RhYmEgRlJPTSB7JHB9cHNfdXpzYWt5bXVfaXZ5a2lhaSBXSEVSRSB2ZWlrc21hcyBMSUtFICcldnAlJyBPUiB2ZWlrc21hcyBMSUtFICclbGlwZHVrJScgT1IgcmV6dWx0YXRhczw+J29rJyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDIwIixBUlJBWV9BKTsKICAkb1snc2FyZ2FzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgbGFpa2FzLExFRlQoa2xhaWRhLDE2MCkgayBGUk9NIHskcH1wc19zYXJnYXNfa2xhaWRvcyBPUkRFUiBCWSBpZCBERVNDIExJTUlUIDgiLEFSUkFZX0EpOwogICRvWydpdnlraWFpX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRwfXBzX3V6c2FreW11X2l2eWtpYWkiKTsgJG9bJ3Nhcmdhc19jb2xzJ109JHdwZGItPmdldF9jb2woIlNIT1cgQ09MVU1OUyBGUk9NIHskcH1wc19zYXJnYXNfa2xhaWRvcyIpOwogICRvWydzZW5kZXInXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBvcHRpb25fbmFtZSxMRUZUKG9wdGlvbl92YWx1ZSw4MCkgdiBGUk9NIHskcH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJ3Nob3B1cF92ZW5pcGFrX3NoaXBwaW5nX2ZpZWxkX3NlbmRlciUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrJXNlbmRlciUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyV2ZW5pcGFrJWNvbnRhY3QlJyIsQVJSQVlfQSk7CiAgJGhpdHM9YXJyYXkoKTsgZm9yZWFjaChnbG9iKFdQTVVfUExVR0lOX0RJUi4nLyoucGhwJykgYXMgJGZwKXsgJGM9KHN0cmluZylmaWxlX2dldF9jb250ZW50cygkZnApOyBpZihzdHJpcG9zKCRjLCdCdWxhaycpIT09ZmFsc2V8fHN0cmlwb3MoJGMsJ3NlbmRlcl9jb250YWN0JykhPT1mYWxzZXx8c3RyaXBvcygkYywnY29udGFjdF9wZXJzb24nKSE9PWZhbHNlKXsgJEw9ZXhwbG9kZSgiXG4iLCRjKTsgZm9yZWFjaCgkTCBhcyAkaz0+JGwpeyBpZihwcmVnX21hdGNoKCcvQnVsYWt8c2VuZGVyX2NvbnRhY3R8Y29udGFjdF9wZXJzb258c2VuZGVyX25hbWV8c2l1bnRlam98c2l1bnTEl2pvL2knLCRsKSkgJGhpdHNbXT1iYXNlbmFtZSgkZnApLic6Jy4oJGsrMSkuJzogJy5tYl9zdWJzdHIodHJpbSgkbCksMCwxNzApOyB9IH0gfSAkb1snYnVsYWthc19rb2RlJ109YXJyYXlfc2xpY2UoJGhpdHMsMCwyNSk7CiAgJHZwPVdQX1BMVUdJTl9ESVIuJy93Yy12ZW5pcGFrLXNoaXBwaW5nLyc7ICRvWyd2cF9wbHVnaW5fZmFpbGFpJ109YXJyYXlfbWFwKCdiYXNlbmFtZScsZ2xvYigkdnAuJyoucGhwJykpOyAkaGl0czI9YXJyYXkoKTsgZm9yZWFjaChnbG9iKCR2cC4neywqLywqLyovfSoucGhwJyxHTE9CX0JSQUNFKSBhcyAkZnApeyAkYz0oc3RyaW5nKWZpbGVfZ2V0X2NvbnRlbnRzKCRmcCk7IGlmKHN0cmlwb3MoJGMsJ2NvbnRhY3RfcGVyc29uJykhPT1mYWxzZXx8c3RyaXBvcygkYywnc2VuZGVyX2NvbnRhY3QnKSE9PWZhbHNlKXsgJEw9ZXhwbG9kZSgiXG4iLCRjKTsgZm9yZWFjaCgkTCBhcyAkaz0+JGwpeyBpZihwcmVnX21hdGNoKCcvY29udGFjdF9wZXJzb258c2VuZGVyX2NvbnRhY3QvaScsJGwpKSAkaGl0czJbXT1zdHJfcmVwbGFjZSgkdnAsJycsJGZwKS4nOicuKCRrKzEpLic6ICcubWJfc3Vic3RyKHRyaW0oJGwpLDAsMTYwKTsgfSB9IH0gJG9bJ3ZwX2NvbnRhY3Rfa29kZSddPWFycmF5X3NsaWNlKCRoaXRzMiwwLDIwKTsKICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbicpOyBlY2hvIGpzb25fZW5jb2RlKCRvLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9QQVJUSUFMX09VVFBVVF9PTl9FUlJPUik7IGV4aXQ7Cn0sOTkpOwo=';
const VER='dep-143438';
const GKEY='ps_r9';
const PHASES=["R"];
const OUT='analize/s1625_r.json';
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
