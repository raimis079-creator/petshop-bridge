process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
const TOK=process.env.GH_TOKEN||''; const REPO=process.env.GH_REPO||'raimis079-creator/petshop-bridge';
const WP=process.env.WP_URL||'https://dev.avesa.lt';
const AUTH='Basic '+Buffer.from(process.env.WP_USER+':'+process.env.WP_APP_PASS).toString('base64');
const B64='PD9waHAKLyoqIFBsdWdpbiBOYW1lOiBURU1QIFBTIFMxNzk1cmYgcmVmaWxsIGFuYWxpemUgbnVvIG1pZ3JhY2lqb3MgKHJlYWQtb25seSkgKi8KYWRkX2FjdGlvbignd3BfbG9hZGVkJywgZnVuY3Rpb24oKXsKICBpZighaXNzZXQoJF9HRVRbJ3BzX3MxNzk1cmYnXSkpIHJldHVybjsgQHNldF90aW1lX2xpbWl0KDE1MCk7IGdsb2JhbCAkd3BkYjsgJFA9JHdwZGItPnByZWZpeDsgJHI9Wyd2Jz0+J1MxNzk1cmYnXTsKICB0cnl7CiAgJHJbJ2VqX2NvbHMnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBDT0xVTU5TIEZST00geyRQfXBzX2VtYWlsX2pvYnMiKTsKICAkclsncmVmaWxsX2xlbnQnXT0kd3BkYi0+Z2V0X2NvbCgiU0hPVyBUQUJMRVMgTElLRSAneyRQfXBzX3JlZmlsbCUnIik7CiAgZm9yZWFjaCgkclsncmVmaWxsX2xlbnQnXSBhcyAkdCl7ICRyWydsZW50J11bJHRdPVsnY29scyc9PiR3cGRiLT5nZXRfY29sKCJTSE9XIENPTFVNTlMgRlJPTSAkdCIpLCduJz0+JHdwZGItPmdldF92YXIoIlNFTEVDVCBDT1VOVCgqKSBGUk9NICR0IildOyB9CiAgJHJbJ2Zsb3dzJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgZmxvdyxzdGF0dXMsQ09VTlQoKikgbixNSU4oY3JlYXRlZF9hdCkgbnVvIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdyBMSUtFICclcmVmaWxsJScgR1JPVVAgQlkgZmxvdyxzdGF0dXMiLEFSUkFZX0EpOwogICRvaz0iKGYudGVzdGluaXM9MCBPUiBmLnRlc3RpbmlzIElTIE5VTEwpIEFORCBmLnN0YXR1c2FzX2dhbHV0aW5pcyBOT1QgSU4gKCdjYW5jZWxsZWQnLCdmYWlsZWQnLCdyZWZ1bmRlZCcsJ3BlbmRpbmcnLCd0cmFzaCcsJ2NoZWNrb3V0LWRyYWZ0JykiOwogIC8vIHNpdXN0aSByZWZpbGwgbGFpc2thaQogICRqb2JzPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIGlkLHJlY2lwaWVudF9lbWFpbCBlbSxDT0FMRVNDRShzZW50X2F0LGRlY2lzaW9uX2F0LGNyZWF0ZWRfYXQpIHNlbnRfYXQsY2xpY2tlZF9hdCxzdGF0dXMsc2tpcF9yZWFzb24sYmxvY2tfcmVhc29uIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdyBMSUtFICdyZWZpbGwlJyBBTkQgc3RhdHVzIElOICgnc2VudCcsJ3NraXBwZWQnKSBPUkRFUiBCWSAzIixBUlJBWV9BKTsKICAkclsnc2l1c3RhJ109Y291bnQoJGpvYnMpOyAkclsnc2tpcCddPSR3cGRiLT5nZXRfcmVzdWx0cygiU0VMRUNUIHN0YXR1cyxDT0FMRVNDRShza2lwX3JlYXNvbixibG9ja19yZWFzb24pIHdoeSxDT1VOVCgqKSBuIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdz0ncmVmaWxsX2R1ZScgR1JPVVAgQlkgMSwyIixBUlJBWV9BKTsgJHJbJ2N0eCddPSR3cGRiLT5nZXRfdmFyKCJTRUxFQ1QgY29udGV4dF9qc29uIEZST00geyRQfXBzX2VtYWlsX2pvYnMgV0hFUkUgZmxvdz0ncmVmaWxsX2R1ZScgQU5EIHN0YXR1cz0nc2VudCcgT1JERVIgQlkgaWQgREVTQyBMSU1JVCAxIik7CiAgJHBlcj1bXTsgJHBpcmt0YT1bXTsgCiAgZm9yZWFjaCgkam9icyBhcyAkail7ICR3az0oJGpbJ3N0YXR1cyddPT09J3NlbnQnPydTICc6J1ggJy4oJGpbJ3NraXBfcmVhc29uJ10/OiRqWydibG9ja19yZWFzb24nXSkuJyAnKS5kYXRlKCdtLWQnLHN0cnRvdGltZSgnbW9uZGF5IHRoaXMgd2Vlaycsc3RydG90aW1lKCRqWydzZW50X2F0J10pKSk7ICRwZXJbJHdrXVsnc2l1c3RhJ109KCRwZXJbJHdrXVsnc2l1c3RhJ10/PzApKzE7CiAgICAkbz0kd3BkYi0+Z2V0X3Jvdygkd3BkYi0+cHJlcGFyZSgiU0VMRUNUIGYudXpzYWt5bWFzX2lkIGlkLGYuZGllbmEsZi52aXNvX2N0LGYua29udHJpYnVjaWphX2N0LGYudXRtX3NvdXJjZSxmLnV0bV9jYW1wYWlnbixmLmthbmFsYXNfcGFza3V0aW5pcyBrYW4sby5kYXRlX2NyZWF0ZWRfZ210IGR0IEZST00geyRQfXBzX2Zha3RfdXpzYWt5bWFpIGYgSk9JTiB7JFB9d2Nfb3JkZXJzIG8gT04gby5pZD1mLnV6c2FreW1hc19pZCBXSEVSRSAkb2sgQU5EIG8uYmlsbGluZ19lbWFpbD0lcyBBTkQgby5kYXRlX2NyZWF0ZWRfZ210PiVzIEFORCBvLmRhdGVfY3JlYXRlZF9nbXQ8PURBVEVfQUREKCVzLElOVEVSVkFMIDE0IERBWSkgT1JERVIgQlkgby5kYXRlX2NyZWF0ZWRfZ210IExJTUlUIDEiLCRqWydlbSddLCRqWydzZW50X2F0J10sJGpbJ3NlbnRfYXQnXSksQVJSQVlfQSk7CiAgICBpZigkbyl7ICR3bz13Y19nZXRfb3JkZXIoJG9bJ2lkJ10pOyAkZD0oc3RydG90aW1lKCRvWydkdCddKS1zdHJ0b3RpbWUoJGpbJ3NlbnRfYXQnXSkpLzg2NDAwOyAkcGVyWyR3a11bJ3BpcmtvMTQnXT0oJHBlclskd2tdWydwaXJrbzE0J10/PzApKzE7IGlmKCRkPD03KSAkcGVyWyR3a11bJ3BpcmtvNyddPSgkcGVyWyR3a11bJ3BpcmtvNyddPz8wKSsxOwogICAgICAkcGlya3RhW109Wydqb2InPT4kalsnaWQnXSwnbnInPT4kd28/JHdvLT5nZXRfb3JkZXJfbnVtYmVyKCk6JG9bJ2lkJ10sJ3BvX2QnPT5yb3VuZCgkZCwxKSwnZXVyJz0+JG9bJ3Zpc29fY3QnXS8xMDAsJ2tvbnRyJz0+JG9bJ2tvbnRyaWJ1Y2lqYV9jdCddLzEwMCwndXRtJz0+JG9bJ3V0bV9zb3VyY2UnXS4nLycuJG9bJ3V0bV9jYW1wYWlnbiddLCdrYW4nPT4kb1sna2FuJ10sJ2NsaWNrJz0+JGpbJ2NsaWNrZWRfYXQnXT8xOjAsJ3NlbnQnPT5zdWJzdHIoJGpbJ3NlbnRfYXQnXSwwLDEwKSwnc3QnPT4kalsnc3RhdHVzJ10sJ3doeSc9PiRqWydza2lwX3JlYXNvbiddPzokalsnYmxvY2tfcmVhc29uJ11dOyB9CiAgICBpZigkalsnY2xpY2tlZF9hdCddKSAkcGVyWyR3a11bJ2NsaWNrJ109KCRwZXJbJHdrXVsnY2xpY2snXT8/MCkrMTsKICB9CiAga3NvcnQoJHBlcik7ICRyWydzYXZhaXRlcyddPSRwZXI7ICRyWydwaXJrbyddPSRwaXJrdGE7CiAgJHJbJ3V0bV91enMnXT0kd3BkYi0+Z2V0X3Jlc3VsdHMoIlNFTEVDVCBmLmRpZW5hLGYudXpzYWt5bWFzX2lkLGYudmlzb19jdC8xMDAgZXVyLGYudXRtX3NvdXJjZSxmLnV0bV9jYW1wYWlnbixmLnV0bV9tZWRpdW0gRlJPTSB7JFB9cHNfZmFrdF91enNha3ltYWkgZiBXSEVSRSAkb2sgQU5EIChmLnV0bV9jYW1wYWlnbiBMSUtFICclcmVmaWxsJScgT1IgZi51dG1fY29udGVudCBMSUtFICclcmVmaWxsJScpIE9SREVSIEJZIGYuZGllbmEiLEFSUkFZX0EpOwogIC8vIGhvbGRvdXQKICBpZihpbl9hcnJheSgkUC4ncHNfcmVmaWxsX3RyYWNraW5nJywkclsncmVmaWxsX2xlbnQnXSkpeyAkclsndHJhY2tpbmdfc2FtcGxlJ109JHdwZGItPmdldF9yZXN1bHRzKCJTRUxFQ1QgKiBGUk9NIHskUH1wc19yZWZpbGxfdHJhY2tpbmcgT1JERVIgQlkgMSBERVNDIExJTUlUIDMiLEFSUkFZX0EpOyB9CiAgJHJbJ29wdCddPVsnaG9sZG91dCc9PmdldF9vcHRpb24oJ3BzX3JlZmlsbF9ob2xkb3V0JyksJ251c3QnPT5nZXRfb3B0aW9uKCdwZXRzaG9wX3JlZmlsbF9zZXR0aW5ncycpXTsKICB9Y2F0Y2goVGhyb3dhYmxlICRlKXsgJHJbJ0VSUiddPSRlLT5nZXRNZXNzYWdlKCk7IH0KICBoZWFkZXIoJ0NvbnRlbnQtVHlwZTogYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpOyBlY2hvIGpzb25fZW5jb2RlKCRyLEpTT05fVU5FU0NBUEVEX1VOSUNPREV8SlNPTl9VTkVTQ0FQRURfU0xBU0hFUyk7IGV4aXQ7IH0pOwo=';
const VER='dep-164155';
const GKEY='ps_s1795rf';
const PHASES=["1"];
const OUT='analize/s1795_rf.json';
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
