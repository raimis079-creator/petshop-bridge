process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzQ1YSBrcmVwc2VsaW8gcHJpbWluaW1haSAtPiBwaXJraW1haSAocmVhZC1vbmx5KSAqLwphZGRfYWN0aW9uKCd3cF9sb2FkZWQnLCBmdW5jdGlvbigpewogIGlmKCFpc3NldCgkX0dFVFsncHNfczE3NDVhJ10pKSByZXR1cm47ICRmPSRfR0VUWydwc19zMTc0NWEnXTsgZ2xvYmFsICR3cGRiOyAkUD0kd3BkYi0+cHJlZml4OyAkcj1bJ3YnPT4nUzE3NDVhJywnZmF6ZSc9PiRmXTsKICBpZigkZj09PScxJyl7CiAgICBmb3JlYWNoKFsncHNfY2FydHMnLCdwc19lbWFpbF9qb2JzJ10gYXMgJHQpeyAkclsnY29scyddWyR0XT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfSR0Iik7IH0KICAgICRjPSRyWydjb2xzJ11bJ3BzX2VtYWlsX2pvYnMnXTsgJHRjPW51bGw7IGZvcmVhY2goWyd0eXBlJywndGlwYXMnLCdqb2JfdHlwZScsJ2tpbmQnLCd0ZW1wbGF0ZSddIGFzICR4KXsgaWYoaW5fYXJyYXkoJHgsJGMpKXsgJHRjPSR4OyBicmVhazsgfSB9CiAgICAkc2M9aW5fYXJyYXkoJ3N0YXR1cycsJGMpPydzdGF0dXMnOiInJyI7CiAgICBpZigkdGMpICRyWydqb2JzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgJHRjIHQsICRzYyBzLCBDT1VOVCgqKSBuLCBNSU4oY3JlYXRlZF9hdCkgbnVvLCBNQVgoY3JlYXRlZF9hdCkgaWtpIEZST00geyRQfXBzX2VtYWlsX2pvYnMgR1JPVVAgQlkgMSwyIE9SREVSIEJZIDEiLEFSUkFZX0EpOwogICAgJHJbJ2NhcnRzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgQ09VTlQoKikgbiwgU1VNKGNvbnZlcnRlZF9vcmRlcl9pZCBJUyBOT1QgTlVMTCkga29udiwgTUlOKGNyZWF0ZWRfYXQpIG51byBGUk9NIHskUH1wc19jYXJ0cyIsQVJSQVlfQSk7CiAgICAkclsnY2FydF9wdnonXT0kd3BkYi0+Z2V0X3JvdygiU0VMRUNUICogRlJPTSB7JFB9cHNfY2FydHMgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIixBUlJBWV9BKTsKICAgICRyWydqb2JfcHZ6J109JHdwZGItPmdldF9yb3coIlNFTEVDVCAqIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgIi4oJHRjPyIkdGMgTElLRSAnJWNhcnQlJyBPUiAkdGMgTElLRSAnJWtyZXAlJyI6IjEiKS4iIE9SREVSIEJZIGlkIERFU0MgTElNSVQgMSIsQVJSQVlfQSk7CiAgICBmb3JlYWNoKFsnY2FydF9wdnonLCdqb2JfcHZ6J10gYXMgJGspeyBpZihpc19hcnJheSgkclska10pKSBmb3JlYWNoKCRyWyRrXSBhcyAka2s9PiR2dil7IGlmKGlzX3N0cmluZygkdnYpJiZzdHJsZW4oJHZ2KT4xMjApICRyWyRrXVska2tdPXN1YnN0cigkdnYsMCwxMjApLifigKYnOyBpZihwcmVnX21hdGNoKCcvbWFpbHxlbWFpbHxwaG9uZXx0ZWx8bmFtZXx2YXJkYXMvaScsJGtrKSkgJHJbJGtdWyRra109JyoqKic7IH0gfQogIH0KCiAgaWYoJGY9PT0nMicpewogICAgJHJbJ2Zsb3dzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdywgc3RhdHVzLCBDT1VOVCgqKSBuLCBNSU4oY3JlYXRlZF9hdCkgbnVvLCBNQVgoc2VudF9hdCkgcGFzayBGUk9NIHskUH1wc19lbWFpbF9qb2JzIEdST1VQIEJZIDEsMiBPUkRFUiBCWSAxLDIiLEFSUkFZX0EpOwogICAgJGpvYnM9JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgaWQsIGZsb3csIHN0YXR1cywgcmVjaXBpZW50X2VtYWlsIGUsIHNlbnRfYXQsIG9wZW5lZF9hdCwgY2xpY2tlZF9hdCwgY29udGV4dF9qc29uLCBjcmVhdGVkX2F0IEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgKGZsb3cgTElLRSAnJWNhcnQlJyBPUiBmbG93IExJS0UgJyVrcmVwJScgT1IgZmxvdyBMSUtFICclYWJhbmRvbiUnKSBBTkQgc3RhdHVzPSdzZW50JyBPUkRFUiBCWSBzZW50X2F0IixBUlJBWV9BKTsKICAgICRyWydwdnpfY3R4J109JGpvYnM/bWJfc3Vic3RyKCRqb2JzWzBdWydjb250ZXh0X2pzb24nXSwwLDIwMCk6bnVsbDsKICAgICRyWydzaXVzdGEnXT1bXTsKICAgIGZvcmVhY2goJGpvYnMgYXMgJGopewogICAgICAkY3R4PWpzb25fZGVjb2RlKChzdHJpbmcpJGpbJ2NvbnRleHRfanNvbiddLHRydWUpPzpbXTsgJGNpZD0kY3R4WydjYXJ0X2lkJ10/PygkY3R4WydjYXJ0J10/P251bGwpOyAkY2FydD1udWxsOwogICAgICBpZigkY2lkKSAkY2FydD0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGlkLHN0YXR1cyxjb252ZXJ0ZWRfb3JkZXJfaWQsY3JlYXRlZF9hdCBGUk9NIHskUH1wc19jYXJ0cyBXSEVSRSBjYXJ0X2lkPSVzIE9SIGlkPSVzIExJTUlUIDEiLCRjaWQsJGNpZCksQVJSQVlfQSk7CiAgICAgICRvcmRzPXdjX2dldF9vcmRlcnMoWydiaWxsaW5nX2VtYWlsJz0+JGpbJ2UnXSwnbGltaXQnPT41LCd0eXBlJz0+J3Nob3Bfb3JkZXInLCdvcmRlcmJ5Jz0+J2RhdGUnLCdvcmRlcic9PidBU0MnLCdkYXRlX2NyZWF0ZWQnPT4nPj0nLnN0cnRvdGltZSgkalsnc2VudF9hdCddLicgVVRDJyktMF0pOwogICAgICAkcG89W107IGZvcmVhY2goJG9yZHMgYXMgJG8peyAkcG9bXT1bJG8tPmdldF9vcmRlcl9udW1iZXIoKSwkby0+Z2V0X2RhdGVfY3JlYXRlZCgpLT5kYXRlKCdtLWQgSDppJyksJG8tPmdldF9zdGF0dXMoKSxyb3VuZCgoZmxvYXQpJG8tPmdldF90b3RhbCgpLDIpLCRvLT5nZXRfbWV0YSgnX3BzX3Jlc3RvcmVfY2FydCcpPydyZXN0b3JlJzonJ107IH0KICAgICAgJHJbJ3NpdXN0YSddW109Wydqb2InPT4kalsnaWQnXSwnZmxvdyc9PiRqWydmbG93J10sJ3NpdXN0YSc9PiRqWydzZW50X2F0J10sJ2F0aWQnPT4kalsnb3BlbmVkX2F0J10/MTowLCdwYXNwJz0+JGpbJ2NsaWNrZWRfYXQnXT8xOjAsJ2NhcnQnPT4kY2FydD9bJGNhcnRbJ3N0YXR1cyddLCRjYXJ0Wydjb252ZXJ0ZWRfb3JkZXJfaWQnXSwkY2FydFsnY3JlYXRlZF9hdCddXTpudWxsLCd1enNfcG8nPT4kcG9dOwogICAgfQogIH0KCiAgaWYoJGY9PT0nMycpewogICAgJHJbJ3NraXAnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmbG93LCBDT0FMRVNDRShza2lwX3JlYXNvbixibG9ja19yZWFzb24sJz8nKSBwciwgQ09VTlQoKikgbiwgTUFYKGNyZWF0ZWRfYXQpIHBhc2sgRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93IExJS0UgJ2NhcnQlJyBBTkQgc3RhdHVzPSdza2lwcGVkJyBHUk9VUCBCWSAxLDIgT1JERVIgQlkgMSwzIERFU0MiLEFSUkFZX0EpOwogICAgJHJbJ2pvYnNfcG9fMDkyMSddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGZsb3csc3RhdHVzLENPVU5UKCopIG4gRlJPTSB7JFB9cHNfZW1haWxfam9icyBXSEVSRSBmbG93IExJS0UgJ2NhcnQlJyBBTkQgY3JlYXRlZF9hdD49JzIwMjYtMDktMjEgMTI6MDAnIEdST1VQIEJZIDEsMiIsQVJSQVlfQSk7CiAgICAkclsnY2FydHNfc3VfZW1haWxfZCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIERBVEUoY3JlYXRlZF9hdCkgZCwgQ09VTlQoKikgbiwgU1VNKGVtYWlsIElTIE5PVCBOVUxMIEFORCBlbWFpbDw+JycpIHN1X2VtYWlsLCBTVU0oc3RhdHVzPSdhYmFuZG9uZWQnKSBhYmFuZCwgU1VNKHN0YXR1cz0nYWJhbmRvbmVkJyBBTkQgZW1haWw8PicnIEFORCBlbWFpbCBJUyBOT1QgTlVMTCkgYWJhbmRfZW1haWwsIFNVTShjb252ZXJ0ZWRfb3JkZXJfaWQgSVMgTk9UIE5VTEwpIGtvbnYgRlJPTSB7JFB9cHNfY2FydHMgV0hFUkUgY3JlYXRlZF9hdD49JzIwMjYtMDktMTgnIEdST1VQIEJZIDEgT1JERVIgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnc3RhdHVzYWknXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBzdGF0dXMsIENPVU5UKCopIG4gRlJPTSB7JFB9cHNfY2FydHMgR1JPVVAgQlkgMSIsQVJSQVlfQSk7CiAgICAkclsnb3BjJ109W107IGZvcmVhY2goJHdwZGItPmdldF9jb2woIlNFTEVDVCBvcHRpb25fbmFtZSBGUk9NIHskUH1vcHRpb25zIFdIRVJFIG9wdGlvbl9uYW1lIExJS0UgJyVhYmFuZG9uJScgT1Igb3B0aW9uX25hbWUgTElLRSAncHNfY2FydCUnIE9SIG9wdGlvbl9uYW1lIExJS0UgJyVrcmVwc2VsJScgTElNSVQgMjAiKSBhcyAkbyl7ICR2PWdldF9vcHRpb24oJG8pOyAkclsnb3BjJ11bJG9dPWlzX3NjYWxhcigkdik/bWJfc3Vic3RyKChzdHJpbmcpJHYsMCwxNTApOm1iX3N1YnN0cih3cF9qc29uX2VuY29kZSgkdiksMCwzMDApOyB9CiAgICAkclsnY3JvbiddPVtdOyBmb3JlYWNoKChhcnJheSlfZ2V0X2Nyb25fYXJyYXkoKSBhcyAkdD0+JGgpeyBmb3JlYWNoKCRoIGFzICRoaz0+JHgpeyBpZihwcmVnX21hdGNoKCcvY2FydHxhYmFuZG9ufGVtYWlsX2pvYnxwc19lbWFpbHxmbG93L2knLCRoaykpICRyWydjcm9uJ11bJGhrXT1nbWRhdGUoJ20tZCBIOmknLCR0KTsgfSB9CiAgfQogIGVjaG8gd3BfanNvbl9lbmNvZGUoJHIsSlNPTl9VTkVTQ0FQRURfVU5JQ09ERXxKU09OX1BSRVRUWV9QUklOVCk7IGV4aXQ7Cn0pOwo=';
const VER='dep-161513';
const GKEY='ps_s1745a';
const PHASES=["3"];
const OUT='out/s1745_a.json';
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
