process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxODcxYSBWRiBuZXBlcmR1b3RpIGtsYXVzaW1haSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE4NzFhJ10pKSByZXR1cm47IEBzZXRfdGltZV9saW1pdCgxMjApOyBnbG9iYWwgJHdwZGI7ICRQPSR3cGRiLT5wcmVmaXg7ICRyPVsndic9PidTMTg3MWEnXTsKICAkaWRzPSR3cGRiLT5nZXRfY29sKCJTRUxFQ1QgaWQgRlJPTSB7JFB9d2Nfb3JkZXJzIFdIRVJFIHR5cGU9J3Nob3Bfb3JkZXInIEFORCBzdGF0dXMgSU4oJ3djLXByb2Nlc3NpbmcnLCd3Yy1vbi1ob2xkJykgT1JERVIgQlkgaWQiKTsKICBmb3JlYWNoKCRpZHMgYXMgJGlkKXsgJG89d2NfZ2V0X29yZGVyKCRpZCk7IGlmKCEkbykgY29udGludWU7ICRrbD0nJzsgaWYoY2xhc3NfZXhpc3RzKCdQZXRzaG9wX0Rlc2snKSl7IHRyeXsgJG09bmV3IFJlZmxlY3Rpb25NZXRob2QoJ1BldHNob3BfRGVzaycsJ2tsYXVzaW1hcycpOyAkbS0+c2V0QWNjZXNzaWJsZSh0cnVlKTsgJGtsPSRtLT5pbnZva2UobnVsbCwkbyk7IH1jYXRjaChUaHJvd2FibGUgJGUpeyAka2w9J0VSUiAnLiRlLT5nZXRNZXNzYWdlKCk7IH0gfQogICAgaWYoISRrbCkgY29udGludWU7CiAgICAkbm49W107IGZvcmVhY2god2NfZ2V0X29yZGVyX25vdGVzKFsnb3JkZXJfaWQnPT4kaWQsJ2xpbWl0Jz0+MTJdKSBhcyAkbil7ICRubltdPSRuLT5kYXRlX2NyZWF0ZWQtPmRhdGUoJ20tZCBIOmknKS4nICcubWJfc3Vic3RyKHdwX3N0cmlwX2FsbF90YWdzKCRuLT5jb250ZW50KSwwLDE3MCkuJyAoJy4kbi0+YWRkZWRfYnkuJyknOyB9CiAgICAkaXQ9W107IGZvcmVhY2goJG8tPmdldF9pdGVtcygpIGFzICR4KXsgJGl0W109bWJfc3Vic3RyKCR4LT5nZXRfbmFtZSgpLDAsNDUpLicgeCcuJHgtPmdldF9xdWFudGl0eSgpLicgc3JjPScuJHgtPmdldF9tZXRhKCdfcHNfc291cmNlJykuJyBrZWxpYXM9Jy4keC0+Z2V0X21ldGEoJ19wc19rZWxpYXMnKTsgfQogICAgJHJbJ2tsJ11bJG8tPmdldF9vcmRlcl9udW1iZXIoKV09WydpZCc9PiRpZCwnc3QnPT4kby0+Z2V0X3N0YXR1cygpLCdrbGF1c2ltYXMnPT4ka2wsJ3NsYSc9PiRvLT5nZXRfbWV0YSgnX3BzX3NsYV92ZWxhdmltYXMnKSwnc2VudCc9PiRvLT5nZXRfbWV0YSgnX3BzX2Ryb3BzaGlwX3NlbnQnKSwnc2VudF9zcmMnPT4kby0+Z2V0X21ldGEoJ19wc19kcm9wc2hpcF9zZW50X3NyYycpLCdzZW50X3RvJz0+JG8tPmdldF9tZXRhKCdfcHNfZHJvcHNoaXBfdG8nKSwnbGF1a3RpJz0+JG8tPmdldF9tZXRhKCdfcHNfa2xhdXNfbGF1a3RpJyksJ3NpdW50b3MnPT5tYl9zdWJzdHIoKHN0cmluZylqc29uX2VuY29kZSgkby0+Z2V0X21ldGEoJ19wc19zaXVudG9zJyksSlNPTl9VTkVTQ0FQRURfVU5JQ09ERSksMCwzMDApLCdpdGVtcyc9PiRpdCwnbm90ZXMnPT4kbm5dOyB9CiAgJGE9Z2V0X29wdGlvbigncHNfbGFpc2t1X2FyY2h5dmFzJyk7ICRyWydhcmNoeXZhcyddPVtdOyBpZihpc19hcnJheSgkYSkpeyBmb3JlYWNoKCRhIGFzICR4KXsgaWYoKCR4WydsYWlrYXMnXT8/JycpPj0nMjAyNi0xMS0xMicpICRyWydhcmNoeXZhcyddW109WydsYWlrYXMnPT4keFsnbGFpa2FzJ10/PycnLCdrYW0nPT4keFsna2FtJ10/PycnLCd0ZW1hJz0+JHhbJ3RlbWEnXT8/JycsJ2tvbnQnPT4keFsna29udCddPz8nJywncHJpZWRhaSc9PiR4WydwcmllZGFpJ10/P1tdXTsgfSB9CiAgJHJbJ2FyY2h5dmFzX24nXT1pc19hcnJheSgkYSk/Y291bnQoJGEpOm51bGw7CiAgJHJbJ3RpZWtfcGFzdGFpJ109Z2V0X29wdGlvbigncHNfdGlla2VqdV9wYXN0YWknKTsKICBmb3JlYWNoKFsnd3BtYWlsc210cF9lbWFpbHNfbG9nJywnd3BtbF9tYWlscycsJ3dwX21haWxfbG9nZ2luZyddIGFzICR0KXsgaWYoJHdwZGItPmdldF92YXIoIlNIT1cgVEFCTEVTIExJS0UgJ3skUH17JHR9JyIpKSAkclsnbWFpbF90YmwnXVskdF09JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH17JHR9IE9SREVSIEJZIDEgREVTQyBMSU1JVCAxIixBUlJBWV9BKT8neXJhJzondHVzY2lhJzsgfQogICRyWydzbXRwX2RlYnVnJ109Z2V0X29wdGlvbignd3BfbWFpbF9zbXRwX2RlYnVnJyk7ICRyWydzbXRwX21haWxlciddPShnZXRfb3B0aW9uKCd3cF9tYWlsX3NtdHAnKVsnbWFpbCddWydtYWlsZXInXT8/bnVsbCk7CiAgJGxmPWluaV9nZXQoJ2Vycm9yX2xvZycpOyAkc3o9ZmlsZXNpemUoJGxmKTsgJGZoPWZvcGVuKCRsZiwncicpOyBmc2VlaygkZmgsbWF4KDAsJHN6LTYwMDAwMDApKTsgJHR4PWZyZWFkKCRmaCw2MDAwMDAwKTsgZmNsb3NlKCRmaCk7ICRoPVtdOwogIGZvcmVhY2goZXhwbG9kZSgiXG4iLCR0eCkgYXMgJGxuKXsgaWYocHJlZ19tYXRjaCgnI1xbKDFbMy02XS1Ob3YtMjAyNikjJywkbG4pICYmIHByZWdfbWF0Y2goJy9zbXRwfG1haWx8UEhQTWFpbGVyfGdtYWlsfGdvb2dsZXxvYXV0aHx0b2tlbi9pJywkbG4pKSAkaFtdPW1iX3N1YnN0cigkbG4sMCwyNjApOyB9ICRyWydtYWlsX2xvZyddPWFycmF5X3NsaWNlKCRoLDAsMzApOyAkclsnbWFpbF9sb2dfbiddPWNvdW50KCRoKTsKICAkZGY9V1BfUExVR0lOX0RJUi4nL3BldHNob3AtYXYtZHJvcHNoaXAvcGV0c2hvcC1hdi1kcm9wc2hpcC5waHAnOyBpZighaXNfZmlsZSgkZGYpKXsgZm9yZWFjaChnbG9iKFdQX1BMVUdJTl9ESVIuJy8qL3BldHNob3AtYXYtZHJvcHNoaXAqLnBocCcpPzpbXSBhcyAkZykgJGRmPSRnOyB9ICRyWydkcm9wc2hpcF9maWxlJ109WyRkZixpc19maWxlKCRkZik/c3Vic3RyKG1kNV9maWxlKCRkZiksMCw4KTonbmVyYScsIGlzX2ZpbGUoJGRmKT9tYl9zdWJzdHIoZmlsZV9nZXRfY29udGVudHMoJGRmLGZhbHNlLG51bGwsMCw2MDApLDAsNjAwKTonJ107CiAgaWYoaXNfZmlsZSgkZGYpKXsgJHM9ZmlsZV9nZXRfY29udGVudHMoJGRmKTsgJGhpdHM9W107IGZvcmVhY2goZXhwbG9kZSgiXG4iLCRzKSBhcyAkaT0+JGxuKXsgaWYocHJlZ19tYXRjaCgnL3Bha2FydHxpxaEgbmF1am98aXMgbmF1am98cmVzZW5kfG51aW10aXxhdHp5bWV0aXxhdMW+eW3El3RpfHBlcmR1b3RpX2lzX25hdWpvfGlyX3BlcmR1b3R1cy9pJywkbG4pKSAkaGl0c1tdPSgkaSsxKS4nOiAnLm1iX3N1YnN0cih0cmltKCRsbiksMCwyMDApOyB9ICRyWydkcm9wc2hpcF9oaXRzJ109YXJyYXlfc2xpY2UoJGhpdHMsMCwzMCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFU3xKU09OX0lOVkFMSURfVVRGOF9TVUJTVElUVVRFKTsgZXhpdDsgfSk7Cg==';
const VER='dep-083209';
const GKEY='ps_s1871a';
const PHASES=["1"];
const OUT='analize/s1871_a.json';
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
